const express = require("express");
const app = express();
const router = express.Router();
const mysql = require('mysql2');
const myConnection = require('express-myconnection')
const config = require('./config/db');

app.use(myConnection(mysql, config.db, 'single'));

const port = 3080;
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static(__dirname + '/public'));

app.use(router);
require('./routes')(router)

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
