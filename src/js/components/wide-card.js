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
.card-wide-<%= uid %> > .mdl-card__title {
  background: url('<%= image %>') center / cover;
}
</style>
<div class="card-wide mdl-cell  mdl-card mdl-shadow--2dp card-wide-<%= uid %>">
  <div class="mdl-card__title" id="card-wide-<%= uid %>-image">
    <h2 class="mdl-card__title-text" id="card-wide-<%= uid %>-title"><%= title %></h2>
  </div>
  <div class="mdl-card__supporting-text" id="card-wide-<%= uid %>-supporting">
    <%= supporting %>
  </div>
  <div class="mdl-card__actions mdl-card--border">
    <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" id="card-wide-<%= uid %>-button-text">
      <%= buttonText %>
    </a>
  </div>
  <div class="mdl-card__menu">
    <% if(shareBtn) { %>
        <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
            <i class="material-icons">share</i>
        </button>
    <% } %>
  </div>
</div>`;

const globalStyle = ``

class WideCard {
  /**
   * Class for rendering a card component on the screen
   * @param {string} imageUrl 
   * @param {string} titleText 
   * @param {string} supportingText 
   * @param {string} buttonText 
   * @param {boolean} shareButton 
   */
  constructor(imageUrl, titleText, supportingText, buttonText, shareButton) {
    this.uid = uid.genUid();
    this.image = imageUrl;
    this.imageId = "card-wide-" + this.uid + "-image";
    this.title = titleText;
    this.titleId = "card-wide-" + this.uid + "-title";
    this.supporting = supportingText;
    this.supportingId = "card-wide-"+ this.uid + "-supporting";
    this.buttonText = buttonText;
    this.buttonTextId = "card-wide-" + this.uid + "-button-text";
    this.shareButton = shareButton;
    this.style = "";
    this.columns = columnSize;

    this.isGridCell = false;
  }

  render() {
     var dataIn = {
        image: this.image,
        title: this.title,
        supporting: this.supporting,
        buttonText: this.buttonText,
        shareBtn: this.shareButton,
        uid: this.uid,
    }

    return ejs.render(template, dataIn);
  }

  renderGlobalStyle() {
    return globalStyle;
  }

  /**
   * Sets the new title of the card
   * @param {string} newTitle The new title of the card
   */
  setTitleText(newTitle) {
    this.title = newTitle;
    var el = document.getElementById(this.titleId);
    el.innerHTML = this.title;
  }

  /**
   * Sets the new supporting text of the card
   * @param {string} newText the new text for the supporting text area
   */
  setSupportingText(newText) {
    this.supporting = newText;
    var el = document.getElementById(this.supportingId);
    el.innerHTML = this.supporting;
  }

  /**
   * Sets the new button text of the card
   * @param {string} newText The new text of the button
   */
  setButtonText(newText) {
    this.buttonText = newText;
    var el = document.getElementById(this.button);
    el.innerHTML = this.buttonText;
  }

  /**
   * Sets the new image of the card
   * @param {string} newImageURL The new image url
   */
  setImage(newImageURL) {
    this.image = newImageURL;
    var el = document.getElementById(this.imageId);
    el.style.backgroundImage = 'url(' + this.image + ')';
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

  setButtonListener(callback) {
    if(typeof callback == 'function') {
      var button = document.getElementById(this.buttonTextId);
      button.onclick = callback;
    }
  }
}

//Public API
module.exports = WideCard;