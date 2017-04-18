require('../../../node_modules/ejs/ejs.min.js');
const uid = require('../uid.js');

const columnSize = 6;

/**
 * HTML IDs within template:
 *  card-wide-<%= uid %>-title : Title on the card
 *  card-wide-<%= uid %>-supporting : Supporting text on the card
 *  card-wide-<%= uid %>-button-text : Text for button on card
 *  card-wide-<%= uid %>-image : The div containing the image on the card
 */
const template = `<!-- Wide card with share menu button -->
<style type="text/css">
footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #2d2d2d;
  overflow: auto;
  padding: 10px;
}

#<%= inputId %> {
  color: red;
}
</style>
<div class="mdl-cell">

</div>

<footer>
  <div class="mdl-grid">
    <div class="mdl-cell mdl-cell--10-col mdl-textfield mdl-js-textfield mdl-textfield--floating-label" id="<%= containerId %>">
      <input class="mdl-textfield__input" type="text" id="<%= inputId %>">
      <label class="mdl-textfield__label" id="<%= labelId %>" for="<%= inputId %>">Chat Message</label>
    </div>
    <button class="mdl-cell mdl-cell--2-col mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" id="<%= sendId %>">
      Send
    </button>
  </div>
</footer>`;

const globalStyle = ``

class Chat {
  /**
   * Class for rendering a card component on the screen
   */
  constructor() {
    this.uid = uid.genUid();
    this.sendButtonId = "chat-" + this.uid + "-send-button";
    this.inputId = "chat-" + this.uid + "-input";
    this.containerId = "chat-" + this.uid + "-input-container";
    this.labelId = "chat-" + this.uid + "-label-id";
    this.columns = columnSize;
    this.isGridCell = false;
  }

  render() {
     var dataIn = {
        uid: this.uid,
        sendId: this.sendButtonId,
        inputId: this.inputId,
        containerId: this.containerId,
        labelId: this.labelId,
    }

    return ejs.render(template, dataIn);
  }

  renderGlobalStyle() {
    return globalStyle;
  }

  getColumns() {
    return this.columns;
  }

  setGridCellState(isGridCell) {
    if(this.isGridCell)
    {
      this.isGridCell = true;
    }
    else
    {
      this.isGridCell = false;
    }
  }

  getInputText() {
      var input = document.getElementById(this.inputId);
      return input.value;
  }

  setSendButtonListener(callback) {
    if(typeof callback == 'function') {
      var button = document.getElementById(this.sendButtonId);
      button.onclick = callback;
    }
  }

  configJs() {
    var button = document.getElementById(this.sendButtonId);
    var input = document.getElementById(this.containerId);
    componentHandler.upgradeElement(button);
    componentHandler.upgradeElement(input);
  }
}

//Public API
module.exports = Chat;