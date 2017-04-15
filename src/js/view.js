
const viewTemplate = `<!-- A View -->
<style type="text/css">
    <%- globalStyle %>
</style>

<%- renderedBase %>`

class View {
    constructor(id) {
        this.id = id;
        this.baseComponent;
        this.globalStyle = "";
    }

    render() {
        var dataIn = {
            globalStyle: this.renderGlobalStyle(),
            renderedBase: this.renderBase(),
        }

        return ejs.render(viewTemplate, dataIn);
    }

    renderBase() {
        return this.baseComponent.render();
    }

    renderGlobalStyle() {
        return this.baseComponent.renderGlobalStyle();
    }

    updateContent(renderedContentString) {
        var contentEl = document.getElementById(this.id);
        contentEl.innerHTML = renderedContentString;
    }

    setBaseComponent(newComponent) {
        this.baseComponent = newComponent;
        this.updateContent(this.render());
    }
}


//Public API
module.exports = View;