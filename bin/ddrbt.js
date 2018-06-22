#!/usr/bin/env node
/**
 * @fileOverview
 * 入口文件
 * @author iNahoo
 * @since 2017/11/29.
 */
"use strict";
const {server_port} = require('./config.json');
global.server_port = server_port;

require('../mission');
const app = require("../app");
const loadService = require("../service");
loadService(app);
app.listen(server_port);


console.log(`server now listening at port: ${server_port}`);
