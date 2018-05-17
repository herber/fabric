module.exports = (emitter) => {
  document.addEventListener('keypress', (e) => {
    // console.log(e.keyCode);
    // console.log(e.ctrlKey);

    if ((e.ctrlKey || e.metaKey) && e.keyCode == 14) {
      emitter.emit('editor-new');
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.keyCode == 15) {
      emitter.emit('file-open');
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.keyCode == 19 && e.shiftKey) {
      emitter.emit('file-save-as');
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.keyCode == 19) {
      emitter.emit('file-save');
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.keyCode == 16) {
      emitter.emit('preview');
      return;
    }
  }, false);
};
