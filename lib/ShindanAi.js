const EventEmitter = require('events').EventEmitter;
const _ = require('lodash');

class ShindanAi extends EventEmitter {
    constructor(opts = {}) {
        super();
        this.questions = opts.questions || {};
        this.results = opts.results || {};
        this.initialSceneId = opts.initialSceneId;
        this.sceneLog = [];
    }

    start (id) {
        const startId = id || this.initialSceneId;
        if (startId) {
            this.setScene(startId);
        } else {
            this.randomQuestion();
        }
    }

    setScene (id) {
        if (this.results[id]) {
            return this.setResult(id);
        }
        if (this.questions[id]) {
            return this.setQuestion(id);
        }
        throw new Error(`"${id}" is invalid scene id.`);
    }

    setQuestion (qId) {
        const question = this.questions[qId];
        if (!question) {
            throw new Error(`Question "${qId}" is not found.`);
        }
        this.sceneLog.push({
            id: qId
        });
        this.emit('question', question);
    }

    setResult (rId) {
        const result = this.results[rId];
        if (!result) {
            throw new Error(`Result "${rId}" is not found.`);
        }
        this.emit('result', result);
    }

    randomQuestion () {
        const rest = _.difference(
            Object.keys(this.questions),
            _.map(this.sceneLog, 'id')
        );
        if (rest.length) {
            this.setQuestion(_.sample(rest));
        } else {
            this.setResultWithScore();
        }
    }

    setResultWithScore () {
        const score = {};
        _.forEach(this.sceneLog, (scene) => {
            const question = this.questions[scene.id];
            const option = question.option[scene.answer];
            _.forEach(option.score, (point, id) => {
                score[id] = (score[id] || 0) + point;
            });
        });

        const choice = _(score).map((point, id) => {
            return {
                id: id,
                point: point
            };
        }).shuffle().maxBy('point');

        this.setResult(choice.id);
    }

    sendAnswer (index) {
        const currentScene = _.last(this.sceneLog);
        const question = this.questions[currentScene.id];
        if (!question || !question.option) {
            throw new Error('Invalid state. There is no option.');
        }

        const answer = question.option[index];
        if (!answer) {
            throw new Error(`"${index}" is invalid option index.`);
        }

        currentScene.answer = index;

        if (answer.to) {
            this.setScene(answer.to);
        } else {
            this.randomQuestion();
        }
    }
}

module.exports = ShindanAi;
