/**
 * Created by iNahoo on 2017/8/11.
 */
import {Router, ResSuccessMessage} from './router';

const handle = async (ctx) => {

    ctx.body = new ResSuccessMessage({ //返回参数和对应的值
        "text": `test1`,
    }).toJSON();

    ctx.status = 200;
};


export const test = new Router('/test/', handle);