// Example of how to capture tab characters to emulate `ls` when tab is pressed twice sequentially.
// Modified version of this: https://thisdavej.com/making-interactive-node-js-console-apps-that-listen-for-keypress-events/

const fs = require('fs');
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

let tabBuffer = false;

const isTab = key => key.name === 'tab' && !key.shift && !key.ctrl;

process.stdin.on('keypress', (str, key) => {

    if (key.ctrl && key.name === 'c') {
        process.exit();
    }
    else if (tabBuffer === true && isTab(key)) {
        const files = fs.readdirSync(process.cwd());
        let output = '';
        const width = files.reduce((prev, cur) => prev > cur.length ? prev : cur.length, 0);
        console.log('width: ' + width);
        for (let i = 0; i < files.length; i++) {
            console.log('padding: ' + (width - files[i].length).toString());
            const padding = ' '.repeat(width - files[i].length);
            output += `${files[i]}${padding}\t`;
            if (i > 0 && i % 4 === 0) output += '\n';
        }
        console.log(output);
    }
    else if (isTab(key)) {
        console.log('tab key captured');
        tabBuffer = true;
        return;
    }
    else {
        console.log(`You pressed the "${str}" key`);
        console.log();
        console.log(key);
        console.log();
        tabBuffer = false;
    }
});
console.log('Press any key...');
