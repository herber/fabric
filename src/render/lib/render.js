const hljs = require('highlight.js');

hljs.configure({
  classPrefix: 'code-',
  usebr: true
});

const md = require('markdown-it')({
  highlight: function (str, lang) {
    if (localStorage.getItem('settings-syntax-highlighting') == 'true') {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return '<pre style="white-space: pre" class="code"><code>' +
          hljs.highlight(lang, str, true).value.replace(/\n/g, '<br />') +
          '</code></pre>';
        } catch (__) {}
      }

      return '<pre class="code"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    } else {
      return '<pre class="code"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
  },
  linkify: true
});

module.exports = (raw) => {
  return md.render(raw);
};
