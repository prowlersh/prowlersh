import { REPLCommand } from 'repl';
import parse from 'yargs-parser';

export function cd(directoryPath: string) {    
    process.chdir(directoryPath);
}

const cdCommand: REPLCommand = {
    action: (text: string) => {
        const args = parse(text);

        cd(args._[0]);
    },
    help: 'Change the current working directory to the specified directory.'
}

export default cdCommand;
