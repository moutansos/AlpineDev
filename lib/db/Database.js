/**
 * AlpineDev Server Database Classes
 * Ben Brougher - 2017
 */

class Database {
    constructor() {
        if(new.target === Abstract) { //Make sure the class is abstract only
            throw new TypeError("Cannot construct an instance of and Abstract class.");
        }

        if (typeof this.addUser === "function") {
            throw new TypeError("The addUser() method must be overriden.");
        }
    }
}

//Public API
module.exports = Database;