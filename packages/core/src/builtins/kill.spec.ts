import { kill, cmdr } from './kill';
import { Command } from 'commander';

describe('kill', () => {
    describe('cmdr', () => {
        it('parses opts correctly', () => {
            const pid = '18273';
            const signal = '3';
            let c = cmdr.parse(['C:\\Program Files\\nodejs\\node.exe', 'foo.js', pid, '-s', signal]);
            console.log(c);
            expect(c.pid).toBeDefined();
            expect(c.pid).toEqual(pid);
            expect(c.signal).toEqual(signal);
        });
    });
});