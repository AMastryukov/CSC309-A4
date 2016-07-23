/* AIDA Source Code */
/* Contributors located at: github.com/2nd47/CSC309-A4 */

// main app

// server modules
var bcrypt = require('bcryptjs');
var express = require('express');
var mongoose = require('mongoose');
var sequelize = require('sequelize');
var session = require('express-session');
var validator = require('validator');

// testing modules
var testCase = require('mocha').describe;
var pre = require('mocha').before;
var assertions = require('mocha').it;
var assert = require('chai').assert;

// module init
var app = express();
// router import keeps main file clean
var router = require('./router');

// app init
var db = mongoose.connect('mongodb://localhost/myapp');
const APP_PORT = 3000;
const saltRounds = 10;

function init() {
  return;
}

function main() {
  init();
  app.use('/', router);
  app.listen(APP_PORT);
  console.log('Server listening on port ' + APP_PORT);
}

main();
