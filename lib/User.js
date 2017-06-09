const pass_man = require('./pass-man.js');
const crypto = require('crypto');

class User {
    /**
     * Creates a full user object with password hash, salt, and iterations.
     * @param {string} userId - The username of the user
     * @param {string} name - The name of the user
     * @param {string} email - The email of the user
     * @param {string} password - The password of the user
     * @param {string} pass_hash - The password hash
     * @param {string} pass_salt - The password salt
     * @param {string} pass_iterations - The number of iterations the crypto library ran
     */
    constructor(userId, name, email, password, pass_hash, pass_salt, pass_iterations) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.password = password
        this.pass_hash = pass_hash;
        this.pass_salt = pass_salt;
        this.pass_iterations = pass_iterations;
    }
    
    static userFromFrontendIsValid(userId, name, email, password) {
        console.log({userId, name, email, password})
        if(userId && name && email && password && password.length >=10 ) {
            return true;
        }
        return false;
    }

    static userIsValid(userId, name, pass_hash, pass_salt, pass_iterations) {
        //TODO: Provide input validation on user object
        return true;
    }

    hashPassword(callback) {
        var thisObj = this;
        function handlePassHash(err, hash, salt, iterations) {
            if(err) {
                callback(err);
                return;
            }
            thisObj.password = null;
            thisObj.pass_hash = hash;
            thisObj.pass_salt = salt;
            thisObj.pass_iterations = iterations;

            callback(err, thisObj);
        }

        pass_man.hashPass(this.password, handlePassHash);
    }

    /**
     * The authenticate user callback function
     *
     * @callback authenticateUserCallback
     * @param {Object} error - The error message returned by one of the operations
     * @param {boolean} isAuthorized - The field that the user is authorized
     */
    
    /**
     * The authenticate user method
     * @param {User} userFromFrontend - The user object from the frontend
     * @param {authenticateUserCallback} - The callback function
     */
    authenticateUser(userFromFrontend, callback) {
        pass_man.authUser(userFromFrontend, this, callback);
    }
}

//External API
module.exports = User;