const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const { app } = require('electron').remote;

module.exports = () => {
  const confDir = path.join(app.getPath('home'), '/.fabric');

  if (!fs.existsSync(confDir)) {
    mkdirp.sync(confDir);
    mkdirp.sync(path.join(confDir, 'styles'));
  }
};
