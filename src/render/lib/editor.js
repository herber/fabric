const codemirror = require('codemirror');
require('codemirror/mode/markdown/markdown');
// require('codemirror/keymap/vim');
const html = require('xou');
const vxv = require('vxv');
const fs = require('fs');
const {dialog} = require('electron').remote;

const opts = {
  tabSize: 2,
  lineNumbers: true,
  styleActiveLine: false,
  matchBrackets: true,
  theme: window.localStorage.theme || 'light',
  autofocus: true,
  mode: 'markdown',
  gutters: ['CodeMirror-lint-markers'],
};

vxv`
:global(.CodeMirror) {
  position: fixed;
  left: 0px;
  top: 35px;
  right: 0px;
  bottom: 0px;
}
`;

module.exports = (emitter, state) => {
  const editEl = html`<textarea></textarea>`;
  document.body.appendChild(editEl);
  const editor = codemirror.fromTextArea(editEl, opts);

  setTimeout(() => {
    editor.refresh();
  }, 128)

  emitter.on('editor-new', () => {
    emitter.emit('file-save');
    emitter.emit('editor-clear');
  });

  emitter.on('file-save', () => {
    if (state.filePath) {
      fs.writeFile(state.filePath, editor.getValue(), (err) => {
        if (err) throw err;
      });
    } else {
      dialog.showSaveDialog({
        title: 'Save to file',
        filters: [
          { name: 'Markdown', extensions: [ 'md' ] },
          { name: 'Text', extensions: [ 'txt' ] },
          { name: 'All files (*.*)', extensions: [ '*.*' ] }
        ]
      }, (filename) => {
        if (filename) {
          state.filePath = filename;

          fs.writeFile(filename, editor.getValue(), (err) => {
            if (err) throw err;
          });
        }
      });
    }
  });

  emitter.on('file-save-as', () => {
    dialog.showSaveDialog({
      title: 'Save to file',
      filters: [
        { name: 'Markdown', extensions: [ 'md' ] },
        { name: 'Text', extensions: [ 'txt' ] },
        { name: 'All files (*.*)', extensions: [ '*.*' ] }
      ]
    }, (filename) => {
      if (filename) {
        state.filePath = filename;

        fs.writeFile(filename, editor.getValue(), (err) => {
          if (err) throw err;
        });
      }
    });
  });

  emitter.on('file-open', () => {
    dialog.showOpenDialog({
      title: 'Open file',
      filters: [
        { name: 'Markdown', extensions: [ 'md' ] },
        { name: 'Text', extensions: [ 'txt' ] },
        { name: 'All files (*.*)', extensions: [ '*.*' ] }
      ],
      properties: ['openFile']
    }, (filename) => {
      console.log(filename);

      if (filename) {
        state.filePath = filename[0];

        fs.readFile(filename[0], (err, data) => {
          if (err) throw err;

          editor.setValue(data.toString());
        });
      }
    });

    emitter.on('editor-clear', () => {
      editor.setValue('');
    });


  });
};
