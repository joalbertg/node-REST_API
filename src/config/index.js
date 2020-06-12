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

// Process URI
const dbObj = {
  RAW_DB_URI: process.env.RAW_DB_URI,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DATABASE: process.env.DATABASE,
  DB_PORT: process.env.DB_PORT,
  FLAG_ADMIN: process.env.FLAG_ADMIN
};

// Token Expires In
// Eg: 60, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count. If
// you use a string be sure you provide the time units (days, hours, etc), otherwise
// milliseconds unit is used by default ("120" is equal to "120ms").
process.env.TOKEN_EXPIRES_IN = '30d';

module.exports = {
  PORT: process.env.PORT,
  APPLICATION_NAME: process.env.APPLICATION_NAME,
  MONGO_OPTS,
  DB_URI: getURI(dbObj),
  TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN,
  SECRET_SEED_TOKEN: process.env.SECRET_SEED_TOKEN,
  CLIENT_ID: process.env.CLIENT_ID
}

