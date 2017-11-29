/**
 * Created by iNahoo on 2017/8/12.
 */
"use strict";

const {Router, ResSuccessMessage} = require('./router');
const {service: eleService} = require('../ele');

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

module.exports.dinner = new Router('/dinners/', async (ctx) => {

    ctx.body = new ResSuccessMessage({ //返回参数和对应的值
        "text": `${Menus.getSomeOne()}`,
    }).toJSON();

    ctx.status = 200;
});

const discounts = new Router('/discounts/', async (ctx) => {

    const rcms = await eleService.getRecommend();

    const md = rcms.map(R => {
        return `[${R.name}](https://www.ele.me/shop/${R.id})

> ${R.promotion_info.replace(/\n/g, '\n> ')}

* 评分 ${R.rating}
* 推荐价位 ${R.price}
* 折扣率 ${(R.rate * 1e2).toFixed(2)}%
* 折后价格 ${R.realPrice}`
    }).join('\n\n.\n\n');

    ctx.body = new ResSuccessMessage({ //返回参数和对应的值
        "markdown": md,
    }).toJSON();

    ctx.status = 200;
});

const menu = new Router('/menus/', async (ctx) => {

    ctx.body = new ResSuccessMessage({ //返回参数和对应的值
        "text": `${Menus.getAllMenus()}`,
    }).toJSON();

    ctx.status = 200;
});
