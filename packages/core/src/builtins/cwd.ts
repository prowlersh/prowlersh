import { REPLCommand } from 'repl';

export function cwd() {    
    return process.cwd();
}

const cwdCommand: REPLCommand = {
    action(text: string) {
        if (text.length > 0)
            throw new Error('cwd does not take any arguments.');
        return cwd();
    },
    help: 'Prints out the current working directory.'
}

export default cwdCommand;
