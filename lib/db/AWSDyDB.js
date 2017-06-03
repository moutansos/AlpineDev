/**
 * AWSDyDB - Amazon Web Services DynamoDB Class
 * Provides an interfact into the DynamoDB Database
 */
const AWS = require('aws-sdk');
const User = require('../User.js');
const LoginToken = require('../LoginToken.js');

const userTableParams = {
    TableName : "Users",
    KeySchema: [
        { AttributeName: "userId", KeyType: "HASH" },  //Primary Key
    ],
    AttributeDefinitions: [       
        { AttributeName: "userId", AttributeType: "S" },
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10,
    }
};

const loginTokenTableParams = {
    TableName : "LoginTokens",
    KeySchema: [
        { AttributeName: "userId", KeyType: "HASH"}, //Primary Key
    ],
    AttributeDefinitions : [
        { AttributeName: "userId", KeyType: "S" },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
    }
}

class AWSDyDB {
    constructor(node_env) {

        this._env = node_env;
        console.log("NodeJS Environment: " + this._env);
        if(this._env === 'dev') {
            var dynamoDBConfiguration = {
                "accessKeyId": "foo",
                "secretAccessKey": "bar",
                "region": "us-west-1"
            };
            AWS.config.update(dynamoDBConfiguration);
            AWS.config.update({ endpoint: new AWS.Endpoint('http://localhost:8000') });

            this.ddb = new AWS.DynamoDB();
            console.log("Loading Dev DB");
        } else {
            this.ddb = new AWS.DynamoDB();
        }

        //Initialize Tables If They Don't Exist
        var thisObj = this;
        function handleCreateUserTable() {
            console.log("Sucessfully created the Users Table")
        }

        function handleCreateLoginTokenTable() {
            console.log("Sucessfully create the LoginTokens Table");
        }

        function handleUserTableExists(exists, tableName) {
            if(!exists) {
                thisObj.createTable(userTableParams, handleCreateUserTable);
            }
        }

        function handleLoginTokenTableExists(exists, tableName) {
            if(!exists) {
                thisObj.createTable(loginTokenTableParams, handleCreateUserTable);
            }
        }

        this.tableExists(userTableParams.TableName, handleUserTableExists);
        this.tableExists(loginTokenTableParams.TableName, handleLoginTokenTableExists);
    }

    addUser(newUser, callback) {
        var thisObj = this;

        if(!(newUser instanceof User)) {
            throw new TypeError("Invalid input in addUser() method. That is not a user object.");
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
                    "email": newUser.email,
                    "pass_hash": newUser.pass_hash,
                    "pass_salt": newUser.pass_salt,
                    "pass_iterations": newUser.pass_iterations
                }
            };
            var docClient = new AWS.DynamoDB.DocumentClient();
            docClient.put(params, handleDatabaseResponse);
        }

        writeToDatabase();
    }

    addToken(newToken, callback) {
        var thisObj = this;
        if(!(newToken instanceof LoginToken)) {
            throw new TypeError("Invalid input in addToken() method. That is not a login token object.");
        }

        function handleDatabaseResponse(err, data) {
            if(err) {
                console.log("Unable to add token for " + newToken.userId + ". Error JSON: " + JSON.stringify(err, null, 2));
                callback(false, "Unable to add token to database");
            }

            callback(true, "Added token to database");
        }

        function writeToDatabase() {
            var params = {
                TableName: loginTokenTableParams.TableName,
                Item: {
                    'userId': newToken.userId,
                    'expires': newToken.expires,
                    'token': newToken.token,
                },
            };
            var docClient = new AWS.DynamoDB.DocumentClient();
            docClient.put(params, handleDatabaseResponse);
        }

        writeToDatabase();
    }

    getUserByUsername(username, callback) {
        function isEmptyObject(obj) {
            return !Object.keys(obj).length;
        }

        function handleAWSGet(err, data) {
            if(err) {
                //TODO: Turn this into an exception???
                var err = "Unable to get the user from the database. Error JSON: " + JSON.stringify(err, null, 2);
                callback(err, null);
            } else if(isEmptyObject(data) || isEmptyObject(data.Item)) {
                var err = "No user found in database!";
                callback(err, null);
            } else {
                var user = new User(data.Item.userId, 
                                    data.Item.name, 
                                    data.Item.email, 
                                    null, 
                                    data.Item.pass_hash, 
                                    data.Item.pass_salt, 
                                    data.Item.pass_iterations);
                callback(null, user);
            }
        }

        function handleTableExist(exists) {
            if(!exists)
            {
                var error = "The user table does not exist!";
                callback(error, null);
            }

            var params = {
                TableName: "Users",
                Key:{
                    "userId": username,
                }
            }; //TODO: Make dynamic with a global schema system

            var docClient = new AWS.DynamoDB.DocumentClient();
            
            docClient.get(params, handleAWSGet);
        }

        this.tableExists(userTableParams.TableName, handleTableExist);
    }

    createTable(params, callback) {
        this.ddb.createTable(params, function(err, data) {
            if (err) {
                if(err.message && err.message !== 'Cannot create preexisting table')
                {
                    console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("Some other worker must have already created the " + params.TableName + " table.");
                }
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
        this.ddb.listTables(params, handleTablesResponse);
    }

    tableExists(tableName, callback) {
        if(typeof tableName !== 'string')
        {
            throw new TypeError('Invalid table parameter. Not a string.');
        }
        const getTablesList = this._getTablesList;

        this.getTablesList(function(data) {
            var names = data.TableNames;
            for(var i = 0; i < names.length; i++) {
                if(names[i] === tableName)
                {
                    //console.log("Table exists: " + names[i]);
                    callback(true, tableName);
                    return;
                }
            }
            //console.log("Table does not exist: " + tableName);
            callback(false, tableName);
        });

    }
}

//Public API
module.exports = AWSDyDB;