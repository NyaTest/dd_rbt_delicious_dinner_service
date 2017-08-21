"use strict";
/**
 * Created by iNahoo on 2017/8/12.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise");
require("./entry");
require("../ele");
const timeout = (time) => new Promise(resolve => {
    setTimeout(resolve, time);
});
const test = async () => {
    const domain = 'http://127.0.0.1:30000/';
    await timeout(2000);
    let ret;
    let req;
    req = `discounts/`;
    ret = await request.get(domain + req);
    console.log(ret);
    // const testText = '卫晨，风海,元谦,猎隼，奈帆，帼英';
    // req = `members/?query=${encodeURIComponent(testText)}`;
    // ret = await request.get(domain + req);
    // console.log(ret);
    //
    // req = `dinners/`;
    // ret = await request.get(domain + req);
    // console.log(ret);
    //
    // req = `menus/`;
    // ret = await request.get(domain + req);
    // console.log(ret);
};
test().then();
//# sourceMappingURL=test.js.map