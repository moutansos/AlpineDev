require('../css/material.min.css');
require('./material.min.js');
require('../../node_modules/ejs/ejs.min.js');
const socket = require("socket.io-client")();
const WideCard = require('./components/wide-card.js');
const SquareCard = require('./components/square-card.js');
const Grid = require('./components/grid.js');
const Chat = require('./components/chat.js');
const LoginPrompt = require('./components/LoginPrompt.js');
const View = require('./view.js');
const StorageArray = require('./storage-array.js');
const StorageItem = require('./storage-item.js');
const Dialog = require('./components/dialog.js');

console.log('Initializing AlpineDev Shell...');

var authToken = new StorageItem("auth-token");
var msgCache = new StorageArray('ad-msg-cache');
console.log(msgCache.getItems());

// Home Grid
var navHome = function() {
    var homeWelcomeCard = new WideCard('./dist/img/welcome.png', 'Welcome', 'Welcome to AlpineDev, my portfolio and hub to development', 'About AlpineDev', false);
    var homeDevProjCard = new SquareCard('./dist/img/code.jpg', 'My Code', 'All my open source code projects', 'Take A Look');
    var homeGrid = new Grid([[homeWelcomeCard, homeDevProjCard]]);

    mainView.setBaseComponent(homeGrid);

    homeDevProjCard.setButtonListener(navDevProjects);
}

//Logout Client
var logout = function() {
    var loginButton = document.getElementById('nav-login-1');
    authToken.setItem(null);
    loginButton.innerText = "Login";
    loginButton.onclick = navLogin;
    navHome();
}

//Login Layout
var navLogin = function() {
    var prompt = new LoginPrompt();
    mainView.setBaseComponent(prompt);

    prompt.setLoginButtonListener(function() {
        if(!prompt.isLogin) {
            prompt.setPromptToLogin();
        } else {
            prompt.showLoading();
            //TODO: Frontend validation
            socket.emit('login-user', {
                username: prompt.getUsernameFromInput(),
                pass_attempt: prompt.getPasswordFromInput(),
            });
        }
    });

    prompt.setSignupButtonListener(function() {
        if(prompt.isLogin){
            prompt.setPromptToSignup();
        } else {
            prompt.showLoading();
            //TODO: Frontend validation
            var data = {
                username: prompt.getUsernameFromInput(),
                name: prompt.getNameFromInput(),
                email: prompt.getEmailFromInput(),
                password: prompt.getPasswordFromInput(),
            }
            console.log(data);
            socket.emit('signup-user', data);
        }
    });

    socket.on('login-response', function(data) {
        prompt.hideLoading();
        if(!data.authorized) {
            prompt.setResponseText(data.msg);
        } else {
            prompt.setResponseText("");
            authToken.setItem(data);
            var loginButton = document.getElementById('nav-login-1');
            loginButton.innerText = "Logout";
            loginButton.onclick = logout;
            navHome();
        }
    });

    socket.on('signup-response', function(data) {
        prompt.hideLoading();
        if(!data.authorized) {
            prompt.setResponseText(data.msg);
        } else {
            prompt.setResponseText("");
            authToken.setItem(data);
            var loginButton = document.getElementById('nav-login-1');
            loginButton.innerText = "Logout";
            loginButton.onclick = logout;
            navHome();
        }
    });
}

//Development Projects Grid
var navDevProjects = function() {
    var devAbstractDataSupportingText = `Abstract Data is a project that provides flexible data management 
    across different types of databases through both scripting and interpruter interfaces.`
    var devAbstractDataCard = new SquareCard('./dist/img/code.jpg', "AbstractData", devAbstractDataSupportingText, "View on Github");
    var devMinecraftServerCard = new SquareCard('./dist/img/code.jpg', "Minecraft Server for Docker", "A lightweigt docker container that runs Minecraft Server", "View On Dockerhub");
    var devAlpineJSCard = new SquareCard('./dist/img/alpine-js-back.jpg', 'Alpine.js', 'A templating engine and component framework for front-end javascript development', 'View on Github');
    var devMinemanCard = new SquareCard('./dist/img/code.jpg', "Mineman", "A multi-launcher and backup manager for minecraft.", "View on Github");
    var devGrid = new Grid([[devAbstractDataCard, devMinecraftServerCard, devAlpineJSCard, devMinemanCard]]);

    mainView.setBaseComponent(devGrid);

    devAbstractDataCard.setButtonListener(function() {
        window.open('http://github.com/moutansos/AbstractData');
    });
    devMinecraftServerCard.setButtonListener(function() {
        window.open('https://hub.docker.com/r/moutansos/minecraft-server');
    });
    devAlpineJSCard.setButtonListener(function() {
        window.open('http://github.com/moutansos/Alpine.js');
    });
    devMinemanCard.setButtonListener(function() {
        window.open('https://github.com/moutansos/mineman');
    });
}

//Chat Compoenet
var navChat = function() {
    socket.emit('authorize-token', authToken.getItem());

    //TODO: implement a timer for if there is no response
    socket.on('authorized', function(){
        var chat = new Chat();

        mainView.setBaseComponent(chat);

        chat.setSendButtonListener(function() {
            var msg = {
                name: 'Test', 
                msg: chat.getInputText(), 
                auth: authToken.getItem(),
            }
            socket.emit('chat-message', msg);
            chat.addMessage(msg);
            console.log(msg);
            chat.setInputText(null);
        });

        var messages = msgCache.getItems();
        for(var i = 0; i < messages.length; i++){
            chat.addMessage(messages[i]);
        }

        socket.on('chat-message', function(msg) {
            chat.addMessage(msg);
        });
    });
}

//Setup the main view
var mainView = new View('main-view');

window.onload = function() {
    console.log('Loaded.');

    //Initial Load
    navHome();

    //Assign listeners
    var navHomeEl = document.getElementById('nav-home-1');
    var navDevProjectsEl = document.getElementById('nav-dev-1');
    var navChatEl = document.getElementById('nav-chat-1');
    var navLoginEl = document.getElementById('nav-login-1');

    navHomeEl.onclick = navHome;
    navDevProjectsEl.onclick = navDevProjects;
    navChatEl.onclick = navChat;
    navLoginEl.onclick = navLogin;

    socket.on('logout-client', function() {
        logout();
    });

    socket.on('prompt-client-login', function() {
        //TODO: Show dialog to authenticate user
        console.log('Unauthorized attempt at access');
    });
}