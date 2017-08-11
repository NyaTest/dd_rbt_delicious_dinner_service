"use strict";
/**
 * Created by iNahoo on 2017/8/11.
 */
const Router = require("./router");
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
const handle = async (ctx) => {
    const query = ctx.query.query;
    console.log('query', query);
    ctx.body = new ResSuccessMessage({
        "text": `这里是返回: ${query}`,
    }).toJSON();
    ctx.status = 200;
};
module.exports = new Router('/members/', handle);
//# sourceMappingURL=members.js.map