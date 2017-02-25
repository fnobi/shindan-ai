const expect = require('chai').expect;
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
                expect(result.name).is.eql(resultName);
                next();
            });

            shindan.start();
        }, done);
    });
});
