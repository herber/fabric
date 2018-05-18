const { BrowserWindow, nativeImage, ipcMain } = require('electron').remote;
const path = require('path');
const fs = require('fs');
const render = require('./render');

const codeStyles = fs.readFileSync(path.join(__dirname, '../../../static/highlight.css'));

const styles = `
html, body {
  padding: 0;
  margin: 0;
  background: white;
}

body {
  font-family: -apple-system, 'Helvetica Neue', Helvetica, sans-serif;
}

main {
  max-width: calc(90vw - 30px);
  margin: 30px auto;
}
`;

module.exports = (emitter, state) => {
  emitter.on('preview', () => {
    if (state.preview) {
      state.preview.focus();
    } else {
      const md = render(state.value);
      const html = `<html>
        <head>
          <title>Preview</title>
          <style>
            ${ styles }
          </style>
          <style>
            ${ codeStyles }
          </style>
        </head>
        <body>
          <main>${ md }</main>
          <script>
            const ipc = require('electron').ipcRenderer;

            ipc.on('rerender', (event, md) => {
              document.querySelector('main').innerHTML = md;
            });
          </script>
        </body>
      </html>`;

      let image = nativeImage.createFromPath(path.join(__dirname, '../../../icon.png'));
      let win = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        icon: image
      });

      win.on('closed', () => {
        win = null;
        state.preview = null;
      });

      win.once('ready-to-show', () => {
        win.show();
      });

      win.loadURL('data:text/html;charset=UTF-8,' + html);
      win.setMenu(null);

      emitter.on('change', () => {
        if (win) {
          win.webContents.send('rerender', render(state.value));
        }
      });

      window.addEventListener('beforeunload', () => {
        if (win) {
          win.close();
        }
      })

      state.preview = win;
    }
  });
};
