"use strict";

const optimist = require('optimist');
const colors = require('colors');

const ShindanAi = require(__dirname + '/ShindanAi');

(function () {
    const argv = optimist
            .boolean('h')
            .alias('h', 'help')
            .default('h', false)
            .describe('h', 'show this help.')

            .argv;

    if (argv.h) {
        optimist.showHelp();
        return;
    }

    const shindanAi = new ShindanAi();

    shindanAi.on('end', () => {
        console.log('[done]'.green);
    });
    
    shindanAi.on('error', (err) => {
        console.error('[error]'.red, err);
    });

    shindanAi.start();
})();
