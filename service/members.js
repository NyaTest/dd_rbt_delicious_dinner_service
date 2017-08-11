"use strict";
/**
 * Created by iNahoo on 2017/8/11.
 */
const Router = require("./router");
class ResMessage {
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
const handle = async (ctx) => {
    ctx.body = new ResMessage({
        "text": "这里是返回",
    }).toJSON();
    ctx.status = 200;
};
module.exports = new Router('/members/', handle);
//# sourceMappingURL=members.js.map