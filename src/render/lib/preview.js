const { BrowserWindow, nativeImage, ipcMain, app } = require('electron').remote;
const path = require('path');
const fs = require('fs');
const xou = require('xou');
const vxv = require('vxv');
const render = require('./render');

const confDir = path.join(app.getPath('home'), '/.fabric');

module.exports = (emitter, state) => {
  const codeStyles = fs.readFileSync(path.join(confDir, 'styles', (localStorage.getItem('settings-template') || 'article'), 'highlight.css')).toString();
  const styles = fs.readFileSync(path.join(confDir, 'styles', (localStorage.getItem('settings-template') || 'article'), 'preview.css')).toString();

  const splitPreviewStyles = vxv`
    position: fixed;
    top: 0px;
    right: 0px;
    left: 50vw;
    bottom: 0px;
    display: none;
    padding: 35px 10px 10px 10px;
    overflow: auto;
    border-left: solid 1px #E0E0E0;

    & a {
      pointer-events:none;
    }

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background: rgba(0, 0, 0, 0.3);
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
    }

    &::-webkit-scrollbar-thumb:window-inactive {
      background: rgba(0, 0, 0, 0.0);
    }

    ${ styles }
    ${ codeStyles }
  `;

  const splitPreviewElement = xou`<div class="${ splitPreviewStyles }"><main class="split"></main></div>`;

  document.body.appendChild(splitPreviewElement);

  emitter.on('preview', () => {
    if (state.preview) {
      state.preview.focus();
    } else {
      const md = render(state.value);
      const html = `<html>
        <head>
          <title>Preview</title>
          <style>
            a {
              pointer-events:none;
            }
          </style>
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

            document.addEventListener('keypress', (e) => {
              console.log(e);

              if (e.keyCode == 113) {
                window.close();
              }
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
      });

      state.preview = win;
    }
  });

  emitter.on('preview-split', () => {
    if (!state.split) {
      document.querySelector('.split').innerHTML = render(state.value);
      document.querySelector('.CodeMirror').style.right = '50vw';
      splitPreviewElement.style.display = 'block';
    } else {
      document.querySelector('.CodeMirror').style.right = '0px';
      splitPreviewElement.style.display = 'none';
      document.querySelector('.split').innerHTML = '';
    }

    emitter.on('change', () => {
      if (state.split) {
        document.querySelector('.split').innerHTML = render(state.value);
      }
    });

    state.split = !state.split;
  })
};
