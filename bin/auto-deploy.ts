import Koa = require('koa');
import KoaRouter = require('koa-route');
import {exec} from 'child_process';
import {resolve} from 'path';

const root = resolve(__dirname, '../');

const PORT = 53647;
//https://github.com/NyaTest/dd_rbt_delicious_dinner_service/settings/hooks/15642985#delivery-request

const app = new Koa();

app.use(KoaRouter.post('/onpublish/', async (ctx) => {
    console.log(ctx.url + '\n' + JSON.stringify(ctx.query, null, 4));
    exec(`cd ${root} && npm run server`);
    ctx.body = 'success';
}));

app.listen(PORT);
console.log(`github webhook listening at port: ${PORT}`);

//sihgiuhwi3h29vjs