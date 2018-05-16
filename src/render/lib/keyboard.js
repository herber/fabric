const vkey = require('vkey');

module.exports = (emitter) => {
  // mousetrap.bindGlobal(['command+s', 'ctrl+s'], () => {
  //   console.log('a');
  //
  //   emitter.emit('file-save');
  //   return false;
  // });
  //
  // mousetrap.bindGlobal(['command+o', 'ctrl+o'], () => {
  //   emitter.emit('file-open');
  //   return false;
  // });
  //
  // mousetrap.bindGlobal(['command+shift+s', 'ctrl+shift+s'], () => {
  //   emitter.emit('file-save-as');
  //   return false;
  // });

  document.addEventListener('keypress', (e) => {
    console.log(vkey[e.keyCode]);

    console.log('meta', e.metaKey);
    console.log('shift', e.shiftKey);
    console.log('alt', e.altKey);
    console.log('ctrl', e.ctrlKey);
  }, false);
};
