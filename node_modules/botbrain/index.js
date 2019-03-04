const brain = require('./brain');
const _ = require('lodash');
const vectors = require('./lib/vectors');

module.exports = class Brain {
  constructor(knowledges, configs) {
    this._brain = brain;

    this._knowledge = knowledges.reduce((item, result) => {
      result.keyWords = _.merge(result.keyWords, item.keyWords);
      result.intents = _.merge(result.intents, item.intents);
      return result;
    }, { keyWords: {}, intents: {} });
    
    this._degree = configs.degree;
    this._scope = configs.scope;

    this._feed();
    this.signatureVectors = this._generateSignatureVectors()
  }

  _feed() {
    this._brain.feed(
      this._knowledge.keyWords,
      this._knowledge.intents,
      this._scope,
      this._degree
    );
  }

  detect(input) {
    return this._brain.detect(input);
  }

  guess(input) {
    const analyse = this._brain.detect(input);
    const analyseVector = this._toVector(analyse);
    const scores = this.signatureVectors.map(vector => {
      const key = Object.keys(vector)[0];
      const value = vector[key];
      const diffs = vectors.substract([analyseVector, value]);
      const score = diffs.reduce((result, current, index, array) => {
        return array.slice(index + 1, array.length - 1).reduce((acc, item) => {
          return acc += Math.atan2(current, item);
        }, result);
      }, 0);
      return { [key]: score }
    });
    return scores;
  }

  extract(input, what) {
    return this._brain.extract(input, what);
  }

  extractAll(input) {
    return this._brain.extractAll(input);
  }

  freeExtract(input) {
    return this._brain.extractAll(input);
  }

  _generateSignatureVectors() {
    return this._brain.generateSignatureVectors();
  }

  _toVector(analyse) {
    return analyse.reduce((result, current) => {
      return Object.assign(result, { [current.intent]: current.score });
    }, {});
  }
}
