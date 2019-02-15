//adding the levenstein methode to strings to evaluate edit distance between words
String.prototype.levenstein = function(string) {
    var a = this, b = string + "", m = [], i, j, min = Math.min;

    if (!(a && b)) return (b || a).length;

    for (i = 0; i <= b.length; m[i] = [i++]);
    for (j = 0; j <= a.length; m[0][j] = j++);

    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            m[i][j] = b.charAt(i - 1) == a.charAt(j - 1)
                ? m[i - 1][j - 1]
                : m[i][j] = min(
                    m[i - 1][j - 1] + 1, 
                    min(m[i][j - 1] + 1, m[i - 1 ][j] + 1))
        }
    }

    return m[b.length][a.length];
}

var same=function(a,b,deg){
    var ref=a.length<4||b.length<4?0:deg;
    return a.levenstein(b)<=ref?true:false;
}
var exactMatch=function(a,b,deg){
    if(a.length!=b.length){
        return false;
    }
    var lock=true;
    for(var i=0;i<a.length;i++){
        if(!same(a[i],b[i],deg)){
            lock=false;
            break;
        }
    }
    return lock;
    

}
var portionReading=function(tab,interv,callback){
    for(var i=0;i<tab.length-interv+1;i++){
        callback(tab.slice(i,i+interv),i,i+interv);
    }
}
var test=['comment fait t on pour faire ?','qu est ce qu on doit faire pour ?','quelle est la marche à suivre pour','qu est ce que je dois faire pour',
            'quelle est la procédure pour'];

var longestSet=function(struc,callback){
    var lock=0;
    struc.sort(function(a,b){
        if(a.length===b.length){
            return 0;
        }else{
            return a.length>b.length?-1:1;
        }
    });
     for(var i=0;i<struc.length-1;i++){
        var field=struc.slice(i+1,struc.length);
        for(var scope=struc[i+1].length;scope>0;scope--){
            portionReading(struc[i],scope,function(portion,from,to){
                
            for(var k=0;k<field.length;k++){
                   
                   portionReading(field[k],scope,function(actual){
                        if(exactMatch(portion,actual,2)){
                           
                            
                            callback(portion,from,to,i);
                            
                            

                        }
                    });
               
                }
            });
        }
    }
    
}

var ajustSetRedend=function(struc){
    
    
    longestSet(struc,function(res,from,to,originaIndex){
        
        struc[originaIndex].splice(from,to);
        
    });      
}


var arrayify=function(tab){ 
    res=[];
    for(var i=0;i<tab.length;i++){
        res.push(tab[i].split(' '));

    }
    return(res);
    }
var giveWght=function(intents){
    for(var intent in intents){
        if(intents[intent]['pondered']){
            intents[intent]['texts'].forEach(function(el){
                intents[intent]['pondered'].forEach(function(word){
                    el.push(word);
                })
            })
        }
    }
}
var preCompute=function(intents){
   var hold=intents;
   return function(){
    for(var struc in hold){
    hold[struc]['texts']=arrayify(hold[struc]['texts']);
    ajustSetRedend(hold[struc]['texts']);
        
    }
    giveWght(hold)
    return hold;
    }
}

exports.preCompute=preCompute;
exports.exactMatch=exactMatch;
exports.portionReading=portionReading;
