/**
 * Created by iNahoo on 2017/8/12.
 */

import request = require('request-promise');
import './entry';

const timeout = (time: Number) => new Promise(resolve => {
    setTimeout(resolve, time);
});

const test = async () => {

    const domain = 'http://127.0.0.1:30000/';
    const testText = '卫晨，风海,元谦,猎隼，奈帆，帼英';

    await timeout(2000);

    let ret = await request.get(domain + `members/?query=${encodeURIComponent(testText)}`);
    console.log(ret);

};
test().then();