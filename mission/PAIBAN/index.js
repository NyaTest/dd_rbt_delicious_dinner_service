/**
 * @fileOverview
 * @author iNahoo
 * @since 2018/6/22.
 */
"use strict";

const fs = require('fs');
const path = require('path');
const request = require('request-promise');

const {isExist} = require('../util');


const LOCAL_FILE_NAME = path.resolve(__dirname, '.current');
const NAME_LIST = ["岱言", "山欢", "悟义", "寒尽"];

let current = '';

if (isExist(LOCAL_FILE_NAME)) {
  const last = fs.readFileSync(LOCAL_FILE_NAME, 'utf-8');
  const index = NAME_LIST.indexOf(last) + 1;
  if (index < NAME_LIST.length) {
    current = NAME_LIST[index];
  } else {
    current = NAME_LIST[0];
  }
  
} else {
  current = NAME_LIST[0];
}

fs.writeFileSync(LOCAL_FILE_NAME, current, 'utf-8');

request({
  method: "POST",
  url: 'https://oapi.dingtalk.com/robot/send?access_token=cfe8ff163c03bbf71623be04956a9d716e59d88776273ccaa341410c828ae7bd',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  },
  body: JSON.stringify({
    "msgtype": "text",
    "text": {
      "content": "今天值班的人是:" + current,
    },
  })
}).then(res => {
  console.log(res);
}).catch(err => {
  console.log(err);
});
