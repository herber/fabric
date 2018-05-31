const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const xou = require('xou');
const { app } = require('electron').remote;

module.exports = (emitter, state) => {
  const confDir = path.join(app.getPath('home'), '/.fabric');

  if (!fs.existsSync(confDir)) {
    mkdirp.sync(path.join(confDir, 'styles', 'article'));

    fs.createReadStream(path.join(__dirname, '../../../static/light.css')).pipe(fs.createWriteStream(path.join(confDir, 'styles', 'article', 'editor.css')));
    fs.createReadStream(path.join(__dirname, '../../../static/highlight.css')).pipe(fs.createWriteStream(path.join(confDir, 'styles', 'article', 'highlight.css')));
    fs.createReadStream(path.join(__dirname, '../../../static/preview.css')).pipe(fs.createWriteStream(path.join(confDir, 'styles', 'article', 'preview.css')));
  }

  const styleEL = xou`
    <div>
      <link rel="stylesheet" href="file://${ path.join(confDir, 'styles', (localStorage.getItem('settings-template') || 'article'), 'editor.css') }">
    </div>
  `;

  document.head.appendChild(styleEL);

  const isDirectory = source => fs.lstatSync(source).isDirectory();
  const getDirectories = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory).map(p => path.basename(p));

  state.templateList = getDirectories(path.join(app.getPath('home'), '/.fabric/styles'));

  emitter.emit('config-done');
  emitter.emit('config-template-opts');
};
