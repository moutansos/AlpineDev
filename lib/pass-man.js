const crypto = require('crypto');
//From: http://stackoverflow.com/questions/17201450/salt-and-hash-password-in-nodejs-w-crypto

var hashPass = function(pass) {
    var salt = crypto.randomBytes(128).toString('base64');
    var iterations = 10000;
    var hash = pbkdf2(pass, salt, iterations);

    return {
        salt: salt,
        hash: hash,
        iterations: iterations
    };
}

var isCorrect = function(savedHash, savedSalt, savedIterations, passwordAttempt) {
    return savedHash == pbkdf2(passwordAttempt, savedSalt, savedIterations);
}


//Public API
module.exports = { 
    hashPass: hashPass,
};