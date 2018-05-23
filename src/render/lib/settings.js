const xou = require('xou');
const vxv = require('vxv');

const styles = vxv`
position: fixed;
top: 0px;
left: 0px;
right: 0px;
bottom: 0px;
z-index: 9;
background: white;
display: none;

.close {
  line-height: 29px;
  padding: 0px 15px;
  position: fixed;
  top: 0px;
  left: 0px;
  -webkit-app-region: no-drag;
  user-select: none;
  font-size: 14px;
}

.close:hover {
  background-color: rgba(196, 196, 196, 0.4);
}

.content {
  max-width: 720px;
  margin: 70px auto 0px auto;
  padding: 0px 20px;
}

select {
  width: 250px;
  padding: 2px 5px;
  font-size: 16px;
  border: 1px solid #000;
  height: 30px;
  appearance: none;
  outline: none;
}

td {
  width: 100%;
}

input {
  padding: 2px 5px;
  font-size: 16px;
  border: 1px solid #000;
  outline: none;
  height: 26px;
  width: 238px;
}
`;

module.exports = (emitter, state) => {
  const element = xou`<div class="${ styles }">
    <span class="close">✕</span>
    <div class="content">
      <h1>Settings</h1>
      <table>
        <tr>
          <td>PDF-Export pageSize</td>
          <td>
            <select class="pageSize" onchange=${ () => { emitter.emit('settings-change-pageSize'); } }>
              <option value="A4">A4</option>
              <option value="A3">A3</option>
              <option value="A5">A5</option>
              <option value="Legal">Legal</option>
              <option value="Letter">Letter</option>
              <option value="Tabloid">Tabloid</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>Export Title</td>
          <td>
            <input class="exportTitle" value="${ localStorage.getItem('settings-title') || 'Fabric' }" onchange=${ () => { emitter.emit('settings-change-title'); } } />
          </td>
        </tr>
      </table>
    </div>
  </div`;

  document.body.appendChild(element);

  document.querySelector('.close').onclick = () => {
    emitter.emit('settings');
  };

  document.onkeydown = (evt) => {
    evt = evt || window.event;
    var isEscape = false;

    if ('key' in evt) {
        isEscape = (evt.key == 'Escape' || evt.key == 'Esc');
    } else {
        isEscape = (evt.keyCode == 27);
    }

    if (isEscape && state.settings) {
      emitter.emit('settings');
    }
  };

  emitter.on('settings', () => {
    if (state.settings) {
      element.style.display = 'none';
    } else {
      element.style.display = 'block';
    }

    state.settings = !state.settings;
  });

  emitter.on('settings-change-pageSize', () => {
    localStorage.setItem('settings-pageSize', document.querySelector('.pageSize').value);
  });

  emitter.on('settings-change-title', () => {
    localStorage.setItem('settings-title', document.querySelector('.exportTitle').value);
  });
};
