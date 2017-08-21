"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by iNahoo on 2017/8/12.
 */
const router_1 = require("./router");
const ele_1 = require("../ele");
const Menus = new class {
    constructor() {
        this.menu = [
            "馄饨",
            "包子",
            "护国寺",
            "酸菜鱼<柠檬酸菜鱼>",
            "煲仔饭<仔皇堡>",
            "煎饼<黄太吉煎饼>",
            "饺子<小恒水饺>",
            "肉夹馍<陕味十足>",
            "面条",
            "楼上楼",
            "米粉",
            "土豆粉<?>",
            "炒菜<花家怡园>",
            "麻辣香锅<江超麻辣香锅>",
            "粥",
            "红烧肉<田老师>",
            "今天尝个鲜，点点新菜吧！"
        ];
    }
    getSomeOne() {
        const L = this.menu.length;
        const n = Math.floor(Math.random() * L);
        return this.menu[n];
    }
    getAllMenus() {
        const m = this.menu.concat();
        m.pop();
        let s = m.join('\n* ');
        s = '\n完整菜单\n\n* ' + s;
        return s;
    }
};
exports.dinner = new router_1.Router('/dinners/', async (ctx) => {
    ctx.body = new router_1.ResSuccessMessage({
        "text": `${Menus.getSomeOne()}`,
    }).toJSON();
    ctx.status = 200;
});
exports.discounts = new router_1.Router('/discounts/', async (ctx) => {
    const rcms = await ele_1.service.getRecommend();
    const md = rcms.map(R => {
        return `###${R.name}

${R.promotion_info}

* 评分 ${R.rating}
* 推荐价位 ${R.price}
* 折扣率 ${(R.rate * 1e2).toFixed(2)}%
* 折后价格 ${R.realPrice}`;
    }).join('\n\n---\n\n');
    ctx.body = new router_1.ResSuccessMessage({
        "markdown": md,
    }).toJSON();
    ctx.status = 200;
});
exports.menu = new router_1.Router('/menus/', async (ctx) => {
    ctx.body = new router_1.ResSuccessMessage({
        "text": `${Menus.getAllMenus()}`,
    }).toJSON();
    ctx.status = 200;
});
//# sourceMappingURL=dinners.js.map