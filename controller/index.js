/**
 * @fileOverview
 * 挂载 controller 到 global 上
 * @author iNahoo
 * @since 2017/11/29.
 */
"use strict";

const responds = require('./responds');

global.controller = {
    responds,
};