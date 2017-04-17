require('../../../node_modules/ejs/ejs.min.js');
const uid = require('../uid.js');

/**
 * HTML IDs within template:
 */
const template = `<!-- Wide card with share menu button -->
<% for(var row = 0; row < comps.length; row++) { %>
    <div class="mdl-grid">
        <% for(var col = 0; col < comps[row].length; col++) { %>
            <% var component = comps[row][col]; %>
            <%- component.render() %>
        <% } %>
    </div>
<% } %>
`;

const globalStyle = ``

class Grid {
  /**
   * Class for rendering a card component on the screen
   * @param {Component[][]} imageUrl 
   */
  constructor(gridArray) {
    this.uid = uid.genUid();
    this.gridAra = gridArray;
  }

  render() {
     var dataIn = {
        comps: this.gridAra,
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

  configJs()
  {
    var ara = this.gridAra;
    for(var i = 0; i < ara.length; i++) {
      for(var x = 0; x < ara[i].length; x++) {
        var component = ara[i][x];
        if(component != null)
        {
          component.configJs();
        }
      }
    }
  }
}

//Public API
module.exports = Grid;