require('../css/material.min.css');
require('./material.min.js');
require('../../node_modules/ejs/ejs.min.js');
const socket = require("socket.io-client")();
const WideCard = require('./components/WideCard.js');
const SquareCard = require('./components/SquareCard.js');
const Grid = require('./components/Grid.js');
const Chat = require('./components/Chat.js');
const LoginPrompt = require('./components/LoginPrompt.js');
const View = require('./view.js');
const StorageArray = require('./storage-array.js');
const StorageItem = require('./storage-item.js');
//const Dialog = require('./components/dialog.js');
const Article = require('./components/Article.js');

console.log('Initializing AlpineDev Shell...');

var authToken = new StorageItem("auth-token");
var msgCache = new StorageArray('ad-msg-cache');
console.log(msgCache.getItems());

//Setup Components
var prompt = new LoginPrompt();

// Home Grid
var navHome = function() {
    var homeWelcomeCard = new WideCard('./dist/img/welcome.png', 'Welcome', 'Welcome to AlpineDev, my portfolio and hub to development', 'About AlpineDev', false);
    var homeDevProjCard = new SquareCard('./dist/img/code.jpg', 'My Code', 'All my open source code projects', 'Take A Look');
    var homeGrid = new Grid([[homeWelcomeCard, homeDevProjCard]]);

    mainView.setBaseComponent(homeGrid);
    homeDevProjCard.setButtonListener(navDevProjects);
    homeWelcomeCard.setButtonListener(navAbout);

}
// About Site
var navAbout = function() {
    var header = "About AlpineDev";
    var sitePath = ["AlpineDev", "About Site"];
    var text = `
    <p>
    AlpineDev is a site to showcase my projects and it provides an
    example of EJS frontend templating. All the components and pages
    in this site are rendered using EJS in the frontend. 
    </p>
    <p>
    This site is styled using templates and components from Material
    Design Lite which can be found here <a href="https://getmdl.io/">https://getmdl.io</a>.
    The interactive components are easy to use and lightweight.
    </p>`;
    var aboutArticle = new Article(header, sitePath, text);
    mainView.setBaseComponent(aboutArticle);
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
    mainView.setBaseComponent(prompt);

    prompt.setLoginButtonListener(function() {
        if(!prompt.isLogin) {
            prompt.setPromptToLogin();
        } else {
            prompt.showLoading();
            //TODO: Frontend validation
            function handlePasswordValidation(err, pass) {
                if(err) {
                    prompt.hideLoading();
                    prompt.setResponseText(err);
                } else {
                    var data = {
                        username: prompt.getUsernameFromInput(),
                        pass_attempt: pass,
                    }
                    socket.emit('login-user', data);
                }
            }

            prompt.getPasswordFromInput(handlePasswordValidation);
        }
    });

    prompt.setSignupButtonListener(function() {
        if(prompt.isLogin){
            prompt.setPromptToSignup();
        } else {
            prompt.showLoading();

            function handleUserVerify(err, pass) {
                if(err) {
                    prompt.hideLoading();
                    prompt.setResponseText(err);
                } else if(pass.length < 10) {
                    prompt.hideLoading();
                    prompt.setResponseText('Password must be longer than 10 characters');
                } else {
                    var data = {
                        username: prompt.getUsernameFromInput(),
                        name: prompt.getNameFromInput(),
                        email: prompt.getEmailFromInput(),
                        password: pass,
                    }
                    console.log(data);
                    socket.emit('signup-user', data);
                }
            }
            //TODO: Frontend validation

            prompt.getPasswordFromInput(handleUserVerify);
        }
    });

    socket.on('login-response', function(data) {
        prompt.hideLoading();
        if(!data.authorized) {
            prompt.setResponseText(data.msg);
        } else {
            authToken.setItem(data);
            handleLoggedIn();
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
            handleLoggedIn();
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
    if(authToken.getItem()) {
        var chat = new Chat();

        mainView.setBaseComponent(chat);

        chat.setSendButtonListener(function() {
            var auth = authToken.getItem();
            var msg = {
                name: auth.userId,
                msg: chat.getInputText(), 
                auth: auth,
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
    } else {
        navLogin();
    }
}

function handleLoggedIn() {
    var loginButton = document.getElementById('nav-login-1');
    loginButton.innerText = "Logout";
    loginButton.onclick = logout;
}

function authenticateToken() {
    if(authToken.getItem()) {
        function handleAuthorized() {
            handleLoggedIn();
        }

        function handleFailedAuthorized() {
            authToken.clear();
        }

        var token = authToken.getItem();
        token.sucessCallback = 'initial-authorized';
        token.failCallback = 'inital-fail-authorized';

        socket.on(token.sucessCallback, handleAuthorized);
        socket.on(token.failCallback, handleFailedAuthorized);
        socket.emit('authorize-token', token);
    }
}

//Setup the main view
var mainView = new View('main-view');

window.onload = function() {
    authenticateToken();
    console.log('Loaded.');

    //Initial Load
    navHome();

    //Assign listeners
    var navHomeEl = document.getElementById('nav-home-1');
    var navDevProjectsEl = document.getElementById('nav-dev-1');
    var navChatEl = document.getElementById('nav-chat-1');
    var navLoginEl = document.getElementById('nav-login-1');
    var navAboutEl = document.getElementById('nav-about-1');

    navHomeEl.onclick = navHome;
    navDevProjectsEl.onclick = navDevProjects;
    navChatEl.onclick = navChat;
    navLoginEl.onclick = navLogin;
    navAboutEl.onclick = navAbout;

    socket.on('logout-client', function() {
        logout();
    });

    socket.on('prompt-client-login', function() {
        //TODO: Show dialog to authenticate user
        console.log('Unauthorized attempt at access');
    });
}