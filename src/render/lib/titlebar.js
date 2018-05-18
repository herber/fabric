const {remote} = require('electron');
const html = require('xou');
const vxv = require('vxv');
const menuTemplate = require('./menu');

const {Menu, MenuItem} = remote;

const styles = vxv`
.tilebar {
  height: 29px!important;
  z-index: 10;
}

.menu {
  line-height: 29px;
  padding: 0px 15px;
  position: fixed;
  top: 0px;
  left: 0px;
  -webkit-app-region: no-drag;
  user-select: none;
  font-size: 14px;
}

.menu:hover {
  background-color: rgba(196, 196, 196, 0.4);
}

.white {
  position: fixed;
  height: 35px;
  top: 0px;
  right: 0px;
  background: white;
  width: calc(50vw - 1px);
  z-index: 5;
}
`;

module.exports = (emitter, state) => {
  const template = menuTemplate(emitter);
  const menu = Menu.buildFromTemplate(template);

  if (process.platform !== 'darwin') {
    const bar = html`<span class="${ styles }">
    <div id="electron-titlebar" class="drag tilebar"></div>
    <span class="menu">☰</span>
    <div class="white"></div>
    </span>`;

    document.body.appendChild(bar);

    require('electron-titlebar');

    document.querySelector('.menu').onclick = () => {
      menu.popup({
        x: 20,
        y: 12
      })
    };
  } else {
    Menu.setApplicationMenu(menu);
  }
};
