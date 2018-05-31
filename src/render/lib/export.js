const { dialog, shell, BrowserWindow, app } = require('electron').remote;
const fs = require('fs');
const path = require('path');
const render = require('./render');
const indent = require('../../utils/indent');

const confDir = path.join(app.getPath('home'), '/.fabric');

module.exports = (emitter, state) => {
  const codeStyles = fs.readFileSync(path.join(confDir, 'styles', (localStorage.getItem('settings-template') || 'article'), 'highlight.css')).toString();
  const styles = fs.readFileSync(path.join(confDir, 'styles', (localStorage.getItem('settings-template') || 'article'), 'preview.css')).toString();

  emitter.on('export-html', () => {
    const md = render(state.value);
    const html = `<!DOCTYPE html>
<html>
  <head>
    <title>${ localStorage.getItem('settings-title') || 'Fabric' }</title>
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
            win.webContents.printToPDF({ pageSize: (localStorage.getItem('settings-pageSize') || 'A4'), printBackground: true }, function(err, data) {
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
