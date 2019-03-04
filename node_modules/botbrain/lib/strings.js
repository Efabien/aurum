//adding the levenstein methode to strings to evaluate edit distance between words
String.prototype.levenstein = function(string) {
    const a = this;
    const b = string + "";
    const m = [];
    const min = Math.min;
    let i;
    let j;

    if (!(a && b)) return (b || a).length;

    for (i = 0; i <= b.length; m[i] = [i++]);
    for (j = 0; j <= a.length; m[0][j] = j++);

    for (i = 1; i <= b.length; i++) {
      for (j = 1; j <= a.length; j++) {
        m[i][j] = b.charAt(i - 1) === a.charAt(j - 1) ?
          m[i - 1][j - 1] :
          m[i][j] = min(
            m[i - 1][j - 1] + 1, 
            min(m[i][j - 1] + 1,
            m[i - 1 ][j] + 1)
          )
      }
    }
  return m[b.length][a.length];
};

const same = (a, b, deg) => {
  const ref = a.length < 4 || b.length < 4 ? 0: deg;
  return a.levenstein(b) <= ref;
};

const exactMatch= (a, b, deg) => {
  if (a.length !== b.length) return;
  return a.every((item, index) => same(item, b[index], deg));
};

const portionReading = (tab, interv, callback) => {
  for(let i = 0; i< tab.length - interv + 1; i++) {
    callback(tab.slice(i, i + interv), i, i + interv);
  }
};

var test=['comment fait t on pour faire ?','qu est ce qu on doit faire pour ?','quelle est la marche à suivre pour','qu est ce que je dois faire pour',
            'quelle est la procédure pour'];

const longestSet = (struc, callback) => {
  struc.sort((a, b) => {
    if (a.length === b.length) return 0;
    return a.length > b.length ? -1 : 1;
  });
  for(let i = 0; i < struc.length -1; i++) {
    const field = struc.slice(i + 1, struc.length);
    for(let scope = struc[i+1].length; scope > 0; scope--) {
      portionReading(struc[i], scope, (portion, from, to) => {
        for(let k = 0; k < field.length; k++) {
          portionReading(field[k],scope, (actual) => {
            if(exactMatch(portion, actual, 2)) callback(portion,from,to,i);
          });
        }
      });
    }
  }
};

const ajustSetRedend = (struc) => {
  longestSet(struc, (res, from, to, originaIndex) => {
    struc[originaIndex].splice(from,to);
  });      
};

const arrayify = (tab) => {
  return tab.map(item => item.split(' '));
};

const giveWght = (intents) => {
  for(let intent in intents){
    if(intents[intent]['pondered'] && intents[intent]['pondered'].length) {
      intents[intent]['texts'] = intents[intent]['texts'].map(item => {
        return item.concat(intents[intent]['pondered']);
      });
    }
  }
};

const preCompute = (intents) => {
  for (let struc in intents) {
    intents[struc]['texts'] = arrayify(intents[struc]['texts']);
    ajustSetRedend(intents[struc]['texts']);
  }
  giveWght(intents);
  return intents;
};

exports.preCompute = preCompute;
exports.exactMatch = exactMatch;
exports.portionReading = portionReading;
