"use strict";
const Router = require("koa-route");
module.exports = class {
    constructor(route, handle) {
        this.route = route;
        this.handle = handle;
    }
    load(app) {
        app.use(Router.get(this.route, this.handle));
    }
};
//# sourceMappingURL=router.js.map