const expect = require('chai').expect;
const async = require('async');

const ShindanAI = require('../lib/ShindanAI');

const SAMPLE_OPTION = {
    initialSceneId: 'q1',
    questions: {
        q1: {
            name: 'Do you have a tail?',
            option: [{
                name: 'yes',
                to: 'r1'
            }, {
                name: 'yes',
                to: 'r2'
            }]
        }
    },
    results: {
        r1: {
            name: 'cat'
        },
        r2: {
            name: 'human'
        }
    }
};

describe('shindan-ai', () => {
    it('emit result', (done) => {
        const resultNames = [ 'cat', 'human' ];

        async.forEach(resultNames, (resultName, next) => {
            const shindan = new ShindanAI(SAMPLE_OPTION);

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
