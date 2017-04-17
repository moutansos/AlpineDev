require('../css/material.min.css');
require('./material.min.js');
require('../../node_modules/ejs/ejs.min.js');
const socket = require("socket.io-client")();
const WideCard = require('./components/wide-card.js');
const SquareCard = require('./components/square-card.js');
const Grid = require('./components/grid.js');
const Chat = require('./components/chat.js');
const View = require('./view.js');

console.log('Initializing AlpineDev Shell...');

// Home Grid
var navHome = function() {
    var homeWelcomeCard = new WideCard('./dist/img/welcome.png', 'Welcome', 'Welcome to AlpineDev, my portfolio and hub to development', 'About AlpineDev', false);
    var homeDevProjCard = new SquareCard('./dist/img/code.jpg', 'My Code', 'All my open source code projects', 'Take A Look');
    var homeGrid = new Grid([[homeWelcomeCard, homeDevProjCard]]);

    mainView.setBaseComponent(homeGrid);

    homeDevProjCard.setButtonListener(navDevProjects);
    socket.emit('chat-message', 'User Navigated Home');
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
    socket.emit('chat-message', 'User Navigated To Dev');
}

var navChat = function() {
    var chat = new Chat();

    mainView.setBaseComponent(chat);
    
    socket.emit('chat-message', 'User Navigated to Chat');

    chat.setSendButtonListener(function(){
        socket.emit('chat-message', chat.getInputText());
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

    navHomeEl.onclick = navHome;
    navDevProjectsEl.onclick = navDevProjects;
    navChatEl.onclick = navChat;
}