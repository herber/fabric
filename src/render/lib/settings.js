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
  margin: 40px auto 0px auto;
  padding: 0px 20px;
}
`;

const element = xou`<div class="${ styles }">
<span class="close">✕</span>
<div class="content">
  <h1>Settings</h1>
</div>
</div`;

module.exports = (emitter, state) => {
  document.body.appendChild(element);

  document.querySelector('.close').onclick = () => {
    emitter.emit('settings');
  };

  emitter.on('settings', () => {
    if (state.settings) {
      element.style.display = 'none';
    } else {
      element.style.display = 'block';
    }

    state.settings = !state.settings;
  });
};
