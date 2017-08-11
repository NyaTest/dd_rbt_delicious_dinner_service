/**
 * Created by iNahoo on 2017/8/11.
 */
import Koa = require('koa');
import Router = require('koa-route');

export = class {
    route: String;
    handle: Function;

    constructor(route: String, handle: Function) {
        this.route = route;
        this.handle = handle;
    }

    load(app: Koa) {
        app.use(Router.get(this.route, this.handle));
    }
}