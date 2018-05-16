const { BrowserWindow, nativeImage } = require('electron').remote;
const path = require('path');
const render = require('./render');

module.exports = (emitter, state) => {
  emitter.on('preview', () => {
    const md = render(state.value);
    const html = `<html>
      <head>
        <title>Preview</title>
      </head>
      <body>
        <main>${ md }</main>
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
    });

    win.once('ready-to-show', () => {
      win.show();
    });

    win.loadURL('data:text/html;charset=UTF-8,' + html);
    win.setMenu(null);
  })
};
