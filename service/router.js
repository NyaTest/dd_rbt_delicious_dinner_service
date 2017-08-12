"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KoaRouter = require("koa-route");
class Router {
    constructor(route, handle) {
        this.route = route;
        this.handle = handle;
    }
    load(app) {
        app.use(KoaRouter.get(this.route, this.handle));
    }
}
exports.Router = Router;
class ResSuccessMessage {
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
exports.ResSuccessMessage = ResSuccessMessage;
//# sourceMappingURL=router.js.map