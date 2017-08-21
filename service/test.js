"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by iNahoo on 2017/8/11.
 */
const router_1 = require("./router");
const handle = async (ctx) => {
    ctx.body = new router_1.ResSuccessMessage({
        "text": `test2`,
    }).toJSON();
    ctx.status = 200;
};
exports.test = new router_1.Router('/test/', handle);
//# sourceMappingURL=test.js.map