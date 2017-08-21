import Koa = require('koa');
import KoaRouter = require('koa-route');
import {execSync} from 'child_process';
import {resolve} from 'path';

const root = resolve(__dirname, '../');

const PORT = 53647;
//https://github.com/NyaTest/dd_rbt_delicious_dinner_service/settings/hooks/

const app = new Koa();

app.use(KoaRouter.get('onpublish/', async (ctx) => {
    console.log(JSON.stringify(ctx.query, null, 4));
    execSync(`cd ${root} && npm run server`);
}));

app.listen(PORT);

//1

//sihgiuhwi3h29vjs