import readline from 'readline';
import repl from 'repl';
import path from 'path';
import { ReadStream } from 'tty';
import { Readable, Writable } from 'stream';
import { readdir, stat } from 'fs';
import { promisify } from 'util';

export class Application {
    private _repl: repl.REPLServer;
    private _rl: readline.ReadLine;
    constructor(
        inputStream: Readable,
        outputStream: Writable
    ) {
        this._repl = repl.start({
            input: inputStream,
            output: outputStream
        });
        // process.stdin.setRawMode!(true);
        this._rl = readline.createInterface(inputStream, outputStream);

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
