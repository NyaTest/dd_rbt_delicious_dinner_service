/**
 * @fileOverview
 * 菜单
 * @author iNahoo
 * @since 2017/11/29.
 */
"use strict";

class Menu {
    getSomeOne() {
        const menu = this.menu;
        const L = menu.length;
        const n = Math.floor(Math.random() * L);
        return `\n### ` + menu[n];
    }

    getAllMenus() {
        const menu = this.menu;
        const m = menu.concat();
        m.pop();
        let s = m.join('\n* ');
        s = '\n### 完整菜单\n\n* ' + s;
        return s;
    }
}

Menu.prototype.menu = [
    "<楼上小卖部>各种小吃",
    "<仔皇堡>煲仔饭",
    "<小恒水饺>饺子",
    "<陕味十足>羊汤/凉皮/肉夹馍",
    "<马兰拉面>牛肉面",
    "<张亮麻辣烫>麻辣烫",
    "<江超麻辣香锅>麻辣香锅",
    "<田老师>红烧肉",
    "<梁小猴炒饭>炒饭",
    "<湖北家乡菜>炒菜套餐",
    "<来一焗>芝士焗饭/西式快餐",
    "今天尝个鲜，点点新菜吧！"
]

const Menus = new Menu();
module.exports = Menus;
