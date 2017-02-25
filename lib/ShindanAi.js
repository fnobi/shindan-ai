const EventEmitter = require('events').EventEmitter;

class ShindanAi extends EventEmitter {
    constructor(opts = {}) {
        super();
        this.questions = opts.questions || {};
        this.results = opts.results || {};
        this.initialSceneId = opts.initialSceneId;
        this.currentProps = null;
    }

    start (id) {
        this.setScene(id || this.initialSceneId);
    }

    setScene (id) {
        if (this.results[id]) {
            return this.setResult(id);
        }
        if (this.questions[id]) {
            return this.setQuestion(id);
        }
        throw new Error(`${id}" is invalid scene id.`);
    }

    setQuestion (qId) {
        const question = this.questions[qId];
        if (!question) {
            throw new Error(`Question "${qId}" is not found.`);
        }
        this.currentProps = question;
        this.emit('question', question);
    }

    setResult (rId) {
        const result = this.results[rId];
        if (!result) {
            throw new Error(`Result "${rId}" is not found.`);
        }
        this.currentProps = result;
        this.emit('result', result);
    }

    sendAnswer (index) {
        const props = this.currentProps;
        if (!props || !props.option) {
            throw new Error('Invalid state. There is no option.');
        }

        const answer = props.option[index];
        if (!answer) {
            throw new Error(`"${index}" is invalid option index.`);
        }

        if (answer.to) {
            this.setScene(answer.to);
        }
    }
}

module.exports = ShindanAi;
