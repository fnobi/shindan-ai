const path = require('path');
const readline = require('readline');

const optimist = require('optimist');
const colors = require('colors');
const _ = require('lodash');

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

    const jsonFile = argv._.shift();
    if (!jsonFile) {
        throw new Error('Pleese set option json file.');
    }
    
    const option = require(path.resolve(jsonFile));

    const shindanAi = new ShindanAi(option);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    shindanAi.on('question', (question) => {
        const message = [
            question.name.green,
            _.map(question.option, (option, index) => {
                return `${index}) ${option.name}`.grey;
            }).join('\n'),
            '> '
        ].join('\n');

        rl.question(message, (answer) => {
            shindanAi.sendAnswer(answer);
        });
    });

    shindanAi.on('result', (result) => {
        console.log(`result: ${result.name.yellow}`);
        rl.close();
    });

    shindanAi.start();
})();
