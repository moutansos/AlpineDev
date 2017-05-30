// AlpineDev Server Application
//  Based on the AWS NodeJS Example project.
//  Portions of this code are based on the apache 2.0 license.

var cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for terminating workers
    cluster.on('exit', function (worker) {
        // Replace the terminated workers
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();

    });

// Code to run if we're in a worker process
} else {
    const AWS = require('aws-sdk');
    const express = require('express');
    const bodyParser = require('body-parser');
    const path = require('path');
    
    //Type Imports
    const User = require('./lib/User.js');
    const AWSDyDB = require('./lib/db/AWSDyDB.js');

    AWS.config.region = process.env.REGION

    var sns = new AWS.SNS();

    var env = process.env.NODE_ENV || 'dev';

    var snsTopic = process.env.NEW_SIGNUP_TOPIC;
    var app = express();

    var db = new AWSDyDB(env);

    var http = require('http').Server(app);
    var io = require('socket.io')(http);

    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
    app.use(bodyParser.urlencoded({extended:false}));

    app.use('/dist', express.static(path.join(__dirname, 'dist')))

    app.get('/', function(req, res) {
        res.render('index', { //Render views/index.ejs
            title: "AlpineDev"
        });
    });

    io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });

        //Even Handlers
        function handleUserLogin(data) {
            var userFromFrontend = new User(data.username, null, null, data.pass_attempt);

            function handleRespondSucess() {
                var authToken = {
                    authorized: true,
                    token: "AUTHORIZED TOKEN",
                    msg: "Login Sucessful",
                };

                socket.emit('login-response', authToken);
            }

            function handleRespondError() {
                var loginError = {
                    authorized: false,
                    msg: "Invalid username or password",
                };

                socket.emit('login-response', loginError);
            }

            function handleAuthenticateUser(err, isAuthorized) {
                if(err || !isAuthorized) {
                    console.log('Error: ' + JSON.stringify(err));
                    console.log('IsAuthorized: ' + JSON.stringify(isAuthorized));
                    handleRespondError();
                } else {
                    handleRespondSucess();
                }
            }

            function handleGetUserFromDb(err, user) {
                if(err || user == null) {
                    handleRespondError();
                } else {
                    user.authenticateUser(userFromFrontend, handleAuthenticateUser);
                }
            }
            
            db.getUserByUsername(userFromFrontend.userId, handleGetUserFromDb)
        }

        function handleUserSignup(data) {
            var newUser = null;

            function respondSuccess() {
                var sucessfulResp = {
                    authorized: true,
                    token: "AUTHORIZED TOKEN",
                    msg: "Signup Successful",
                }
                socket.emit('signup-response', sucessfulResp);
                console.log("Added User To DB");
            }

            function respondError(message) {
                var errResp = {
                    authorized: false,
                    msg: message,
                }
                socket.emit('signup-response', errResp)
            }

            function handleDbAdd(err, message)
            {
                if(err)
                {
                    respondError(message);
                }
                respondSuccess();
            }

            if(User.userFromFrontendIsValid(data.username, data.name, data.email, data.password)) {
                //TODO: Email verification?
                var newUser = new User(data.username, data.name, data.email, data.password, null, null, null);

                function handleHashPass(err, user) {
                    if(err) {
                        respondError("Unable to create a password hash.");
                    } else {
                        db.addUser(user, handleDbAdd);
                    }
                }

                newUser.hashPassword(handleHashPass);
            } else {
                respondError("The input user is invalid.");
            }
        }

        function handleChatMessage(data) {
            console.log(data);
            var auth = data.auth;
            //TODO: Change to more secure login token
            if(!auth || auth.authorized == false || auth.token !== 'AUTHORIZED TOKEN') {
                //TODO: dereference the login token for this user because an unauthorized
                //      token has been attempted. This will require login 
                socket.emit('logout-client');
            } else {
                socket.broadcast.emit('chat-message', {
                    name: data.name, 
                    msg: data.msg 
                });
            }
        }

        function handleAuthorizeToken(data) {
            //TODO: Implement this for real
            if(data.authorized && data.token && data.token === 'AUTHORIZED TOKEN') {
                socket.emit(data.sucessCallback);
            } else {
                socket.emit(data.failCallback);
            }
        }

        //Event Listeners
        socket.on('login-user', handleUserLogin);
        socket.on('signup-user', handleUserSignup);
        socket.on('chat-message', handleChatMessage);
        socket.on('authorize-token', handleAuthorizeToken);
    });

    var port = process.env.PORT || 3000;

    var server = http.listen(port, function() {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
}