var strTool = require('./lib/strings');
var brain = (function(){
  var keyWords,intents,scope,degree;
  var _feed = function(x,y,z,foo){
    keyWords = x;
    intents = strTool.preCompute(y)();
    scope = z;
    degree = foo;
  }
  var _depth = function(what){
    var res = 0;
    for(var key in keyWords[what]){
      keyWords[what][key].forEach(function(el){
        res = el.length>res?el.length:res;
      });
    }
    return res; 
  }
  var _extract = function(txt,what){
    
    var preselcted = [];
    var data = txt.split(' ');
    for(var key in keyWords[what]){
      keyWords[what][key].forEach(function(element){
        for(var i = 1;i <= _depth(what);i++){
          strTool.portionReading(data,i,function(array){
            if(strTool.exactMatch(element,array,degree)){
              preselcted.push(key);
            }
          });    
        }
      });
    }
    var hold = {};
    hold[what] = preselcted;
    return preselcted[0]?hold:undefined;
  }
  var _extractAll = function(text){
    var res = [];
    for(var index in keyWords){
      res.push(_extract(text,index));
    }
    return res;
  }
  var _detect = function (input){
    var data = input.split(' ');
    var res = [];
    for(var intent in intents){
      
      var candidate = {intent:intent},score = 0;
      var texts = intents[intent]['texts'];

      texts.forEach(function(element,index){
        
        for(var i = 1; i <= scope; i++) {

        strTool.portionReading(data,i,function(array){
        strTool.portionReading(element,i,function(proc){
          if(strTool.exactMatch(array,proc,degree)){
              
              score = score+(100/(array.length*texts.length));
            
          } 
        })  
          
        });
      }
      });
    candidate.score = score;
    res.push(candidate) ;
    }
    
    return res;
  }
  //expose
  return {
    feed:_feed,
    extract:_extract,
    extractAll:_extractAll,
    detect:_detect
  }
})();
module.exports = brain;