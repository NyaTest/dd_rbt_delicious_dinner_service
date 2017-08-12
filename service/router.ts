/**
 * Created by iNahoo on 2017/8/11.
 */
import Koa = require('koa');
import KoaRouter = require('koa-route');

export class Router {
    route: String;
    handle: Function;

    constructor(route: String, handle: Function) {
        this.route = route;
        this.handle = handle;
    }

    load(app: Koa) {
        app.use(KoaRouter.get(this.route, this.handle));
    }
}

export class ResSuccessMessage {
    fields: Object;

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