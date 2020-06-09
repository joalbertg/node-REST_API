if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: __dirname + '/.env' });
}

const MONGO_OPTS = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
};

module.exports = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  APPLICATION_NAME: process.env.APPLICATION_NAME,
  MONGO_OPTS
}

