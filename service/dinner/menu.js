/**
 * @fileOverview
 * 菜单
 * @author iNahoo
 * @since 2017/11/29.
 */
"use strict";

class _Menu_ {
    menu = [
        "<楼上小卖部>各种小吃",
        "<庆丰包子>包子",
        "护国寺",
        "<柠檬酸菜鱼>酸菜鱼",
        "<仔皇堡>煲仔饭",
        "<台资味>盒饭",
        "<小恒水饺>饺子",
        "<陕味十足>肉夹馍",
        "面条",
        "楼上楼",
        "土豆粉<?>",
        "<花家怡园>炒菜",
        "<江超麻辣香锅>麻辣香锅",
        "<田老师>红烧肉",
        "今天尝个鲜，点点新菜吧！"
    ];

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
}

const Menus = new _Menu_();
module.exports = Menus;
