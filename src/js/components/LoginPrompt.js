require('../../../node_modules/ejs/ejs.min.js');
const uid = require('../uid.js');

const template = `<!-- Login Prompt -->
<style type="text/css">
  .login-layout {
    align-items: center;
    justify-content: center;
  }
  .mdl-layout__content {
    padding: 24px;
    flex: none;
  }
</style>
<div class="mdl-layout mdl-js-layout mdl-color--grey-100 <%= loginLayoutClass %>">
	<main class="mdl-layout__content <%= loginContentClass %>">
    <div class="login-prompt mdl-cell mdl-card mdl-shadow--2dp card-square-<%= uid %>">
      <div class="mdl-card__title mdl-color--primary mdl-color-text--white">
        <h2 class="mdl-card__title-text">AlpineDev Login</h2>
      </div>
      <div class="mdl-card__supporting-text">
        <form action="#">
          <div class="mdl-textfield mdl-js-textfield" id="<%= usernameInputContainer %>">
            <input class="mdl-textfield__input" type="text" id="<%= usernameInputId %>" />
            <label class="mdl-textfield__label" for="<%= usernameInputId %>">Username</label>
          </div>
          <div class="mdl-textfield mdl-js-textfield" id="<%= passInputContainer %>">
            <input class="mdl-textfield__input" type="password" id="<%= passInputId %>" />
            <label class="mdl-textfield__label" for="<%= passInputId %>">Password</label>
          </div>
        </form>
      </div>
      <div class="mdl-card__actions mdl-card--border">
        <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" id="<%= loginButtonId %>">
          Login
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
    this.loginButtonId = 'login-prompt-' + this.uid + '-login-button';
    this.passInputContainer = 'login-prompt-' + this.uid + '-pass-input-container';
    this.passInputId = 'login-prompt-' + this.uid + '-pass-input';
    this.usernameInputContainer = 'login-prompt-' + this.uid + '-username-input-container';
    this.usernameInputId = 'login-prompt-' + this.uid + '-username-input';
    
    //CSS Classes
    this.loginLayoutClass = 'login-prompt-' + this.uid + '-layout';
    this.loginContentClass = 'login-prompt-' + this.uid + '-content';
  }

  render() {
     var dataIn = {
        uid: this.uid,
        loginButtonId: this.loginButtonId,
        passInputContainer: this.passInputContainer,
        passInputId: this.passInputId,
        usernameInputContainer: this.usernameInputContainer,
        usernameInputId: this.usernameInputId,
        loginLayoutClass: this.loginContentClass,
        loginContentClass: this.loginContentClass,
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

  getUsernameFromInput()
  {
    var input = document.getElementById(this.usernameInputId);
    return input.value;
  }

  getPasswordFromInput()
  {
    var pass = document.getElementById(this.passInputId);
    return pass.value;
  }

  configJs() {
    var passInput = document.getElementById(this.passInputContainer);
    var userInput = document.getElementById(this.usernameInputContainer);
    var loginBtn = document.getElementById(this.loginButtonId);
    componentHandler.upgradeElement(passInput);
    componentHandler.upgradeElement(userInput);
    componentHandler.upgradeElement(loginBtn);

    passInput.addEventListener("keyup", function(event) {
      event.preventDefault();
      if(event.keyCode == 13) { //The Enter Key
        loginBtn.click();
      }
    });
  }
}

//Public API
module.exports = LoginPrompt;