/**
 * AWSDyDB - Amazon Web Services DynamoDB Class
 * Provides an interfact into the DynamoDB Database
 */
const AWS = require('aws-sdk');
const User = require('../User.js');

const userTableParams = {
    TableName : "Users",
    KeySchema: [       
        { AttributeName: "userId", KeyType: "HASH"},  //Primary Key
    ],
    AttributeDefinitions: [       
        { AttributeName: "userId", AttributeType: "S" },
        { AttributeName: "name", AttributeType: "S" },
        { AttributeName: "pass_hash", AttributeType: "S" },
        { AttributeName: "pass_salt", AttributeType: "S" },
        { AttributeName: "pass_iterations", AttributeType: "N" },
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

class AWSDyDB {
    constructor(node_env, tableName) {

        this._env = node_env;
        this._ddb = new AWS.DynamoDB();

        if(this._env === 'dev') {
            AWS.config.update({
            region: "us-west-2",
            endpoint: "http://localhost:8000"
            });
        }

    }

    addUser(newUser) {
        if(!(newUser instanceof User)) {
            throw new TypeError("Invalid input in newUser() method. That is not a user object.");
        }

        function handleTableExist(exists) {
            if(!exists) {
                this._createTable(writeToDatabase());
            }
            writeToDatabase();
        }
        
        function writeToDatabase() {
            var params = {
                TableName: "Users",
                Item: {
                    "userId": newUser.userId,
                    "name": newUser.name,
                    "pass_hash": newUser.pass_hash,
                    "pass_salt": newUser.pass_salt,
                    "pass_iterations": newUser.pass_iterations
                }
            };

            var docClient = new AWS.DynamoDB.DocumentClient();

            docClient.put(params, function(err, data) {
                if(err) {
                    console.log("Unable to add user " + newUser.name + ". Error JSON: " + JSON.stringify(err, null, 2));
                }
            });
        }

        this._tableExists(userTableParams.TableName, handleTableExist)
    }

    getUserByUsername(username, callback) {

        function handleTableExist(exists) {
            if(!exists)
            {
                callback(null);
            }

            var params = {
                TableName: userTableParams.TableName,
                Key: {
                    "userId": username,
                }
            }; //TODO: Make dynamic with a global schema system

            var docClient = new AWS.DynamoDB.DocumentClient();
            
            docClient.get(params, function(err, data) {
                if(err) {
                    //TODO: Turn this into an exception???
                    console.error("Unable to get the user from the database. Error JSON: " + JSON.stringify(err, null, 2));
                } else {
                    var user = new User(data.userId, data.name, data.pass_hash, data.pass_salt, data.pass_iterations);
                    callback(user);
                }
            });
        }

        this._tableExists(userTableParams.TableName, handleTableExist);
    }

    _createTable(params, callback) {
        this._ddb.createTable(params, function(err, data) {
            if (err) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
                return;
            }
            callback();
        });
    }

    _getTablesList(callback) {
        var params = { };
        this._ddb.listTables(params, function(err, data) {
            if (err) console.log(err); // an error occurred
            else callback(data); // successful response
        });
    }

    _tableExists(tableName, callback) {
        if(typeof tableName !== 'string')
        {
            throw new TypeError('Invalid table parameter. Not a string.');
        }
        const getTablesList = this._getTablesList;

        getTablesList(function(data) {
            for(var i = 0; i < data.length; i++) {
                if(data[i] === tableName)
                {
                    callback(true);
                    return;
                }
            }
            callback(false);
        });

    }
}

//Public API
module.exports = AWSDyDB;