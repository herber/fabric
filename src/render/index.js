const mitt = require('mitt');
const titlebar = require('./lib/titlebar');
const editor = require('./lib/editor');

const emitter = mitt();
const state = {};

titlebar(emitter, state);
editor(emitter, state);
