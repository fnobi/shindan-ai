const assert = require('power-assert');
const async = require('async');

const ShindanAI = require('../lib/ShindanAI');

describe('shindan-ai', () => {
    it('perform linear questions', (done) => {
        const option = require('./fixture/sample-option-linear1.json');
        const resultNames = [ 'cat', 'human' ];

        async.forEach(resultNames, (resultName, next) => {
            const shindan = new ShindanAI(option);

            shindan.on('question', (question) => {
                const index = resultNames.indexOf(resultName);
                shindan.sendAnswer(index);
            });

            shindan.on('result', (result) => {
                assert.equal(result.name, resultName);
                next();
            });

            shindan.start();
        }, done);
    });

    it('perform score questions', (done) => {
        const option = require('./fixture/sample-option-score1.json');
        const shindan = new ShindanAI(option);

        shindan.on('question', (question) => {
            if (/ear/.test(question.name)) {
                shindan.sendAnswer(0); // yes
            } else if (/fur/.test(question.name)) {
                shindan.sendAnswer(1); // no
            }
        });

        shindan.on('result', (result) => {
            assert.equal(result.name, 'human');
            done();
        });

        shindan.start();
    });
});
