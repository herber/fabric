const mitt = require('mitt');
const titlebar = require('./lib/titlebar');
const editor = require('./lib/editor');
const keyboard = require('./lib/keyboard');
const preview = require('./lib/preview');
const settings = require('./lib/settings');
const exp = require('./lib/export');
const config = require('./lib/config');

const emitter = mitt();
const state = {
  value: '',
  saved: false,
  settings: false
};

emitter.on('config-done', () => {
  titlebar(emitter, state);
  keyboard(emitter, state);
  preview(emitter, state);
  editor(emitter, state);
  exp(emitter, state);
  settings(emitter, state);
});

config(emitter, state);

window.onerror = (msg) => {
  alert(msg);
};

window.onbeforeunload = (e) => {
  emitter.emit('config-save');
};
