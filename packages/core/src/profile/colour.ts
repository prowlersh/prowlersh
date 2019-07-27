import chalk from 'chalk';

// TODO: Refactor to its own module
export class ColourProfile {
    constructor(
        public primary = chalk.gray,
        public secondary = chalk.green
    ) {
        
    }
}
