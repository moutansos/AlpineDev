function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}

var genUid = function(){
    return new String(S4() + S4());
}

//Public API
module.exports.genUid = genUid;