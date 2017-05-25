const pass_man = require('./pass-man.js');

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
        if(userId && name && email && password) { //TODO: Make this a bit more sophisticated
            return true;
        }
        return false;
    }

    static userIsValid(userId, name, pass_hash, pass_salt, pass_iterations) {
        //TODO: Provide input validation on user object
        return true;
    }

    auth(pass_attempt)
    {
        pass_man.authUser(this, pass_attempt);
    }
}

//External API
module.exports = User;