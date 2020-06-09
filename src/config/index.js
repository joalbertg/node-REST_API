const { getURI } = require('../helpers');

if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: __dirname + '/.env' });
}

const MONGO_OPTS = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
};

const dbObj = {
  RAW_DB_URI: process.env.RAW_DB_URI,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DATABASE: process.env.DATABASE,
  DB_PORT: process.env.DB_PORT,
  FLAG_ADMIN: process.env.FLAG_ADMIN
};

module.exports = {
  PORT: process.env.PORT,
  APPLICATION_NAME: process.env.APPLICATION_NAME,
  MONGO_OPTS,
  DB_URI: getURI(dbObj)
}

