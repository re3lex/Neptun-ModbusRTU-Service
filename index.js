const dotenv = require('dotenv');
const result = dotenv.config()

if (result.error) {
  throw result.error
}

const {
  NEPTUN_IP: neptunIp,
  NEPTUN_ID: neptunId,
} = process.env;

const App = require('./app/app');

const app = new App({
  neptunIp,
  neptunId,
});
app.start();