/**
 * AWSDyDB - Amazon Web Services DynamoDB Class
 * Provides an interfact into the DynamoDB Database
 */
const Database = require('./Database.js');
const AWS = require('aws-sdk');

const moviesTableParams = {
    TableName : "Movies",
    KeySchema: [       
        { AttributeName: "year", KeyType: "HASH"},  //Partition key
        { AttributeName: "title", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "year", AttributeType: "N" },
        { AttributeName: "title", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

class AWSDyDB extends Database {
    constructor(env) {
        this[_env] = env;
        this[_ddb] = new AWS.DynamoDB();
        this[_ddbTable] =  process.env.STARTUP_SIGNUP_TABLE;

        if(env === 'dev') {
            AWS.config.update({
            region: "us-west-2",
            endpoint: "http://localhost:8000"
            });
        }

        //Private methods
        this[_createTable] = new function(params) {
            this[_ddb].createTable(params, function(err, data) {
                if (err) {
                    console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
                }
            });
        }

        this[_getTablesList] = new function(callback) {
            var params = { };
            dynamodb.listTables(params, function(err, data) {
                if (err) console.log(err); // an error occurred
                else callback(data); // successful response
            });
        }

        this[_tableExists] = new function(tableName) {
            if(typeof tableName !== 'string')
            {
                throw new TypeError('Invalid table parameter. Not a string.');
            }
            var returnBool = false;
            const getTablesList = this[_getTablesList];

            getTablesList(function(data) {
                for(var i = 0; i < data.length; i++) {
                    if(data[i] === tableName)
                    {
                        returnBool = true;
                        return;
                    }
                }
            });

            return returnBool;
        }
    }

    addUser(newUser) {
        var tableExists = this[_tableExists];
        var createTable = this[_createTable];

        if(!tableExists) {
            //TODO: Create if doesn't exist
        }
        //TODO: Add the user
    }
}