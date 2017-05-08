/**
 * AlpineDev Server Database Classes
 * Ben Brougher - 2017
 */

class Database {
    constructor() {
        if(new.target === Abstract) { //Make sure the class is abstract only
            throw new TypeError("Cannot construct an instance of and Abstract class.");
        }
    }

    addUser(newUser) {
        throw new TypeError("The child class has not overridden addUser().");
    }

    isUserInDb(username, callback) {
        throw new TypeError("The child class has not overridden isUserInDb().");
    }

    getUserByUsername(username, callback) {
        throw new TypeError("The child class has not overriden getUserByUsername().");
    }
}

//Public API
module.exports = Database;