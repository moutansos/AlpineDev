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
  height: 70px;
  background-color: #2d2d2d;
  overflow: auto;
  padding-left: 10px;
  padding-right: 10px;
}

#<%= inputId %> {
  color: #c6c6c6;
  border-bottom-color: #cecece;
}

#<%= labelId %> {
  color: #cecece;
}

#<%= msgContainerId %> {
  width: 650px;
  padding-bottom: 70px;   /* Height of the footer */
}
</style>
<ul class="mdl-list" id ="<%= msgContainerId %>">

</ul>

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
    this.msgContainerId = "chat-" + this.uid + "-msg-container";
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
        msgContainerId: this.msgContainerId
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

  setInputText(newText)
  {
    var input = document.getElementById(this.inputId);
    var container = document.getElementById(this.containerId);
    container.classList.remove('is-dirty');
    input.value = newText;
  }

  setSendButtonListener(callback) {
    if(typeof callback == 'function') {
      var button = document.getElementById(this.sendButtonId);
      button.onclick = callback;
    }
  }

  /**
   * Generates a new message element
   * @param {*} msg 
   */
  addMessage(msg) {
    var name = msg.name;
    var message = msg.msg;

    var list = document.getElementById(this.msgContainerId);

    var newMsg = document.createElement("li");
    newMsg.classList.add('mdl-list__item', 'mdl-list__item--three-line');

    var icon = document.createElement('i');
    icon.classList.add('material-icons', 'mdl-list__item-avatar');
    icon.appendChild(document.createTextNode('person'));

    var nameSpan = document.createElement("span");
    nameSpan.appendChild(document.createTextNode(name));

    var textBodySpan = document.createElement('span');
    textBodySpan.classList.add('mdl-list__item-text-body');
    textBodySpan.appendChild(document.createTextNode(message));

    var contentSpan = document.createElement("span");
    contentSpan.classList.add('mdl-list__item-primary-content');
    contentSpan.appendChild(icon);
    contentSpan.appendChild(nameSpan);
    contentSpan.appendChild(textBodySpan);

    newMsg.appendChild(contentSpan);
    componentHandler.upgradeElement(newMsg);
    list.appendChild(newMsg);
    
    //TODO: Get scrolling to work in the right place
    window.scrollTo(0, document.body.scrollHeight);
  }
  /*
    <li class="mdl-list__item mdl-list__item--three-line">
      <span class="mdl-list__item-primary-content">
        <i class="material-icons mdl-list__item-avatar">person</i>
        <span>Bryan Cranston</span>
        <span class="mdl-list__item-text-body">
          Bryan Cranston played the role of Walter in Breaking Bad. He is also known
          for playing Hal in Malcom in the Middle.
        </span>
      </span>
    </li>
  */

  configJs() {
    var button = document.getElementById(this.sendButtonId);
    var input = document.getElementById(this.containerId);
    var list = document.getElementById(this.msgContainerId);
    componentHandler.upgradeElement(button);
    componentHandler.upgradeElement(input);
    componentHandler.upgradeElement(list);

    input.addEventListener("keyup", function(event) {
      event.preventDefault();
      if(event.keyCode == 13) { //The Enter Key
        button.click();
      }
    });
  }
}

//Public API
module.exports = Chat;