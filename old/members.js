/**
 * Created by iNahoo on 2017/8/11.
 */
"use strict";

const {Router, ResSuccessMessage} = require('./router');

class MembersGroup {
    private members = [];
    private count = 2;

    constructor(query) {
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
}

const handle = async (ctx) => {

    const query = ctx.query.query;
    const members = new MembersGroup(query);

    ctx.body = new ResSuccessMessage({ //返回参数和对应的值
        "text": `取餐的人是: ${members.getErrand()}`,
    }).toJSON();

    ctx.status = 200;
};


module.exports = new Router('/members/', handle);