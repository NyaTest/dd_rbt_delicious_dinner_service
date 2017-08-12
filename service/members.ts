/**
 * Created by iNahoo on 2017/8/11.
 */
import Router = require('./router');

class ResSuccessMessage {
    fields: Object;

    constructor(fields: Object) {
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
    private members: Array<string>;
    private count: number = 2;

    constructor(query: string) {
        this.members = query.split(/[,，\s]+/).filter(s => s.length);
    }

    getErrand() {
        const arr = this.members.concat();
        let tar: Array<string> = [];
        let i: number = 0;
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

    ctx.body = new ResSuccessMessage({ //返回参数和对应的值
        "text": `取餐的人是: ${members.getErrand()}`,
    }).toJSON();

    ctx.status = 200;
};


export= new Router('/members/', handle);


// const Test = () => {
//     const q = new MembersGroup('奈，封,iasi 高ijwev。，收到覅就。请问idj,f是，');
//     console.log(q.log());
//     console.log(q.getErrand());
// };
// Test();