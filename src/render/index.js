const mitt = require('mitt');
const titlebar = require('./lib/titlebar');
const editor = require('./lib/editor');
const keyboard = require('./lib/keyboard');
const preview = require('./lib/preview');

const emitter = mitt();
const state = {
  value: ''
};

titlebar(emitter, state);
keyboard(emitter, state);
preview(emitter, state);
editor(emitter, state);
