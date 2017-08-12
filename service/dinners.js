"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by iNahoo on 2017/8/12.
 */
const router_1 = require("./router");
const Menus = new class {
    constructor() {
        this.menu = [
            "馄饨",
            "包子",
            "护国寺",
            "酸菜鱼<柠檬酸菜鱼>",
            "煲仔饭<仔皇堡>",
            "煎饼<?>",
            "饺子<?>",
            "肉夹馍<陕味十足>",
            "面条",
            "楼上楼",
            "米粉",
            "土豆粉<?>",
            "炒菜<花家怡园>",
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
};
exports.dinner = new router_1.Router('/dinners/', async (ctx) => {
    ctx.body = new router_1.ResSuccessMessage({
        "text": `${Menus.getSomeOne()}`,
    }).toJSON();
    ctx.status = 200;
});
exports.menu = new router_1.Router('/menus/', async (ctx) => {
    ctx.body = new router_1.ResSuccessMessage({
        "text": `${Menus.getSomeOne()}`,
    }).toJSON();
    ctx.status = 200;
});
//# sourceMappingURL=dinners.js.map