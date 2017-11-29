/**
 * Created by iNahoo on 2017/8/11.
 */
const Koa = require('koa');
const KoaRouter = require('koa-route');

export class Router {
    route;
    handle;

    constructor(route, handle) {
        this.route = route;
        this.handle = handle;
    }

    load(app) {
        app.use(KoaRouter.get(this.route, this.handle));
    }
}

module.exports = class ResSuccessMessage {
    fields = {};

    constructor(fields) {
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