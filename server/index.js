const { resolve } = require('path');
const history = require('connect-history-api-fallback');
const express = require('express');

const configureAPI = require('./configure.js');
const app = express();

const { PORT = 3000 } = process.env;

require('dotenv').config();

// API

// UI
const publicPath = resolve(__dirname, '../../dist');
const staticConf = { maxAge: '1y', etag: false };

// Goconst server
const server = app.listen(PORT, () =>
  console.log(`App running on port ${PORT}!`)
);

configureAPI(app, server);

app.use(express.static(publicPath, staticConf));
app.use('/', history());
