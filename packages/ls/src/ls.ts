import chalk from 'chalk';
import { REPLCommand } from 'repl';
import { readdirSync, statSync } from 'fs';

export function ls(args: string) {
    const files = readdirSync(process.cwd());
    let output = '';
    const width = files.reduce((prev, cur) => prev > cur.length ? prev : cur.length, 0);
    
    for (let i = 0; i < files.length; i++) {
        if (i > 0 && i % 4 === 0) output += '\n';
        const padding = ' '.repeat(width - files[i].length);

        // TODO: Use profile colours
        const colour = statSync(files[i]).isFile() ? chalk.gray : chalk.green;
        output += `${colour(files[i])}${padding}\t`;
    }
    return output;
}

const cmd: REPLCommand = {
    action: ls,
    
};

export default cmd;
