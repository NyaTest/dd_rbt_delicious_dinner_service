/**
 * Created by iNahoo on 2017/8/11.
 */
import Router = require('./router');

class ResSuccessMessage {
    fields: {};

    constructor(fields: Object) {
        this.fields = fields;
    }

    toJSON() {
        return JSON.stringify({
            success: true,
            errorCode: String(200),
            errorMsg: "",
            fields: this.fields,
        });
    }
}

const handle = async (ctx) => {

    const query = ctx.query.query;
    console.log('query', query);

    ctx.body = new ResSuccessMessage({ //返回参数和对应的值
        "text": `这里是返回: ${query}`,
    }).toJSON();

    ctx.status = 200;
};


export= new Router('/members/', handle);