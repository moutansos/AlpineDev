require('../../../node_modules/ejs/ejs.min.js');
const uid = require('../uid.js');

const idPrefix = 'article-';
const template = `<!-- Article -->
<style type="text/css">
    #<%= articleRibbon %> {
        width: 100%;
        height: 40vh;
        background-color: #388E3C;
        flex-shrink: 0;
    }

    #<%= articleMain %> {
        margin-top: -35vh;
        flex-shrink: 0;
    }

    #<%= articleContainer %> {
        max-width: 1600px;
        width: calc(100% - 16px);
        margin: 0 auto;
    }

    #<%= articleContent %> {
        border-radius: 2px;
        padding: 80px 56px;
        margin-bottom: 80px;
    }

    .demo-layout.is-small-screen #<%= articleContent %> {
        padding: 40px 28px;
    }

    #<%= articleContent %> h3 {
        margin-top: 48px;
    }
</style>

<div id="<%= articleRibbon %>"></div>
<main class="mdl-layout__content" id="<%= articleMain %>">
<div class="mdl-grid" id="<%= articleContainer %>">
    <div class="mdl-cell mdl-cell--2-col mdl-cell--hide-tablet mdl-cell--hide-phone"></div>
    <div class="mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--8-col" id="<%= articleContent %>">
    <% if(sitePathStr) { %>
        <div class="demo-crumbs mdl-color-text--grey-500">
            <%= sitePathStr %>
        </div>
    <% } %>
    <h3><%= headerStr %></h3>
        <%- innerHtml %>
    </div>
</div>`;

const globalStyle = ``;

class Article {
    /**
     * Class for rendering an article
     */
    constructor(headerText, sitePath, innerHtml) {
        this.uid = uid.genUid();
        this.articleRibbon = idPrefix + this.uid + '-ribbon';
        this.articleMain = idPrefix + this.uid + '-main';
        this.articleContainer = idPrefix + this.uid + '-container';
        this.articleContent = idPrefix + this.uid + '-content';

        this.headerText = headerText;
        this.sitePath = sitePath;
        this.innerHtml = innerHtml;
    }

    evalSitePath() {
        if(this.sitePath) {
            var pathStr = '';
            for(var i = 0; i < this.sitePath.length; i++) {
                if(i == 0) {
                    pathStr = this.sitePath[i];
                } else {
                    pathStr = pathStr + ' > ' + this.sitePath[i];
                }
            }
            return pathStr;
        } else {
            return null;
        }
    }

    render() {
        var dataIn = {
            uid: this.uid,
            articleRibbon: this.articleRibbon,
            articleMain: this.articleMain,
            articleContent: this.articleContent,
            articleContainer: this.articleContainer,
            sitePathStr: this.evalSitePath(),
            innerHtml: this.innerHtml,
            headerStr: this.headerText,
        }

        return ejs.render(template, dataIn);
    }

    renderGlobalStyle() {
        return globalStyle;
    }

    configJs() {

    }
}

//Public API
module.exports = Article;