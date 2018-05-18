const { dialog, shell } = require('electron').remote;
const fs = require('fs');
const path = require('path');
const render = require('./render');
const indent = require('../../utils/indent');

const codeStyles = fs.readFileSync(path.join(__dirname, '../../../static/highlight.css'));

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
${ indent(codeStyles.toString(), 6) }
    </style>
  </head>
  <body>
    <main>
${ indent(md, 6) }
    </main>
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
