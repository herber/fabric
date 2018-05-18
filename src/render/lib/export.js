const { dialog, shell, BrowserWindow } = require('electron').remote;
const fs = require('fs');
const path = require('path');
const render = require('./render');
const indent = require('../../utils/indent');

const codeStyles = fs.readFileSync(path.join(__dirname, '../../../static/highlight.css')).toString();

let styles = `
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
`.split('\n');

styles.splice(0, 1);
styles = styles.join('\n');

module.exports = (emitter, state) => {
  emitter.on('export-html', () => {
    const md = render(state.value);
    const html = `<!DOCTYPE html>
<html>
  <head>
    <title>Fabric</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
${ indent(styles, 6) }
${ indent(codeStyles, 6) }
    </style>
  </head>
  <body>
    <main>
${ indent(md, 6) }
    </main>
  </body>
</html>`;

    dialog.showSaveDialog({
      title: 'Export HTML',
      filters: [
        { name: 'HTML', extensions: [ 'html' ] },
        { name: 'HTM', extensions: [ 'htm' ] },
        { name: 'XHTML', extensions: [ 'xhtml' ] },
        { name: 'All files (*.*)', extensions: [ '*.*' ] }
      ]
    }, (filename) => {
      if (filename) {
        fs.writeFile(filename, html, (err) => {
          if (err) throw err;

          shell.openExternal('file://' + filename);
        });
      }
    });
  });

  emitter.on('export-pdf', () => {
    const md = render(state.value);
    const html = `<!DOCTYPE html>
    <html>
      <head>
        <title>Fabric</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          ${ styles }
          ${ codeStyles }
        </style>
      </head>
      <body>
        <main>
          ${ md }
        </main>
      </body>
    </html>`;

    dialog.showSaveDialog({
      title: 'Export PDF',
      filters: [
        { name: 'PDF', extensions: [ 'pdf' ] },
        { name: 'All files (*.*)', extensions: [ '*.*' ] }
      ]
    }, (filename) => {
      if (filename) {
        let win = new BrowserWindow({
          width: 1200,
          height: 900,
          show: false
        });

        win.on('closed', () => {
          win = null;
        });

        win.once('ready-to-show', () => {
          setTimeout(() => {
            win.webContents.printToPDF({ pageSize: 'A4', printBackground: true }, function(err, data) {
              fs.writeFile(filename, data, (err) => {
                if (err) throw err;

                shell.openExternal('file://' + filename);
                win.close();
              });
            });
          }, 20);
        });

        win.loadURL('data:text/html;charset=UTF-8,' + html);
        win.setMenu(null);
      }
    });
  });
};
