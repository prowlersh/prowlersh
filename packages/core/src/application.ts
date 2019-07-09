import readline from 'readline';
import repl from 'repl';
import path from 'path';
import { ReadStream } from 'tty';
import { Readable, Writable, Transform } from 'stream';
import { readdir, stat } from 'fs';
import { promisify } from 'util';

export class Application {
    private _repl: repl.REPLServer;
    private _rl: readline.ReadLine;
    constructor(
    ) {
        // const replStream = new Readable();
        const replStream = new Transform({});
        replStream.on('error', replStream.destroy);
        process.stdin.on('data', data => {
            // Todo: Check for ctrl keys
            replStream.write(data);
        });
        this._repl = repl.start({
            input: replStream,
            output: process.stdout
        });
        this._rl = readline.createInterface(process.stdin, process.stdout);
    }

    async loadBuiltins() {
        const rd = promisify(readdir);
        const s = promisify(stat);
        const directoryComtents = await rd(path.join(__dirname, 'builtins'));
        for (const filePath of directoryComtents) {
            const fileStat = await s(filePath);
            const { name } = path.parse(filePath);

            if (fileStat.isDirectory())
                continue;

            if(name.match(/\.md|\.spec|\.test/) !== null || !name.match(/\.js/))
                continue;

            const mod = await import(name);
            this._repl.defineCommand(name.replace('.js', ''), mod);
        }
    }
}
