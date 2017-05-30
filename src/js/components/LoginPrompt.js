require('../../../node_modules/ejs/ejs.min.js');
const uid = require('../uid.js');

const idPrefix = 'login-prompt-';

const template = `<!-- Login Prompt -->
<style type="text/css">
  .<%= loginLayoutClass %> {
    align-items: center;
    justify-content: center;
  }
  .<%= loginContentClass %> {
    padding: 24px;
    flex: none;
    align-items: center;
    justify-content: center;
  }
  #<%= responseId %> {
    color: red;
  }
</style>
<div class="mdl-layout mdl-js-layout <%= loginLayoutClass %>">
	<main class="mdl-layout__content <%= loginContentClass %>">
    <div class="login-prompt mdl-card mdl-shadow--2dp card-square-<%= uid %>">
      <div class="mdl-card__title mdl-color--primary mdl-color-text">
        <h2 class="mdl-card__title-text" style="color: rgb(66,66,66);">AlpineDev Login</h2>
      </div>
      <div class="mdl-card__supporting-text">
        <form action="#">
          <div id="<%= signupFieldContainer %>">
          </div>
          <div class="mdl-textfield mdl-js-textfield" id="<%= usernameInputContainer %>">
            <input class="mdl-textfield__input" type="text" id="<%= usernameInputId %>" />
            <label class="mdl-textfield__label" for="<%= usernameInputId %>">Username</label>
          </div>
          <div class="mdl-textfield mdl-js-textfield" id="<%= passInputContainer %>">
            <input class="mdl-textfield__input" type="password" id="<%= passInputId %>" />
            <label class="mdl-textfield__label" for="<%= passInputId %>">Password</label>
          </div>
        </form>
        <a id="<%= responseId %>"></a>
      </div>
      <div id="<%= progressContainer %>"></div>
      <div class="mdl-card__actions mdl-card--border">
        <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" id="<%= loginButtonId %>">
          Login
        </a>
        <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" id="<%= signupButtonId %>">
          Signup
        </a>
      </div>
    </div>
  </main>
</div>`;

const globalStyle = ``

class LoginPrompt {
  /**
   * Class for rendering a login prompt
   */
  constructor() {
    this.uid = uid.genUid();
    this.loginButtonId = idPrefix + this.uid + '-login-button';
    this.signupButtonId = idPrefix + this.uid + '-signup-button';
    this.passInputContainer = idPrefix + this.uid + '-pass-input-container';
    this.passInputId = idPrefix + this.uid + '-pass-input';
    this.usernameInputContainer = idPrefix + this.uid + '-username-input-container';
    this.usernameInputId = idPrefix + this.uid + '-username-input';
    this.nameInputContainer = idPrefix + this.uid + '-name-input-container';
    this.nameInputId = idPrefix + this.uid + '-name-input'
    this.emailInputContainer = idPrefix + this.uid + '-email-input-container';
    this.emailInputId = idPrefix + this.uid + '-email-input';
    this.responseId = idPrefix + this.uid + '-response';
    this.signupFieldContainer = idPrefix + this.uid + '-signup-field-container';

    //Progress
    this.progressId = idPrefix + this.uid + '-progress-bar';
    this.progressContainer = idPrefix + this.uid + '-progress-container';
    
    //CSS Classes
    this.loginLayoutClass = 'login-prompt-' + this.uid + '-layout';
    this.loginContentClass = 'login-prompt-' + this.uid + '-content';

    //State
    this.isLogin = true;
  }

  render() {
     var dataIn = {
        uid: this.uid,
        loginButtonId: this.loginButtonId,
        passInputContainer: this.passInputContainer,
        passInputId: this.passInputId,
        usernameInputContainer: this.usernameInputContainer,
        usernameInputId: this.usernameInputId,
        nameInputContainer: this.nameInputContainer,
        nameInputId: this.nameInputId,
        emailInputContainer: this.emailInputContainer,
        emailInputId: this.emailInputId,
        loginLayoutClass: this.loginContentClass,
        loginContentClass: this.loginContentClass,
        responseId: this.responseId,
        signupButtonId: this.signupButtonId,
        signupFieldContainer: this.signupFieldContainer,
        progressId: this.progressId,
        progressContainer: this.progressContainer,
    }

    return ejs.render(template, dataIn);
  }

  renderGlobalStyle() {
    return globalStyle;
  }

  setLoginButtonListener(callback) {
    if(typeof callback == 'function') {
      var button = document.getElementById(this.loginButtonId);
      button.onclick = callback;
    }
  }

  setSignupButtonListener(callback) {
    if(typeof callback == 'function') {
      var button = document.getElementById(this.signupButtonId);
      button.onclick = callback;
    }
  }

  getNameFromInput() {
    var input = document.getElementById(this.nameInputId);
    if(input) {
      return input.value;
    }
    return null;
  }

  getEmailFromInput() {
    var input = document.getElementById(this.emailInputId);
    if(input) {
      return input.value;
    }
    return null;
  }

  getUsernameFromInput() {
    var input = document.getElementById(this.usernameInputId);
    return input.value;
  }

  getPasswordFromInput() {
    var pass = document.getElementById(this.passInputId);
    return pass.value;
  }

  setResponseText(text) {
    var response = document.getElementById(this.responseId);
    response.innerText = text;
  }

  setPromptToSignup() {
    //Change Object State
    this.isLogin = false;

    this.setResponseText("");
    var signupContainer = document.getElementById(this.signupFieldContainer);

    //Create the name input field
    var nameInputDiv = this.__createMdlTextField(this.nameInputContainer, this.nameInputId, "Name");
    signupContainer.appendChild(nameInputDiv);
    componentHandler.upgradeElement(nameInputDiv);

    //Create the email input field
    var emailInputDiv = this.__createMdlTextField(this.emailInputContainer, this.emailInputId, "Email");
    signupContainer.appendChild(emailInputDiv);
    componentHandler.upgradeElement(emailInputDiv);
  }

  setPromptToLogin() {
    //Change Object State
    this.isLogin = true;
    this.setResponseText("");

    var signupContainer = document.getElementById(this.signupFieldContainer);
    signupContainer.innerHTML = "";
  }

  /**
   * <div id="<%= progressId %>" class="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
   */
  showLoading() {
    var container = document.getElementById(this.progressContainer);

    container.innerHTML = "";

    var progress = document.createElement('div');
    progress.classList.add('mdl-progress', 'mdl-js-progress', 'mdl-progress__indeterminate');
    progress.id = this.progressId;
    container.appendChild(progress);

    componentHandler.upgradeElement(progress);
  }

  hideLoading() {
    var container = document.getElementById(this.progressContainer);
    if(container) {
        container.innerHTML = "";
    }
  }

  /** Example
   * <div class="mdl-textfield mdl-js-textfield" id="<%= passInputContainer %>">
   *   <input class="mdl-textfield__input" type="password" id="<%= passInputId %>" />
   *   <label class="mdl-textfield__label" for="<%= passInputId %>">Password</label>
   * </div>
   */
  __createMdlTextField(containerId, inputId, labelText) {
    var inputDiv = document.createElement("div");
    inputDiv.classList.add("mdl-textfield", "mdl-js-textfield");
    inputDiv.id = containerId;
    var input = document.createElement("input");
    input.classList.add("mdl-textfield__input");
    input.id = inputId;
    inputDiv.appendChild(input);
    var label = document.createElement("label");
    label.classList.add("mdl-textfield__label");
    label.setAttribute("for", inputId);
    label.innerText = labelText;
    inputDiv.appendChild(label);
    
    return inputDiv;
  }

  configJs() {
    var passInput = document.getElementById(this.passInputContainer);
    var userInput = document.getElementById(this.usernameInputContainer);
    var loginBtn = document.getElementById(this.loginButtonId);
    var signupBtn = document.getElementById(this.signupButtonId);
    componentHandler.upgradeElement(passInput);
    componentHandler.upgradeElement(userInput);
    componentHandler.upgradeElement(loginBtn);
    componentHandler.upgradeElement(signupBtn);

    passInput.addEventListener("keyup", (function(event) {
      event.preventDefault();
      if(event.keyCode == 13) { //The Enter Key
        if(this.isLogin) {
          loginBtn.click();
        } else if(!this.isLogin) {
          signupBtn.click();
        }
      }
    }).bind(this));
  }
}

//Public API
module.exports = LoginPrompt;