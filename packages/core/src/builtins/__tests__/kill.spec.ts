import { kill, argsParser } from '../kill';

describe('kill', () => {
    describe('cmdr', () => {
        it('parses opts correctly', () => {
            const pid = '18273';
            const signal = '3';

            let c = argsParser()
                .parse(['C:\\Program Files\\nodejs\\node.exe', 'foo.js', pid, '-s', signal]);

            expect(c.pid).toBeDefined();
            expect(c.pid).toEqual(pid);
            expect(c.signal).toEqual(signal);
        });

        it('pid is undefined when pid not passed in', () => {
            const signal = '3';

            let c = argsParser()
                .parse(['/usr/bin/node', 'foo.js', '-s', signal]);

            expect(c.pid).toBeUndefined();
            expect(c.signal).toEqual(signal);
        });

        it('helpInformation() outputs help text', () => {
            const c = argsParser();

            const helpText = c.helpInformation();

            expect(helpText).toBeDefined();
            expect(typeof helpText).toBe('string');
        });
    });
});