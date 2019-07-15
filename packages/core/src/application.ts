import readline from 'readline';
import repl from 'repl';
import path from 'path';
import { Transform, Readable } from 'stream';
import { readdir, stat } from 'fs';
import { promisify } from 'util';

export class Application {
    private readonly _repl: repl.REPLServer;
    // private readonly _rl: readline.ReadLine;
    constructor() {
        // Use a separate stream for the repl since we want to filter out ctrl keys before writing
        const replStream = new Readable();
        replStream.on('error', replStream.destroy);
        process.stdin.on('data', data => {
            // Todo: Check for ctrl keys
            // Todo!: Data isn't currently being emitted back to stdout
            replStream.push(data);  // forward data to replStream
        });
        this._repl = repl.start({
            input: replStream,
            output: process.stdout,
            prompt: 'prowler: '
        });
        replStream.resume();
        // this._rl = readline.createInterface(process.stdin, process.stdout);
    }

    start() {
        process.stdin.resume();
    }

    async loadBuiltins() {
        const rd = promisify(readdir);
        const s = promisify(stat);
        const directoryContents = await rd(path.join(__dirname, 'builtins'));
        for (const filePath of directoryContents) {
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
