
class User {
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
}

//External API
module.exports = User;