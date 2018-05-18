const { dialog, shell } = require('electron').remote;
const fs = require('fs');
const path = require('path');
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
  emitter.on('export-html', () => {
    const md = render(state.value);
    const html = `<html>
      <head>
        <title>Fabric</title>
        <style>
        ${ styles }
        </style>
        
        <style>
        ${ codeStyles }
        </style>
      </head>
      <body>
        <main>${ md }</main>
      </body>
    </html>`;

    dialog.showSaveDialog({
      title: 'Save to file',
      filters: [
        { name: 'HTML', extensions: [ 'html' ] },
        { name: 'HTM', extensions: [ 'htm' ] },
        { name: 'XHTML', extensions: [ 'xhtml' ] },
        { name: 'All files (*.*)', extensions: [ '*.*' ] }
      ]
    }, (filename) => {
      if (filename) {
        state.filePath = filename;

        fs.writeFile(filename, html, (err) => {
          if (err) throw err;

          shell.openExternal('file://' + filename);
        });
      }
    });
  });
};
