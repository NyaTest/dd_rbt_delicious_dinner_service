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
class MembersGroup {
    constructor(query) {
        this.count = 2;
        this.members = query.split(/[,，\s]+/).filter(s => s.length);
    }
    getErrand() {
        const arr = this.members.concat();
        let tar = [];
        let i = 0;
        while (i < this.count) {
            i++;
            const index = Math.floor(Math.random() * arr.length);
            tar = tar.concat(arr.splice(index, 1));
        }
        return tar;
    }
    log() {
        return JSON.stringify(this.members);
    }
}
const handle = async (ctx) => {
    const query = ctx.query.query;
    const members = new MembersGroup(query);
    ctx.body = new ResSuccessMessage({
        "text": `取餐的人是: ${members.getErrand()}`,
    }).toJSON();
    ctx.status = 200;
};
module.exports = new Router('/members/', handle);
//# sourceMappingURL=members.js.map