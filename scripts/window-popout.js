class WindowPopout {
    static init() {
        console.log('Window Popout | Initializing...');
        // Use Foundry's hook system instead of libWrapper
        Hooks.on('renderApplication', this._onRenderApplication.bind(this));
        Hooks.on('renderActorSheet', this._onRenderApplication.bind(this));
        Hooks.on('renderItemSheet', this._onRenderApplication.bind(this));
        Hooks.on('renderJournalSheet', this._onRenderApplication.bind(this));
    }

    static _onRenderApplication(app, html, data) {
        console.log('Window Popout | Adding button to window:', app.options.id);
        
        // Check if we already added the button
        if (html.find('.popout').length > 0) return;
        
        // Add popout button to window header
        const header = html.find('.window-header');
        if (!header.length) return;

        const popoutBtn = $(`<a class="popout" title="Pop-out Window"><i class="fas fa-external-link-alt"></i></a>`);
        
        // Insert before close button
        const closeBtn = header.find('.close');
        if (closeBtn.length) {
            closeBtn.before(popoutBtn);
        } else {
            header.append(popoutBtn);
        }
        
        // Add click handler
        popoutBtn.click((event) => this._onPopoutClick(event, app));
    }

    static _onPopoutClick(event, app) {
        event.preventDefault();
        console.log('Window Popout | Popping out window:', app.options.id);
        
        const w = window.open('', '_blank', 'width=800,height=600');
        
        // Write necessary styles and content
        w.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${app.title}</title>
                <link rel="stylesheet" href="${window.location.origin}/css/style.css">
                <link rel="stylesheet" href="${window.location.origin}/css/fonts.css">
                <style>
                    body { 
                        margin: 0;
                        padding: 10px;
                        background: #fff;
                        height: 100vh;
                        overflow-y: auto;
                    }
                    .window-content {
                        height: 100%;
                        padding: 8px;
                    }
                </style>
            </head>
            <body>
                <div class="window-content">
                    ${app.element.find('.window-content').html()}
                </div>
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
