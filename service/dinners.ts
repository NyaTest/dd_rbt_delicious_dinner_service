/**
 * Created by iNahoo on 2017/8/12.
 */
import {Router, ResSuccessMessage} from './router';

const Menus = new class {

    private menu = [
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
        "粥",
        "红烧肉<田老师>",
        "今天尝个鲜，点点新菜吧！"
    ];

    getSomeOne() {
        const L: number = this.menu.length;
        const n: number = Math.floor(Math.random() * L);
        return this.menu[n];
    }

    getAllMenus() {
        const m = this.menu.concat();
        m.pop();
        let s: string = m.join('\n* ');
        s = '\n完整菜单\n\n* ' + s;
        // s = s.replace(/</g, '&lt');
        // s = s.replace(/>/g, '&gt');
        return s;
    }

};

export const dinner = new Router('/dinners/', async (ctx) => {

    ctx.body = new ResSuccessMessage({ //返回参数和对应的值
        "text": `${Menus.getSomeOne()}`,
    }).toJSON();

    ctx.status = 200;
});


export const menu = new Router('/menus/', async (ctx) => {

    ctx.body = new ResSuccessMessage({ //返回参数和对应的值
        "text": `${Menus.getAllMenus()}`,
    }).toJSON();

    ctx.status = 200;
});