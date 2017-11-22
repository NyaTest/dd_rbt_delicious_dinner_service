"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const paramsToUri = p => Object.entries(p).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&");
const header = {
    "Accept": "application/json",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "zh-CN,zh;q=0.8,en;q=0.6",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Length": "111",
    "Content-Type": "application/x-www-form-urlencoded",
    "Cookie": `utm_source=0; w_cid=110100; w_cpy_cn="%E5%8C%97%E4%BA%AC"; w_cpy=beijing; w_latlng=39904030,116407526; webp=1; _lxsdk=15e0d3d700dc8-07a7bd9e847046-574e6e46-3d10d-15e0d3d700dc8; __mta=151345030.1503460684751.1503460684751.1503460684751.1; _lxsdk_s=44b938779cb89b42efa500d3f529%7C%7C2; terminal=i; w_utmz="utm_campaign=(direct)&utm_source=5000&utm_medium=(none)&utm_content=(none)&utm_term=(none)"; w_visitid=e9bbc6c2-1b9c-49cf-a9a3-6238705e82ac; w_uuid=FWwbwtvMLUnx8aNghuPuy-LmUS15cCRHlVoTlDNJ2p-w67f6l40YNKwL29pQxpFM; JSESSIONID=s6et1ijsrp1ao8zhneduwq1`,
    "Host": "i.waimai.meituan.com",
    "Origin": "http://i.waimai.meituan.com",
    "Pragma": "no-cache",
    "Referer": "http://i.waimai.meituan.com/channel?category_type=910&category_text=%E7%BE%8E%E9%A3%9F",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
    "X-Requested-With": "XMLHttpRequest",
};
const formData = {
    uuid: 'FWwbwtvMLUnx8aNghuPuy-LmUS15cCRHlVoTlDNJ2p-w67f6l40YNKwL29pQxpFM',
    platform: 3,
    partner: 4,
    page_index: 0,
    apage: 1
};
const qs = {
    category_type: 910,
    category_text: '美食',
    _token: 'eJx9jl9rgzAUxb9LIH1RNDFRqyClZQqW0YfWtd3GGKkLGvxvs9ZS9t0XQSh72eXCOffH4XLuoI /gI RGk8H8qy8jQh1iY0Jnjs6SP8ye2Snfv8E/Hfi2rrjuB8j2Kr7AR7OomrHRKwCIJey9U1TGFcmKiaMigv5zWojbSozzVld83KRMsmzpr99ylvLAw j2YPwQQYwdOEqhPMQhh5cEuhFQP/3cd5UfFEyGRDP8BBFZFbWWYCxY1Dk2pYDVL0qUfWUFpOySeWkZ5HVwAd8PSQ7McRJqOHNfvuciGGdpPNL11wvO4aa89HSes0s6aWMs/Yl6k7skGdvXbw5DtWxaLvtwVoVzdIU9DW6BgH4 QXopHJv',
};
const api = 'http://i.waimai.meituan.com/ajax/v6/poi/filter';
const getResList = async () => {
    const cm = `curl 
        '${api}?${paramsToUri(qs)}' 
        ${Object.entries(header).map(([key, value]) => ` -H '${key}:${value}' `).join(' ')}
        --data '${paramsToUri(formData)}' 
        --compressed
    `.replace(/\n/g, '');
    try {
        const res = child_process_1.execSync(cm).toString('utf8');
        console.log(res);
        const body = JSON.parse(res);
        return body.data.poilist;
    }
    catch (e) {
        console.log(e);
    }
};
const start = async () => {
    const list = await getResList();
    const f = list.map(R => R.name);
    console.log(JSON.stringify(f, null, 4));
};
start().then();
//# sourceMappingURL=index.js.map