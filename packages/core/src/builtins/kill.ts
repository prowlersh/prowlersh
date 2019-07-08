import { REPLCommand } from 'repl';
import { Command } from 'commander';


export function argsParser() {
    const cmdr = new Command()
        .name('kill')
        .description('Send a kill signal to a program.')
        .arguments('<pid>')
        .action((pid) => {
            cmdr.pid = pid;
        })
        .option('-s --signal <signal>', 'The kill signal you wish to send to the process');

    return cmdr;
}

export function kill(args: string) {
    const splitArgs = args.split(' ');
    // commander expects pos 0 and 1 to be node & filename.js
    // so we insert dummy args ARG1 and ARG2
    splitArgs.unshift('ARG1', 'ARG2');

    const cmd = argsParser().parse(splitArgs);

    if (typeof cmd.pid === 'undefined')
        throw Error('No PID was given.\n' + cmd.helpInformation());
    
    process.kill(cmd.pid, cmd.signal);
}

const cmd: REPLCommand = {
    action: kill,
    help: argsParser().helpInformation()
};

export default cmd;
