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

    AWS.config.region = process.env.REGION

    var sns = new AWS.SNS();

    var env = process.env.NODE_ENV || 'dev';

    var snsTopic =  process.env.NEW_SIGNUP_TOPIC;
    var app = express();

    var http = require('http').Server(app);
    var io = require('socket.io')(http);

    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
    app.use(bodyParser.urlencoded({extended:false}));

    app.use('/dist', express.static(path.join(__dirname, 'dist')))

    app.get('/', function(req, res) {
        res.render('index', {
            title: "AlpineDev"
        });
    });

    io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('chat-message', function(data){
            console.log(data.name + ': ' + data.msg);
            socket.broadcast.emit('chat-message', data);
        });
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });

        socket.on('login-user', function(data) {
            var authToken = {
                authorized: true,
                token: "AUTHORIZED TOKEN",
                msg: "Login Sucessful",
            };
            var loginError = {
                authorized: false,
                msg: "Invalid username or password",
            };
            var username = data.username;
            var pass_attempt = data.pass_attempt;

            if(username == 'moutansos' &&
               pass_attempt == '1234') //TODO: replace with a real authentication check
            {
                socket.emit('login-response', authToken);
            }
            else
            {
                socket.emit('login-response', loginError);
            }
        });
    });

    var port = process.env.PORT || 3000;

    var server = http.listen(port, function() {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
}