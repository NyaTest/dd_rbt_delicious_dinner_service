"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const KoaRouter = require("koa-route");
const child_process_1 = require("child_process");
const path_1 = require("path");
const root = path_1.resolve(__dirname, '../');
const PORT = 53647;
//https://github.com/NyaTest/dd_rbt_delicious_dinner_service/settings/hooks/
const app = new Koa();
app.use(KoaRouter.post('/onpublish/', async (ctx) => {
    console.log(ctx.url + '\n' + JSON.stringify(ctx.query, null, 4));
    child_process_1.exec(`cd ${root} && npm run server`);
    ctx.body = 'success';
}));
app.listen(PORT);
console.log(`github webhook listening at port: ${PORT}`);
//sihgiuhwi3h29vjs 
//# sourceMappingURL=auto-deploy.js.map