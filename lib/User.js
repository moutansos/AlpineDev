const pass_man = require('./pass-main.js');

class User {
    /**
     * Creates a full user object with password hash, salt, and iterations.
     * @param {string} userId - The username of the user
     * @param {string} name - The name of the user
     * @param {string} pass_hash - The password hash
     * @param {string} pass_salt - The password salt
     * @param {string} pass_iterations - The number of iterations the crypto library ran
     */
    constructor(userId, name, pass_hash, pass_salt, pass_iterations) {
        this.userId = userId;
        this.name = name;
        this.pass_hash = pass_hash;
        this.pass_salt = pass_salt;
        this.pass_iterations = pass_iterations;
    }

    static userIsValid(userId, name, pass_hash, pass_salt, pass_iterations) {
        //TODO: Provide input validation on user object
    }

    auth(pass_attempt)
    {
        pass_man.authUser(this, pass_attempt);
    }
}

//External API
module.exports = User;