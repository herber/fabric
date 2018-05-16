const electron = require('electron');
const path = require('path');
const platform = require('./utils/platform.js');

const app = electron.app;

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

const onClosed = () => {
  // dereference the window
  // for multiple windows store them in an array
  mainWindow = null;
}

const createMainWindow = () => {
  const display = electron.screen.getPrimaryDisplay();

  let width = Math.floor(display.workAreaSize.width * 0.6);
  let height = Math.floor(display.workAreaSize.height * 0.7);

  if (width > 1440) width = 1440;
  if (height > 900) height = 900;

  let image = electron.nativeImage.createFromPath(path.join(__dirname, '../icon.png'));

  const win = new electron.BrowserWindow({
    width,
    height,
    minWidth: 800,
    minHeight: 500,
    center: true,
    vibrancy: 'light',
    background: '#ffffff',
    titleBarStyle: 'hiddenInset',
    frame: platform() != 'macos' ? false : true,
    show: false,
    webPreferences: {
      nodeIntegration: true
    },
    title: 'Fabric',
    icon: image
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  if (process.platform !== 'darwin') {
    win.setMenu(null);
  }

  win.loadURL(`file://${__dirname}/render/index.html`);
  win.on('closed', onClosed);

  return win;
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow();
  }
});

app.on('ready', () => {
  mainWindow = createMainWindow();
});
