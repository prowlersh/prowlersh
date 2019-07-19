import { REPLCommand } from 'repl';
import parse from 'yargs-parser';

export function cwd() {    
    process.cwd();
}

const cwdCommand: REPLCommand = {
    action(text: string) {
        if (text.length > 0)
            throw new Error('cwd does not take any arguments.');
        cwd();
    },
    help: 'Prints out the current working directory.'
}

export default cwdCommand;
