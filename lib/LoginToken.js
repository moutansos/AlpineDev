const uid = require('../src/js/uid.js');

class LoginToken {
    constructor(userId, expires, token) {
        this.userId = userId;
        this.expires = expires;
        
        if(token) {
            this.token = token;
        } else {
            this.token = uid.genUid() + uid.genUid() + uid.genUid();
        }
    }
}

module.exports = LoginToken;