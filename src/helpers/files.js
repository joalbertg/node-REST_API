const getYYYYMMddHHmmss = () => {
  const d = new Date();
  const YYYYmmdd = `${d.getFullYear()}${d.getMonth()}${d.getDate()}`;
  const HHmmss = `${d.getHours()}${d.getMinutes()}${d.getSeconds()}`;
  return YYYYmmdd+HHmmss;
}

module.exports = {
  getYYYYMMddHHmmss
};

