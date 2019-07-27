import repl from 'repl';
import path from 'path';
import { Readable, Transform } from 'stream';
import fs from 'fs';
import { promisify } from 'util';
import { emitKeypressEvents } from 'readline';
import { EOL } from 'os';

const isTab = (key: any) => key &&
    key.name &&
    key.name === 'tab' &&
    !key.shift &&
    !key.ctrl;

export class Application {
    private readonly _replStream: Readable;

    private tabBufferState = false;
    private _repl: repl.REPLServer;

    constructor() {
        // Use a separate stream for the repl since we want to filter out ctrl keys before writing
        this._replStream = new Transform();
        this._repl = repl.start({
            input: this._replStream,
            output: process.stdout,
            useColors: true,
            prompt: 'prowler: ',
            terminal: true,
        });
    }

    private _onTabbedTwice(str: string) {
        console.log('Pressed tab twice. ' + str);
    }

    start() {
        this._repl.on('exit', () => process.exit(0));
        emitKeypressEvents(process.stdin);
        process.stdin.setRawMode!(true);
        process.stdin.on('keypress', (str, key) => {
            if (key.ctrl && key.name === 'c') {
                process.exit();
            } else if (this.tabBufferState && isTab(key)) {
                this._onTabbedTwice(str);
            } else if (isTab(key)) {
                this.tabBufferState = true;
            } else {
                this.tabBufferState = false;
            }
        });
        process.stdin.on('data', chunk => {
            // TODO: Pre-process data in here
            switch (chunk) {
                case 'u': break;
                default:
                    return this._replStream.push(chunk);
            }
        });
        process.on('SIGINT', s => {
            process.stdout.write(EOL);
        })
        this._replStream.resume();
        process.stdin.resume();
    }

    async loadBuiltins() {
        const readDir = promisify(fs.readdir);
        const stat = promisify(fs.stat);
        const builtinsPath = path.join(__dirname, 'builtins');
        const directoryContents = await readDir(builtinsPath);

        for (const fileName of directoryContents) {
            const filePath = path.join(builtinsPath, fileName);
            const fileStat = await stat(filePath);

            if (fileStat.isDirectory())
                continue;

            if (fileName.match(/\.md|\.spec|\.test|\.map/) !== null || !fileName.match(/\.js/))
                continue;

            const mod = await import(filePath);
            this._repl.defineCommand(fileName.replace('.js', ''), mod.default);
        }
    }
}
