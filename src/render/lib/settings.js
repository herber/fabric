const xou = require('xou');
const vxv = require('vxv');
const { shell, app, getCurrentWindow } = require('electron').remote;
const path = require('path');

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

button {
  padding: 2px 5px;
  font-size: 16px;
  border: 1px solid #000;
  outline: none;
  height: 30px;
  width: 238px;
  background: white;
  transition: all .3s;

  &:hover {
    color: white;
    background: black;
  }
}

h1 {
  margin: 0px;
}

.hint {
  color: #666;
  font-size: 12px;
  padding-bottom: 20px;
}

summary, details {
  outline: none;
}

details {
  margin: 10px 0px;
}

.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

/* Create a custom checkbox */
.checkmark {
  border: solid black 1px;
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #fff;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #fff;
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: #000;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
`;

module.exports = (emitter, state) => {
  const element = xou`<div class="${ styles }">
    <span class="close">✕</span>
    <div class="content">
      <h1>Settings</h1>
      <span class="hint">Changes are saved automatically.<br /><br /></span>
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
        <tr>
          <td>Theme</td>
          <td>
            <select class="template" onchange=${ () => { emitter.emit('settings-change-template'); } }></select>
          </td>
        </tr>
        <tr>
          <td>Syntax highlighting</td>
          <td>
          <label class="container">
            <input type="checkbox" class="syntaxHighlighting checkbox" ${ localStorage.getItem('settings-syntax-highlighting') == 'true' ? 'checked' : '' } onchange=${ () => { emitter.emit('settings-syntax'); } } />
            <span class="checkmark"></span>
          </label>
          </td>
        </tr>
      </table>
      <details>
      <summary>Advanced settings</summary>
      <span class="hint">Only change these settings if you know what you are doing.<br /><br /></span>
      <table>
      </table>
      </details>
      <button onclick=${ () => { emitter.emit('settings-open-config-dir'); } }>Open config directory</button>
    </div>
  </div`;

  document.body.appendChild(element);

  document.querySelector('.close').onclick = () => {
    emitter.emit('settings');
  };

  const refreshOpts = () => {
    const templateEl = document.querySelector('.template');

    state.templateList.forEach((el) => {
      templateEl.appendChild(xou`<option ${ localStorage.getItem('settings-template') == el ? 'selected' : '' } value="${ el }">${ el }</option>`);
    });
  }

  emitter.on('config-template-opts', () => {
    refreshOpts();
  });

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

  emitter.on('settings-syntax', () => {
    localStorage.setItem('settings-syntax-highlighting', document.querySelector('.syntaxHighlighting').checked);
  });

  emitter.on('settings-open-config-dir', () => {
    const confDir = path.join(app.getPath('home'), '/.fabric/styles');

    shell.showItemInFolder(confDir);
  });

  emitter.on('settings-change-template', () => {
    localStorage.setItem('settings-template', document.querySelector('.template').value);

    getCurrentWindow().reload();
  });
};
