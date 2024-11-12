class WindowPopout {
    static init() {
        console.log('Window Popout | Initializing...');
        Hooks.on('renderApplication', this._onRenderApplication.bind(this));
        Hooks.on('renderActorSheet', this._onRenderApplication.bind(this));
        Hooks.on('renderItemSheet', this._onRenderApplication.bind(this));
        Hooks.on('renderJournalSheet', this._onRenderApplication.bind(this));
    }

    static _onRenderApplication(app, html, data) {
        console.log('Window Popout | Adding button to window:', app.options.id);
        
        if (html.find('.popout').length > 0) return;
        
        const header = html.find('.window-header');
        if (!header.length) return;

        const popoutBtn = $(`<a class="popout" title="Pop-out Window"><i class="fas fa-external-link-alt"></i></a>`);
        
        const closeBtn = header.find('.close');
        if (closeBtn.length) {
            closeBtn.before(popoutBtn);
        } else {
            header.append(popoutBtn);
        }
        
        popoutBtn.click((event) => this._onPopoutClick(event, app));
    }

    static _onPopoutClick(event, app) {
        event.preventDefault();
        console.log('Window Popout | Popping out window:', app.options.id);
        
        // Get all stylesheets from the main window
        const styleSheets = Array.from(document.styleSheets).map(sheet => {
            try {
                return sheet.href || '';
            } catch (e) {
                return '';
            }
        }).filter(href => href);

        // Get Foundry theme
        const theme = game.settings.get('core', 'uiTheme');
        
        const w = window.open('', '_blank', 'width=800,height=600');
        
        // Write necessary styles and content
        w.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${app.title}</title>
                ${styleSheets.map(href => `<link rel="stylesheet" href="${href}">`).join('\n')}
                <link rel="stylesheet" href="${window.location.origin}/css/style.css">
                <link rel="stylesheet" href="${window.location.origin}/css/fonts.css">
                <link rel="stylesheet" href="${window.location.origin}/css/${theme}.css">
                <link rel="stylesheet" href="${window.location.origin}/fonts/fontawesome/css/all.min.css">
                <style>
                    body { 
                        margin: 0;
                        padding: 10px;
                        height: 100vh;
                        overflow-y: auto;
                        background: url(${window.location.origin}/ui/parchment.jpg) repeat;
                    }
                    .window-content {
                        height: 100%;
                        padding: 8px;
                        background: none;
                        color: var(--color-text-dark-primary);
                    }
                    /* Additional foundry styles */
                    .window-app {
                        background: none;
                        border: none;
                        box-shadow: none;
                    }
                    input[type="text"], 
                    input[type="number"], 
                    input[type="password"], 
                    input[type="date"], 
                    input[type="time"] {
                        background: rgba(0, 0, 0, 0.05);
                        border: 1px solid var(--color-border-light-tertiary);
                    }
                    select {
                        background: rgba(0, 0, 0, 0.05);
                        border: 1px solid var(--color-border-light-tertiary);
                    }
                </style>
            </head>
            <body class="${theme}">
                <div id="popout-${app.id}" class="window-app ${app.options.classes.join(' ')}">
                    <div class="window-content">
                        ${app.element.find('.window-content').html()}
                    </div>
                </div>
                <script>
                    // Initialize foundry data
                    const appData = ${JSON.stringify(data)};
                    document.querySelector('.window-content').dataset.appId = '${app.id}';
                </script>
            </body>
            </html>
        `);
        
        // Close the original window
        app.close();
    }
}

// Initialize module
Hooks.once('init', () => {
    console.log('Window Popout | Starting initialization');
    WindowPopout.init();
});
