const strTool = require('./lib/strings');
const vectors = require('./lib/vectors');

const brain = (() => {
  let keyWords;
  let intents;
  let scope;
  let degree;

  const _feed = (x, y, z, foo) => {
    keyWords = x;
    intents = strTool.preCompute(y);
    scope = z;
    degree = foo;
  };

  const _depth = (what) => {
    let res = 0;
    let keys = [];
    for(var key in keyWords[what]){
      keys = keys.concat(keyWords[what][key]);
    }
    return keys.reduce((result, item) => {
      return item.length > result ? item.length : result;
    }, 0);
  };

  const _extract = (txt, what) => {
    const preselcted = [];
    const data = txt.split(' ');
    for(let key in keyWords[what]){
      keyWords[what][key].forEach((element) => {
        for(let i = 1; i <= _depth(what); i++){
          strTool.portionReading(data,i,function(array){
            if(strTool.exactMatch(element,array,degree)){
              preselcted.push(key);
            }
          });    
        }
      });
    }
    const hold = {};
    hold[what] = preselcted;
    return preselcted[0] ? hold : undefined;
  };

  const _extractAll = (text) => {
    return Object.keys(keyWords).map(index => {
      return _extract(text, index);
    });
  };

  const _detect =  (input) => {
    const data = input.split(' ');
    return Object.keys(intents).map(intent => {
      const candidate = { intent };
      const texts = intents[intent]['texts'];
      candidate.score = texts.reduce((score, element ) => { 
        for(let i = 1; i <= scope; i++) {
          strTool.portionReading(data, i, (array) => {
            strTool.portionReading(element, i, (proc) => {
              if (strTool.exactMatch(array, proc, degree)) score += (100 / (array.length * texts.length));
            })  
          });
        }
        return score;
      }, 0);
      return candidate;
    });
  };

  const _generateSignatureVectors = () => {
    const intentsKeys = Object.keys(intents);
    return intentsKeys.map((key, index) => {
      const text = intents[key]['texts'].reduce((acc, current) => {
        return acc.concat(current);
      }, []).join(' ');
      const scores = _detect(text).map(candidate => {
        return { [candidate.intent]: candidate.score };
      });
      return { [key]: scores.reduce((result, item) => {
        return Object.assign(result, item);
      }, {}) };
    });
  }

  return {
    feed: _feed,
    extract: _extract,
    extractAll: _extractAll,
    detect: _detect,
    generateSignatureVectors: _generateSignatureVectors
  };
})();
module.exports = brain;