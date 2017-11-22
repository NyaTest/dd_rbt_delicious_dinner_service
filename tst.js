/**
 * Created by iNahoo on 2017/8/11.
 */
/*
import request = require("request-promise");
const api: string = 'https://oapi.dingtalk.com/robot/send?access_token=b920089bde0d0e13d4366ed7d7af4bab1b3c3c2ba72bdf7e2dfb4a82db452af2';
const body = {
    "msgtype": "markdown",
    "markdown": {
        "title": "测试消息",
        "text": `行1 \n\n> \n\n行2`
    },
    "at": {}
};
(async function () {
    console.log(api);
    const r = request({
        method: "POST",
        uri: api,
        headers: {
            "Accept": "application/json",
            "Accept-Encoding": "utf-8",
            "Accept-Language": "zh-CN,zh;q=0.8,en;q=0.6",
            "Cache-Control": "no-cache",
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        // json: true,
    });
    console.log(r.body);
    console.log(r.headers);
    console.log(await r);
})();

*/
const NodeCanvas = require('canvas');
const fs = require('fs');
const { resolve } = require('path');
const canvas = new NodeCanvas(200, 200);
const ctx = canvas.getContext('2d');
ctx.font = '30px';
ctx.rotate(0.1);
ctx.fillText('Awesome!', 50, 100);
const text = ctx.measureText('Awesome!');
ctx.strokeStyle = 'rgba(0,0,0,0.5)';
ctx.beginPath();
ctx.lineTo(50, 102);
ctx.lineTo(50 + text.width, 102);
ctx.stroke();
const buffer = canvas.toBuffer();
fs.writeFileSync(resolve(__dirname, 'tst.png'), buffer, 'utf-8');
// Draw cat with lime helmet
// loadImage('examples/images/lime-cat.jpg').then((image) => {
//     ctx.drawImage(image, 50, 0, 70, 70);
//
//     console.log('<img src="' + canvas.toDataURL() + '" />')
// })
(async function () {
})();
//# sourceMappingURL=tst.js.map