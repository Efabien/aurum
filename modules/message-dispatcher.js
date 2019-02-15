module.exports = class MessageDispatcher {
  constructor(modules) {
    this._brain = modules.brain;
    this.process = this.process.bind(this);
  }

  process(text) {
    console.log(text);
    console.log(this._detect(text));
  }

  _detect(text) {
    return this._brain.detect(text);
  }
};
