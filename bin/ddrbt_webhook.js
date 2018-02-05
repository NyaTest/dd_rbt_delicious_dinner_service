/**
 * @fileOverview
 * 自动部署
 * @author iNahoo
 * @since 2017/11/29.
 */
"use strict";
const {webhook_port} = require('./config.json');

const Koa = require('koa');
const KoaRouter = require('koa-route');
const {exec} = require('child_process');
const {resolve} = require('path');

const root = resolve(__dirname, '../');

//https://github.com/NyaTest/dd_rbt_delicious_dinner_service/settings/hooks/15642985#delivery-request

const app = new Koa();

app.use(KoaRouter.post('/onpublish/', async (ctx) => {
    console.log(ctx.url + '\n' + JSON.stringify(ctx.query, null, 4));
    exec(`cd ${root} && npm run restart`);
    ctx.body = 'success';
}));

app.listen(webhook_port);
console.log(`github webhook listening at port: ${webhook_port}`);

