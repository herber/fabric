module.exports = (str, count) => {
  return str.replace(/^(?!\s*$)/mg, ' '.repeat(count));
};
