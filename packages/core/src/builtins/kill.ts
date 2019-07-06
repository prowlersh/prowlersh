import { REPLCommand } from 'repl';
import { Command } from 'commander';

// const cmdr = () => new Command()
//     .description('Send a kill signal to a program.')
//     .arguments('<pid>')
//     .option('-s --signal', 'The kill signal you wish to send to the process');

export const cmdr = new Command()
    .name('kill')
    .description('Send a kill signal to a program.')
    .arguments('<pid>')
    .action((pid) => {
        cmdr.pid = pid;
    })
    .option('-s --signal', 'The kill signal you wish to send to the process');


export function kill(args: string) {
    const splitArgs = args.split(' ');
    const arg1 = splitArgs.shift();
    const pid = Number.parseInt(arg1!);  // Number.parseInt(undefined) === NaN
    if (pid === NaN) {
        throw Error(`Invalid argument: ${arg1}`);
    } else {
        process.kill(pid);
    }
}

const cmd: REPLCommand = {
    action: kill,
    help
};

export default cmd;
