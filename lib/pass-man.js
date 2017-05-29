const crypto = require('crypto');
const User = require('./User.js');
//From: http://stackoverflow.com/questions/17201450/salt-and-hash-password-in-nodejs-w-crypto

function hashPass (pass, callback) {
    var salt = crypto.randomBytes(128).toString('base64');
    var iterations = 10000;

    function handlePassHash(err, hash) {
        if(err) {
            callback(err);
            return;
        }
        callback(null, hash.toString('base64'), salt, iterations);
    }

    crypto.pbkdf2(pass, salt, iterations, 32, handlePassHash);
}

/**
 * The authenticate user callback function
 *
 * @callback authenticateUserCallback
 * @param {Object} error - The error message returned by one of the operations
 * @param {boolean} isAuthorized - The field that the user is authorized
 */

/**
 * Checks if a user from frontend's password is valid.
 * @param {User} userFromFrontend - The user object from the frontend.
 * @param {User} userFromDb - The user object from the database.
 * @param {authenticateUserCallback} - The callback function when the user is authenticated.
 */
function authenticateUser(userFromFrontend, userFromDb, callback) {
    function handleAuthHash(err, hash) {
        if(err) {
            callback(err, null);
        } else {
            userFromFrontend.pass_hash = hash.toString('base64');
            if(userFromFrontend.pass_hash === userFromDb.pass_hash) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        }
    }
    var salt = "" + userFromDb.pass_salt;
    var iterations = 0 + userFromDb.pass_iterations;
    crypto.pbkdf2(userFromFrontend.password, salt, iterations, 32, handleAuthHash);
}

//Public API
module.exports = { 
    hashPass: hashPass,
    authUser: authenticateUser,
};