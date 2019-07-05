import chalk from 'chalk';
import repl from 'repl';
import { config } from 'dotenv';
config();

const replServer = repl.start({
    prompt: '> '
});
