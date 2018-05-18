module.exports = (emitter) => {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Save',
          click () {
            emitter.emit('file-save');
          }
        },
        {
          label: 'Save as',
          click () {
            emitter.emit('file-save-as');
          }
        },
        {
          label: 'Open',
          click () {
            emitter.emit('file-open');
          }
        },
        {
          label: 'New',
          click () {
            emitter.emit('editor-new');
          }
        }
      ]
    },
    {
      label: 'Preview',
      click () {
        emitter.emit('preview');
      }
    },
    {
      label: 'Export',
      submenu: [
        {
          label: 'Export HTML',
          click () {
            emitter.emit('export-html');
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'pasteandmatchstyle'},
        {role: 'delete'},
        {role: 'selectall'}
      ]
    },
    {
      label: 'View',
      submenu: [
        {role: 'reload'},
        {role: 'forcereload'},
        {role: 'toggledevtools'},
        {type: 'separator'},
        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'},
        {type: 'separator'},
        {role: 'togglefullscreen'}
      ]
    },
    {
      role: 'window',
      submenu: [
        {role: 'minimize'},
        {role: 'close'}
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () { require('electron').shell.openExternal('https://fabric.cf') }
        }
      ]
    }
  ];

  return template;
};
