import { REPLCommand } from 'repl';
import parse from 'yargs-parser';

export function kill(pid: number, signal?: string | number) {    
    process.kill(pid, signal);
}

const killCommand: REPLCommand = {
    action: (text: string) => {
        const args = parse(text, {
            alias: {
                signal: [ 's' ]
            }
        });

        kill(Number.parseInt(args._[0]), args.signal);
    },
    help: 'Attempts to kill a process by sending a signal to it.'
}

export default killCommand;
