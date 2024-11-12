class WindowPopout {
    static init() {
        // Add popout button to window headers
        libWrapper.register('window-popout', 'Application.prototype._renderOuter', this._addPopoutButton, 'WRAPPER');
    }

    static _addPopoutButton(wrapped, ...args) {
        const html = wrapped(...args);
        
        // Add popout button to window header
        const header = html.find('.window-header');
        const popoutBtn = $(`<a class="popout" title="Pop-out Window"><i class="fas fa-external-link-alt"></i></a>`);
        
        // Insert before close button
        header.find('.close').before(popoutBtn);
        
        // Add click handler
        popoutBtn.click(this._onPopoutClick.bind(this));
        
        return html;
    }

    static _onPopoutClick(event) {
        event.preventDefault();
        const app = this;
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
    console.log('Window Popout | Initializing window-popout');
    WindowPopout.init();
});
