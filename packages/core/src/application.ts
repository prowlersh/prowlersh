import readline from 'readline';
import repl, { REPLServer } from 'repl';
import path from 'path';
import { Transform, Readable } from 'stream';
import fs from 'fs';
import { promisify } from 'util';

export class Application {
    private _repl?: repl.REPLServer;
    private readonly _replStream: Readable;
    constructor() {
        // Use a separate stream for the repl since we want to filter out ctrl keys before writing
        // TODO: Implement _read()
        this._replStream = new Readable();
        this._repl = repl.start({
            input: this._replStream,
            output: process.stdout,
            prompt: 'prowler: '
        });
    }

    start() {
        this._replStream.on('error', this._replStream.destroy);
        process.stdin.on('data', data => {
            // Todo: Check for ctrl keys
            // Todo!: Data isn't currently being emitted back to stdout
            this._replStream.push(data);  // forward data to replStream
        });
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

            if(fileName.match(/\.md|\.spec|\.test/) !== null || !fileName.match(/\.js/))
                continue;

            console.log('Importing ' + fileName);
            const mod = await import(filePath);
            this._repl!.defineCommand(fileName.replace('.js', ''), mod);
        }
    }
}
