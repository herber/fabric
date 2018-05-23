module.exports = (emitter) => {
  document.addEventListener('keypress', (e) => {
    // console.log(e.keyCode);
    // console.log(e.ctrlKey);

    if ((e.ctrlKey || e.metaKey) && e.keyCode == 9) {
      emitter.emit('settings');
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode == 16) {
      emitter.emit('preview-split');
      return;
    }

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

    if ((e.ctrlKey || e.metaKey) && e.keyCode == 5) {
      emitter.emit('export-html');
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.keyCode == 2) {
      emitter.emit('export-pdf');
      return;
    }
  }, false);
};
