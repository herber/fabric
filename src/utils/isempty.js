module.exports = (str) => {
  if (/^$/.test(str)) return true;
  return false;
};
