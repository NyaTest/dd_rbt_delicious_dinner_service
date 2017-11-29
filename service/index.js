/**
 * Created by iNahoo on 2017/8/11.
 */
"use strict";

const glob = require('glob');
const path = require('path');
const KoaRouter = require('koa-route');

require('../controller');

global.abp = path.resolve(__dirname, '../') + '/';

const loadService = function (app) {
    const list = glob.sync('./service/*/**/index.jsr');
    list.map(p => {
        const handle = require('../' + p);
        p = p.replace(/^\.\/service/, '').replace(/index\.jsr$/, '');
        console.log('create service at:', p);

        app.use(KoaRouter.get(p, handle));
    });
};

module.exports = loadService;