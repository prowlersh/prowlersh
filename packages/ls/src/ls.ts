import chalk from 'chalk';
import { REPLCommand } from 'repl';
import cmder from 'commander';

const help = `

`;

export function ls(args: string) {

}

const cmd: REPLCommand = {
    action: ls,
    help
};

export default cmd;
