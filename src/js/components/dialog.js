require('../../../node_modules/ejs/ejs.min.js');
require('../../../node_modules/dialog-polyfill/dialog-polyfill.js');
require('../../../node_modules/dialog-polyfill/dialog-polyfill.css');
const uid = require('../uid.js');

const idPrefix = 'dialog-';

const template = `<!-- Dialog -->
<style type="text/css">
</style>

<dialog id="<%= dialogId %>" class="mdl-dialog">
    <h4 class="mdl-dialog__title">Allow data collection?</h4>
    <div class="mdl-dialog__content">
        <p>
            Allowing us to collect data will let us get you the information you want faster.
        </p>
    </div>
    <div class="mdl-dialog__actions">
        <button type="button" class="mdl-button">Agree</button>
        <button type="button" class="mdl-button close">Disagree</button>
    </div>
</dialog>`;
const globalStyle = ``;

class Dialog {
    constructor() {
        this.uid = uid.genUid();
        this.dialogId = idPrefix + this.uid + "-main-dialog";
    }

    render() {
        var dataIn = {
            uid: this.uid,
            dialogId: this,
        }

        return ejs.render(template, dataIn);
    }

    configJs() {

    }
}

//Public API
module.exports = Dialog;