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

console.log('Initializing AlpineDev Shell...');

var msgCache = new StorageArray('ad-msg-cache');
console.log(msgCache.getItems());

// Home Grid
var navHome = function() {
    var homeWelcomeCard = new WideCard('./dist/img/welcome.png', 'Welcome', 'Welcome to AlpineDev, my portfolio and hub to development', 'About AlpineDev', false);
    var homeDevProjCard = new SquareCard('./dist/img/code.jpg', 'My Code', 'All my open source code projects', 'Take A Look');
    var homeGrid = new Grid([[homeWelcomeCard, homeDevProjCard]]);

    mainView.setBaseComponent(homeGrid);

    homeDevProjCard.setButtonListener(navDevProjects);
    socket.emit('chat-message', {name: 'Client', msg: 'User Navigated Home'});
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
        //TODO: Set Loading Spinnner/Bar
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
        //TODO: Set Loading Spinner/Bar
    })

    socket.on('login-response', function(data) {
        prompt.hideLoading();
        if(!data.authorized) {
            prompt.setResponseText(data.msg);
        } else {
            //TODO: Handle Auth Token
        }
    });

    socket.on('signup-response', function(data) {
        prompt.hideLoading();
        if(!data.authorized) {
            prompt.setResponseText(data.msg);
            console.log('Sucessful Signup');
        } else {
            //TODO: Handle Auth Token and show signup sucessful
        }
    })
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
    socket.emit('chat-message', {name: 'Client', msg: 'User Navigated To Dev'});
}

//Chat Compoenet
var navChat = function() {
    var chat = new Chat();

    mainView.setBaseComponent(chat);
    
    socket.emit('chat-message', {name: 'Client', msg: 'User Navigated to Chat'});

    /*chat.setSendButtonListener(function(){
        socket.emit('chat-message', {name: 'moutansos', msg: chat.getInputText()});
        chat.setInputText(null);
    });*/

    chat.setSendButtonListener(function(){
        var msg = {name: 'Test', msg: chat.getInputText()}
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
}