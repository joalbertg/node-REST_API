const getURI = config => {
  return config.RAW_DB_URI.replace('<user>', config.DB_USER)
    .replace('<password>', config.DB_PASSWORD)
    .replace('<db>', config.DATABASE)
    .replace('<flag_admin>', config.FLAG_ADMIN);
}

module.exports = {
  getURI
};

