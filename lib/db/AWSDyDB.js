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
    constructor(node_env) {

        this._env = node_env;

        if(this._env === 'dev') {
            AWS.config.update({
                "region": "us-west-2",
                "accessKeyId": "abcde",
                "secretAccessKey": "abcde",
            });

            var config = ({
                "accessKeyId": "abcde",
                "secretAccessKey": "abcde",
                "region": "us-west-2",
                "endpoint": "http://localhost:8000",
            });
            this.ddb = new AWS.DynamoDB(config);
            console.log("Loading Dev DB");
        } else {
            this.ddb = new AWS.DynamoDB();
        }

    }

    addUser(newUser, callback) {
        var thisObj = this;

        if(!(newUser instanceof User)) {
            throw new TypeError("Invalid input in newUser() method. That is not a user object.");
        }

        function handleTableExist(exists) {
            if(!exists) {
                thisObj.createTable(writeToDatabase());
            }
            writeToDatabase();
        }

        function handleDatabaseResponse(err, data) {
            if(err) {
                console.log("Unable to add user " + newUser.name + ". Error JSON: " + JSON.stringify(err, null, 2));
                callback(true, "Unable to add user to database.");
            }
            callback(false, "Added user to the database");
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

            docClient.put(params, handleDatabaseResponse);
        }

        this.tableExists(userTableParams.TableName, handleTableExist)
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

        this.tableExists(userTableParams.TableName, handleTableExist);
    }

    createTable(params, callback) {
        this.ddb.createTable(params, function(err, data) {
            if (err) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
                return;
            }
            callback();
        });
    }

    getTablesList(callback) {
        var params = { };

        function handleTablesResponse(err, data) {
            //TODO: Maybe handle this a little differently?
            if (err) console.log(err); // an error occurred
            else callback(data); // successful response
        }
        console.log(this._env);
        this.ddb.listTables(params, handleTablesResponse);
    }

    tableExists(tableName, callback) {
        if(typeof tableName !== 'string')
        {
            throw new TypeError('Invalid table parameter. Not a string.');
        }
        const getTablesList = this._getTablesList;

        this.getTablesList(function(data) {
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