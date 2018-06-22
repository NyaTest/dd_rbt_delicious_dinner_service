/**
 * @fileOverview
 * @author iNahoo
 * @since 2018/6/22.
 */
"use strict";


const fs = require('fs');
const path = require('path');
const {isExist} = require('./util');
const LOG_FILE_NAME = path.resolve(__dirname, '.log');

const noop = () => {
};

module.exports = function (what) {
  let json;
  if (what instanceof Error) {
    json = JSON.stringify(what.toString());
  } else {
    json = JSON.stringify(what);
  }
  
  if (isExist(LOG_FILE_NAME)) {
    fs.appendFile(LOG_FILE_NAME, '\n\n' + json, 'utf-8', noop);
  } else {
    fs.writeFile(LOG_FILE_NAME, '\n\n' + json, 'utf-8', noop);
  }
};