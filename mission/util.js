/**
 * @fileOverview
 * todo 这文件干嘛使的
 * @author iNahoo
 * @since 2018/6/22.
 */
"use strict";

const fs = require('fs');
const isExist = p => {
  try {
    fs.statSync(p);
    return true;
  } catch (e) {
    return false;
  }
};

module.exports = {
  isExist,
};
