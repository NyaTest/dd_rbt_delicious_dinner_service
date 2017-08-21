"use strict";
/**
 * Created by iNahoo on 2017/8/15.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise");
var ActivityType;
(function (ActivityType) {
    ActivityType[ActivityType["Count"] = 0] = "Count";
    ActivityType[ActivityType["Gift"] = 1] = "Gift";
    ActivityType[ActivityType["Invalid"] = 2] = "Invalid";
})(ActivityType || (ActivityType = {}));
class Activity {
    constructor(type, attribute) {
        this.type = type;
        this.beyond = attribute.beyond;
        this.count = attribute.count;
    }
}
class Restaurant {
    constructor(VO) {
        this.activities = VO.activities.reduce((last, cur) => {
            if (cur && cur.attribute) {
                const body = JSON.parse(cur.attribute);
                if (typeof body === "object") {
                    for (let beyond in body) {
                        body[beyond][1] && last.push(new Activity(ActivityType.Count, {
                            beyond: Number(beyond),
                            count: body[beyond][1]
                        }));
                    }
                }
            }
            return last;
        }, []);
        this.activities.sort((a, b) => a.beyond > b.beyond ? 1 : -1);
        this.name = VO.name;
        this.rating = VO.rating;
        this.id = VO.id;
        this.promotion_info = VO.promotion_info;
        const piecewise_agent_fee = VO.piecewise_agent_fee || {};
        const rule = piecewise_agent_fee.rules && piecewise_agent_fee.rules[0] || {};
        this.transportFee = rule.fee;
        this.threshold = rule.price;
    }
    getSale() {
        return this.activities.map(a => {
            const amount = this.transportFee + a.beyond;
            const realPrice = this.transportFee + a.beyond - a.count;
            return {
                id: this.id,
                rate: (a.count / amount),
                price: a.beyond,
                amount,
                realPrice,
            };
        });
    }
    getBaseInfo() {
        return {
            id: this.id,
            name: this.name,
            rating: this.rating,
            promotion_info: this.promotion_info,
        };
    }
}
class Service {
    constructor() {
        this.latitude = 39.954303;
        this.longitude = 116.4658754;
        this.api = "https://mainsite-restapi.ele.me/shopping/restaurants";
        this.restaurants = [];
        this.getRestaurants = async function () {
            const reqBody = await request.get(this.api + "?" + this.getRequestData());
            // const reqBody = await Promise.resolve(JSON.stringify(testData));
            const res = JSON.parse(reqBody);
            res.slice(0, 5);
            this.restaurants = res.map(VO => new Restaurant(VO));
        };
        this.getRecommend = async function (limit = 10) {
            await this.getRestaurants();
            const sales = this.restaurants
                .map(R => R.getSale())
                .reduce((last, cur) => last.concat(cur), []);
            sales.sort((a, b) => a.rate < b.rate ? 1 : -1);
            return sales.slice(0, limit).map(R => (Object.assign({}, this.getRestaurant(R.id).getBaseInfo(), R)));
        };
    }
    /**
     *
     * @param {number} offset
     * @param {number} limit
     * @return {string}
     */
    getRequestData(offset = 0, limit = 20) {
        return Object.entries({
            latitude: this.latitude,
            longitude: this.longitude,
            offset,
            limit,
            terminal: "h5",
            "extras[]": "activities",
        }).map(([key, value]) => `${key}=${value}`).join("&");
    }
    getRestaurant(id) {
        return this.restaurants.find(R => R.id === id);
    }
    log() {
        return JSON.stringify(this.restaurants, null, 4);
    }
}
exports.service = new Service();
/**
 * 测试数据
 */
// const testData = [
//     {
//         'activities': [{
//             'attribute': '17.0',
//             'description': '新用户下单立减17.0元',
//             'icon_color': '70bc46',
//             'icon_name': '首',
//             'id': 39840831,
//             'is_exclusive_with_food_activity': true,
//             'name': '新用户立减(不与其他活动共享)',
//             'tips': '新用户下单立减17.0元',
//             'type': 103
//         }, {
//             'attribute': '{"50": {"1": 25.0, "0": 0}, "100": {"1": 30.0, "0": 0}}',
//             'description': '满50减25，满100减30',
//             'icon_color': 'f07373',
//             'icon_name': '减',
//             'id': 46162513,
//             'is_exclusive_with_food_activity': true,
//             'name': '满减优惠',
//             'tips': '满50减25，满100减30',
//             'type': 102
//         }, {
//             'description': '暖心美食节●五折特惠',
//             'icon_color': 'f07373',
//             'icon_name': '折',
//             'id': 31591102,
//             'name': '暖心美食节●五折特惠',
//             'tips': '暖心美食节●五折特惠'
//         }, {
//             'description': '酸梅汤6元特价！激爽一夏！！',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 35543981,
//             'name': '酸梅汤6元特价！激爽一夏！！',
//             'tips': '酸梅汤6元特价！激爽一夏！！'
//         }],
//         'address': '北京市朝阳区新源街18号楼',
//         'authentic_id': 6321495514723680,
//         'delivery_mode': {
//             'color': '2395FF',
//             'gradient': {'rgb_from': '00AAFF', 'rgb_to': '0085FF'},
//             'id': 1,
//             'is_solid': true,
//             'text': '蜂鸟专送'
//         },
//         'description': '图片仅供参考，以实物为准！',
//         'distance': 1100,
//         'favored': false,
//         'float_delivery_fee': 5,
//         'float_minimum_order_amount': 20,
//         'id': 144180,
//         'image_path': 'a3dba4fe168f258d7f2c92b2c8950a13jpeg',
//         'is_new': false,
//         'is_premium': true,
//         'is_stock_empty': 0,
//         'is_valid': 1,
//         'latitude': 39.951378,
//         'longitude': 116.453542,
//         'max_applied_quantity_per_order': -1,
//         'name': '京味斋(新源里店)',
//         'next_business_time': '',
//         'only_use_poi': false,
//         'opening_hours': ['10:30/21:00'],
//         'order_lead_time': 62,
//         'phone': '52477127',
//         'piecewise_agent_fee': {
//             'description': '配送费¥5',
//             'extra_fee': 0,
//             'is_extra': false,
//             'rules': [{'fee': 5, 'price': 20}],
//             'tips': '配送费¥5'
//         },
//         'promotion_info': '以经营老北京风味菜品为主的连锁型餐厅，（提前下预约单，让您家宴聚餐更快捷）京味斋餐单更新啦，20余款新菜品，等您来品尝，每款菜品都采用来单现做的方式，让你外卖家宴菜品和堂食一个味。',
//         'rating': 4.6,
//         'rating_count': 0,
//         'recent_order_num': 2566,
//         'recommend': {'is_ad': false, 'reason': ''},
//         'regular_customer_count': 0,
//         'status': 1,
//         'supports': [{
//             'description': '已加入“外卖保”计划，食品安全有保障',
//             'icon_color': '999999',
//             'icon_name': '保',
//             'id': 7,
//             'name': '外卖保'
//         }, {
//             'description': '该商家支持开发票，开票订单金额30.0元起，请在下单时填写好发票抬头',
//             'icon_color': '999999',
//             'icon_name': '票',
//             'id': 4,
//             'name': '开发票'
//         }],
//         'type': 0
//     }, {
//         'activities': [{
//             'attribute': '17.0',
//             'description': '新用户下单立减17.0元',
//             'icon_color': '70bc46',
//             'icon_name': '首',
//             'id': 39840831,
//             'is_exclusive_with_food_activity': true,
//             'name': '新用户立减(不与其他活动共享)',
//             'tips': '新用户下单立减17.0元',
//             'type': 103
//         }, {
//             'attribute': '{"80": {"1": 30.0, "0": 0}, "45": {"1": 20.0, "0": 0}}',
//             'description': '满45减20，满80减30',
//             'icon_color': 'f07373',
//             'icon_name': '减',
//             'id': 42731833,
//             'is_exclusive_with_food_activity': true,
//             'name': '满减优惠',
//             'tips': '满45减20，满80减30',
//             'type': 102
//         }, {
//             'description': '19.9元蜀都冒菜套餐(限10:00-21:00)',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 44812105,
//             'name': '19.9元蜀都冒菜套餐',
//             'tips': '19.9元蜀都冒菜套餐'
//         }, {
//             'description': '9.9元爱情土豆丝(限10:00-21:00)',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 42158661,
//             'name': '9.9元爱情土豆丝',
//             'tips': '9.9元爱情土豆丝'
//         }, {
//             'description': '五折特惠(限10:00-21:00)',
//             'icon_color': 'f07373',
//             'icon_name': '折',
//             'id': 42158298,
//             'name': '五折特惠',
//             'tips': '五折特惠'
//         }],
//         'address': '北京市顺义区南法信镇东支路北法信段１９号（总证）',
//         'authentic_id': 1331445534131343,
//         'delivery_mode': {
//             'color': '2395FF',
//             'gradient': {'rgb_from': '00AAFF', 'rgb_to': '0085FF'},
//             'id': 1,
//             'is_solid': true,
//             'text': '蜂鸟专送'
//         },
//         'description': '养生粥点餐厅，引领国人健康饮食的“时尚轻养生”品牌',
//         'distance': 136,
//         'favored': false,
//         'float_delivery_fee': 5,
//         'float_minimum_order_amount': 20,
//         'id': 454543,
//         'image_path': 'd289a05927d7ab2f48a4e35da5fea0d9jpeg',
//         'is_new': false,
//         'is_premium': true,
//         'is_stock_empty': 0,
//         'is_valid': 1,
//         'latitude': 39.9542,
//         'longitude': 116.46428,
//         'max_applied_quantity_per_order': -1,
//         'name': '嘉和一品(霄云路店)',
//         'next_business_time': '',
//         'only_use_poi': false,
//         'opening_hours': ['10:00/21:00'],
//         'order_lead_time': 48,
//         'phone': '4001007008',
//         'piecewise_agent_fee': {
//             'description': '配送费¥5',
//             'extra_fee': 0,
//             'is_extra': false,
//             'rules': [{'fee': 5, 'price': 20}],
//             'tips': '配送费¥5'
//         },
//         'promotion_info': '嘉和一品粥其烹饪粥料的秘方源于中国千年古法，\n再融入现代科技,由世界烹饪大师屈浩先生领衔研发。\n坚守纯天然、O添加的良心品质深得消费者青睐，发展至今成为粥类引领品牌。\n是2008年奥运会和2013年园博会指定餐饮服务商。',
//         'rating': 4.6,
//         'rating_count': 0,
//         'recent_order_num': 2606,
//         'recommend': {'is_ad': false, 'reason': ''},
//         'regular_customer_count': 0,
//         'status': 1,
//         'supports': [{
//             'description': '已加入“外卖保”计划，食品安全有保障',
//             'icon_color': '999999',
//             'icon_name': '保',
//             'id': 7,
//             'name': '外卖保'
//         }, {'description': '该商家支持开发票，请在下单时填写好发票抬头', 'icon_color': '999999', 'icon_name': '票', 'id': 4, 'name': '开发票'}],
//         'type': 0
//     }, {
//         'activities': [{
//             'attribute': '17.0',
//             'description': '新用户下单立减17.0元',
//             'icon_color': '70bc46',
//             'icon_name': '首',
//             'id': 39840734,
//             'is_exclusive_with_food_activity': true,
//             'name': '新用户立减(不与其他活动共享)',
//             'tips': '新用户下单立减17.0元',
//             'type': 103
//         }, {
//             'attribute': '{"70": {"1": 20.0, "0": 0}, "45": {"1": 15.0, "0": 0}, "22": {"1": 12.0, "0": 0}}',
//             'description': '满22减12，满45减15，满70减20',
//             'icon_color': 'f07373',
//             'icon_name': '减',
//             'id': 42469641,
//             'is_exclusive_with_food_activity': true,
//             'name': '满减优惠',
//             'tips': '满22减12，满45减15，满70减20',
//             'type': 102
//         }, {
//             'description': '龙虾饭套餐，限时优惠',
//             'icon_color': 'f07373',
//             'icon_name': '惠',
//             'id': 41570440,
//             'name': '龙虾饭套餐，限时优惠',
//             'tips': '龙虾饭套餐，限时优惠'
//         }, {
//             'description': '龙虾饭套餐，限时优惠',
//             'icon_color': 'f07373',
//             'icon_name': '惠',
//             'id': 41528689,
//             'name': '龙虾饭套餐，限时优惠',
//             'tips': '龙虾饭套餐，限时优惠'
//         }],
//         'address': '北京市朝阳区左家庄东里3号楼5层101部分',
//         'authentic_id': 3331415524733727,
//         'delivery_mode': {
//             'color': '2395FF',
//             'gradient': {'rgb_from': '00AAFF', 'rgb_to': '0085FF'},
//             'id': 1,
//             'is_solid': true,
//             'text': '蜂鸟专送'
//         },
//         'description': '前方遥不可及 ，美食却只有一步之遥。当你埋头制作 PPT 时，小龙虾正爬出泥洞；当你看着枯燥的报表时，大师傅刚好往锅里洒了一把葱段；当你拥挤在公汽上时，镇江的料酒正冒出一丝香气；在你迷茫的时候，在你开心的时候，在你忙碌的时候，一份热辣的小龙虾会暖胃安心，让你感触生活的有滋有味。',
//         'distance': 1692,
//         'favored': false,
//         'float_delivery_fee': 3,
//         'float_minimum_order_amount': 20,
//         'id': 1457327,
//         'image_path': '124b3fbf584f92303939ddd084c58ca1png',
//         'is_new': false,
//         'is_premium': true,
//         'is_stock_empty': 0,
//         'is_valid': 1,
//         'latitude': 39.956717,
//         'longitude': 116.446265,
//         'max_applied_quantity_per_order': -1,
//         'name': '周大虾龙虾盖浇饭（左家庄东里店）',
//         'next_business_time': '',
//         'only_use_poi': false,
//         'opening_hours': ['09:30/20:30'],
//         'order_lead_time': 50,
//         'phone': '4000356060',
//         'piecewise_agent_fee': {
//             'description': '配送费¥3',
//             'extra_fee': -2,
//             'is_extra': true,
//             'rules': [{'fee': 3, 'price': 20}],
//             'tips': '配送费¥3'
//         },
//         'promotion_info': '欢迎进入周大虾的江湖\n订餐须知：1、本店默认开具电子发票，订单完成后以短信链接发送用户，如需纸质发票或修正开票信息，请致电客服“4000356060”，纸质发票需求需自行承担快递费（ 默认顺丰到付）。2、本店支持3天内预订单，按时送达，轻松无忧。',
//         'rating': 4.4,
//         'rating_count': 0,
//         'recent_order_num': 2190,
//         'recommend': {
//             'image_hash': '731111f3f9379e772eedf4855beae8a1jpeg',
//             'is_ad': false,
//             'track': '{"rankType":"5"}'
//         },
//         'regular_customer_count': 0,
//         'status': 1,
//         'supports': [{
//             'description': '已加入“外卖保”计划，食品安全有保障',
//             'icon_color': '999999',
//             'icon_name': '保',
//             'id': 7,
//             'name': '外卖保'
//         }, {
//             'description': '该商家支持开发票，开票订单金额1.0元起，请在下单时填写好发票抬头',
//             'icon_color': '999999',
//             'icon_name': '票',
//             'id': 4,
//             'name': '开发票'
//         }],
//         'type': 0
//     }, {
//         'activities': [{
//             'attribute': '17.0',
//             'description': '新用户下单立减17.0元',
//             'icon_color': '70bc46',
//             'icon_name': '首',
//             'id': 39840888,
//             'is_exclusive_with_food_activity': true,
//             'name': '新用户立减(不与其他活动共享)',
//             'tips': '新用户下单立减17.0元',
//             'type': 103
//         }, {
//             'attribute': '{"30": {"1": 5.0, "0": 0}}',
//             'description': '满30减5',
//             'icon_color': 'f07373',
//             'icon_name': '减',
//             'id': 46467017,
//             'is_exclusive_with_food_activity': true,
//             'name': '满减优惠',
//             'tips': '满30减5',
//             'type': 102
//         }, {
//             'description': '素食主义者往这边来（12元的特价菜）',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 66073657,
//             'name': '素食主义者往这边来（12元的特价菜）',
//             'tips': '素食主义者往这边来（12元的特价菜）'
//         }],
//         'address': '北京市朝阳区朝阳公园路6号院1号楼L-DS-22号店铺',
//         'authentic_id': 5391465521795099,
//         'delivery_mode': {
//             'color': '2395FF',
//             'gradient': {'rgb_from': '00AAFF', 'rgb_to': '0085FF'},
//             'id': 1,
//             'is_solid': true,
//             'text': '蜂鸟专送'
//         },
//         'description': '',
//         'distance': 1027,
//         'favored': false,
//         'float_delivery_fee': 5,
//         'float_minimum_order_amount': 20,
//         'id': 156378699,
//         'image_path': '6dab1b1388f924a5041029f76754a018png',
//         'is_new': false,
//         'is_premium': true,
//         'is_stock_empty': 0,
//         'is_valid': 1,
//         'latitude': 39.949928,
//         'longitude': 116.476492,
//         'max_applied_quantity_per_order': -1,
//         'name': '绿茶餐厅(北京蓝色港湾店)',
//         'next_business_time': '',
//         'only_use_poi': false,
//         'opening_hours': ['10:00/21:30'],
//         'order_lead_time': 52,
//         'phone': '010-59056379',
//         'piecewise_agent_fee': {
//             'description': '配送费¥5',
//             'extra_fee': 0,
//             'is_extra': false,
//             'rules': [{'fee': 5, 'price': 20}],
//             'tips': '配送费¥5'
//         },
//         'promotion_info': '',
//         'rating': 4.4,
//         'rating_count': 0,
//         'recent_order_num': 2836,
//         'recommend': {'is_ad': false, 'reason': ''},
//         'regular_customer_count': 0,
//         'status': 1,
//         'supports': [{
//             'description': '已加入“外卖保”计划，食品安全有保障',
//             'icon_color': '999999',
//             'icon_name': '保',
//             'id': 7,
//             'name': '外卖保'
//         }],
//         'type': 0
//     }, {
//         'activities': [{
//             'attribute': '21.0',
//             'description': '新用户下单立减21.0元',
//             'icon_color': '70bc46',
//             'icon_name': '首',
//             'id': 45642857,
//             'is_exclusive_with_food_activity': true,
//             'name': '新用户立减(不与其他活动共享)',
//             'tips': '新用户下单立减21.0元',
//             'type': 103
//         }, {
//             'attribute': '{"10": {"1": 9.0, "0": 0}, "50": {"1": 22.0, "0": 0}, "29": {"1": 15.0, "0": 0}, "70": {"1": 30.0, "0": 0}}',
//             'description': '满10减9，满29减15，满50减22，满70减30',
//             'icon_color': 'f07373',
//             'icon_name': '减',
//             'id': 46850777,
//             'is_exclusive_with_food_activity': true,
//             'name': '满减优惠',
//             'tips': '满10减9，满29减15，满50减22，满70减30',
//             'type': 102
//         }, {
//             'description': '15元特惠单品，好吃~',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 66532497,
//             'name': '15元特惠单品，好吃~',
//             'tips': '15元特惠单品，好吃~'
//         }, {
//             'description': '七夕活动五折来袭，示爱不等待~',
//             'icon_color': 'f07373',
//             'icon_name': '折',
//             'id': 66486817,
//             'name': '七夕活动五折来袭，示爱不等待~',
//             'tips': '七夕活动五折来袭，示爱不等待~'
//         }, {
//             'description': '台湾1号卤肉饭',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 53860265,
//             'name': '台湾1号卤肉饭',
//             'tips': '台湾1号卤肉饭'
//         }, {
//             'description': '19元单人新品套餐，好吃～',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 48514833,
//             'name': '19元单人新品套餐，好吃～',
//             'tips': '19元单人新品套餐，好吃～'
//         }, {
//             'description': '19元单人新品套餐，好吃～',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 48508673,
//             'name': '19元单人新品套餐，好吃～',
//             'tips': '19元单人新品套餐，好吃～'
//         }, {
//             'description': ' 36元好食成双（双人餐），美味齐分享～',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 48497001,
//             'name': ' 36元好食成双（双人餐），美味齐分享～',
//             'tips': ' 36元好食成双（双人餐），美味齐分享～'
//         }, {
//             'description': '五折新品，实惠到爆～',
//             'icon_color': 'f07373',
//             'icon_name': '折',
//             'id': 48485841,
//             'name': '五折新品，实惠到爆～',
//             'tips': '五折新品，实惠到爆～'
//         }, {
//             'description': '6.6折',
//             'icon_color': 'f07373',
//             'icon_name': '特',
//             'id': 41338724,
//             'name': '6.6折',
//             'tips': '6.6折'
//         }, {
//             'description': '五折下午茶，清凉一下～',
//             'icon_color': 'f07373',
//             'icon_name': '折',
//             'id': 38402477,
//             'name': '五折下午茶，清凉一下～',
//             'tips': '五折下午茶，清凉一下～'
//         }, {
//             'description': '五折新品，实惠到爆～',
//             'icon_color': 'f07373',
//             'icon_name': '折',
//             'id': 38401787,
//             'name': '五折新品，实惠到爆～',
//             'tips': '五折新品，实惠到爆～'
//         }],
//         'address': '北京市朝阳区霞光里1号101-A1',
//         'authentic_id': 6321465521946919,
//         'bidding': '{"core":{"index":4,"target":{"restaurantId":946119,"weight":350,"probability":0.0885000005364418},"come_from":1,"next":{"restaurantId":1139553,"weight":160,"probability":0.1234000027179718}}}',
//         'description': '',
//         'distance': 820,
//         'favored': false,
//         'float_delivery_fee': 5,
//         'float_minimum_order_amount': 20,
//         'id': 946119,
//         'image_path': '10691d6b7d9f13b8c25d2c5e9344bbe4jpeg',
//         'is_new': false,
//         'is_premium': true,
//         'is_stock_empty': 0,
//         'is_valid': 1,
//         'latitude': 39.958766,
//         'longitude': 116.458206,
//         'max_applied_quantity_per_order': -1,
//         'name': '台资味（北京三元桥店）',
//         'next_business_time': '',
//         'only_use_poi': false,
//         'opening_hours': ['09:00/20:10'],
//         'order_lead_time': 56,
//         'phone': '57152700 18710077921',
//         'piecewise_agent_fee': {
//             'description': '配送费¥5',
//             'extra_fee': 0,
//             'is_extra': false,
//             'rules': [{'fee': 5, 'price': 20}],
//             'tips': '配送费¥5'
//         },
//         'promotion_info': '',
//         'rating': 4.7,
//         'rating_count': 0,
//         'recent_order_num': 1498,
//         'recommend': {
//             'image_hash': '731111f3f9379e772eedf4855beae8a1jpeg',
//             'is_ad': true,
//             'reason': '广告',
//             'track': '{"rankType":"8"}'
//         },
//         'regular_customer_count': 0,
//         'status': 1,
//         'supports': [],
//         'type': 0
//     }, {
//         'activities': [{
//             'attribute': '20.0',
//             'description': '新用户下单立减20.0元',
//             'icon_color': '70bc46',
//             'icon_name': '首',
//             'id': 45976049,
//             'is_exclusive_with_food_activity': true,
//             'name': '新用户立减(不与其他活动共享)',
//             'tips': '新用户下单立减20.0元',
//             'type': 103
//         }, {
//             'attribute': '{"50": {"1": 35.0, "0": 0}, "100": {"1": 70.0, "0": 0}}',
//             'description': '满50减35，满100减70',
//             'icon_color': 'f07373',
//             'icon_name': '减',
//             'id': 53993969,
//             'is_exclusive_with_food_activity': true,
//             'name': '满减优惠',
//             'tips': '满50减35，满100减70',
//             'type': 102
//         }, {
//             'description': '6折超值享',
//             'icon_color': 'f07373',
//             'icon_name': '折',
//             'id': 66649513,
//             'name': '6折超值享',
//             'tips': '6折超值享'
//         }, {
//             'description': '大牌满减',
//             'icon_color': 'f07373',
//             'icon_name': '折',
//             'id': 66646049,
//             'name': '大牌满减',
//             'tips': '大牌满减'
//         }, {
//             'description': '6折大牌，多份可点',
//             'icon_color': 'f07373',
//             'icon_name': '折',
//             'id': 46748057,
//             'name': '6折大牌，多份可点',
//             'tips': '6折大牌，多份可点'
//         }, {
//             'description': '9.9元鲍汁鸡腿饭套餐，量大、实惠、让你吃到饱！',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 43260385,
//             'name': '9.9元鲍汁鸡腿饭套餐，量大、实惠、让你吃到饱！',
//             'tips': '9.9元鲍汁鸡腿饭套餐，量大、实惠、让你吃到饱！'
//         }, {
//             'description': '5折香辣扇贝肉套餐，爽辣一夏！',
//             'icon_color': 'f07373',
//             'icon_name': '特',
//             'id': 43260145,
//             'name': '5折香辣扇贝肉套餐，爽辣一夏！',
//             'tips': '5折香辣扇贝肉套餐，爽辣一夏！'
//         }, {
//             'description': '19.9元土豆烧牛腩套餐，美味超值，下饭！',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 43259937,
//             'name': '19.9元土豆烧牛腩套餐，美味超值，下饭！',
//             'tips': '19.9元土豆烧牛腩套餐，美味超值，下饭！'
//         }],
//         'address': '北京市丰台区南苑槐房西路316号院2号楼东二区9-10',
//         'authentic_id': 3381495523382716,
//         'delivery_mode': {
//             'color': '2395FF',
//             'gradient': {'rgb_from': '00AAFF', 'rgb_to': '0085FF'},
//             'id': 1,
//             'is_solid': true,
//             'text': '蜂鸟专送'
//         },
//         'description': '',
//         'distance': 657,
//         'favored': false,
//         'float_delivery_fee': 3,
//         'float_minimum_order_amount': 20,
//         'folding_restaurant_brand': '卖虾便当',
//         'folding_restaurants': [{
//             'distance': 18306,
//             'id': 1262593,
//             'name': '卖虾小龙虾海鲜外卖店',
//             'order_lead_time': 44,
//             'type': 0
//         }],
//         'id': 152103016,
//         'image_path': 'a6d1b460c735809829487519da92d5d0png',
//         'is_new': false,
//         'is_premium': false,
//         'is_stock_empty': 0,
//         'is_valid': 1,
//         'latitude': 39.959676,
//         'longitude': 116.46266,
//         'max_applied_quantity_per_order': -1,
//         'name': '卖虾便当（三元桥店）',
//         'next_business_time': '',
//         'only_use_poi': false,
//         'opening_hours': ['10:00/22:00'],
//         'order_lead_time': 41,
//         'phone': '13683016410 4000580159',
//         'piecewise_agent_fee': {
//             'description': '配送费¥3',
//             'extra_fee': 0,
//             'is_extra': false,
//             'rules': [{'fee': 3, 'price': 20}],
//             'tips': '配送费¥3'
//         },
//         'promotion_info': '投诉及建议请拨打：13671262116，13671260116，我将竭诚为您服务，为了不影响您的用餐，请您提前下单！！！',
//         'rating': 4.6,
//         'rating_count': 0,
//         'recent_order_num': 2726,
//         'recommend': {'is_ad': false, 'reason': ''},
//         'regular_customer_count': 0,
//         'status': 1,
//         'supports': [{
//             'description': '已加入“外卖保”计划，食品安全有保障',
//             'icon_color': '999999',
//             'icon_name': '保',
//             'id': 7,
//             'name': '外卖保'
//         }],
//         'type': 0
//     }, {
//         'activities': [{
//             'attribute': '20.0',
//             'description': '新用户下单立减20.0元',
//             'icon_color': '70bc46',
//             'icon_name': '首',
//             'id': 65622001,
//             'is_exclusive_with_food_activity': true,
//             'name': '新用户立减(不与其他活动共享)',
//             'tips': '新用户下单立减20.0元',
//             'type': 103
//         }, {
//             'attribute': '{"25": {"1": 15.0, "0": 0}, "68": {"1": 25.0, "0": 0}, "38": {"1": 20.0, "0": 0}}',
//             'description': '满25减15，满38减20，满68减25',
//             'icon_color': 'f07373',
//             'icon_name': '减',
//             'id': 39097603,
//             'is_exclusive_with_food_activity': true,
//             'name': '满减优惠',
//             'tips': '满25减15，满38减20，满68减25',
//             'type': 102
//         }],
//         'address': '北京市朝阳区红霞路11号',
//         'authentic_id': 1371405531687459,
//         'description': '',
//         'distance': 2377,
//         'favored': false,
//         'float_delivery_fee': 4,
//         'float_minimum_order_amount': 20,
//         'id': 156793059,
//         'image_path': '60031085e8b8a141691a21018ed68cd5jpeg',
//         'is_new': false,
//         'is_premium': false,
//         'is_stock_empty': 0,
//         'is_valid': 1,
//         'latitude': 39.963307,
//         'longitude': 116.491176,
//         'max_applied_quantity_per_order': -1,
//         'name': '闰禾粥品家常菜',
//         'next_business_time': '',
//         'only_use_poi': false,
//         'opening_hours': ['07:15/23:55'],
//         'order_lead_time': 43,
//         'phone': '15201309750',
//         'piecewise_agent_fee': {
//             'description': '配送费¥4',
//             'extra_fee': 1,
//             'is_extra': true,
//             'rules': [{'fee': 4, 'price': 20}],
//             'tips': '配送费¥4'
//         },
//         'promotion_info': '',
//         'rating': 4.4,
//         'rating_count': 0,
//         'recent_order_num': 1097,
//         'recommend': {
//             'image_hash': '731111f3f9379e772eedf4855beae8a1jpeg',
//             'is_ad': false,
//             'track': '{"rankType":"18"}'
//         },
//         'regular_customer_count': 0,
//         'status': 1,
//         'supports': [{
//             'description': '已加入“外卖保”计划，食品安全有保障',
//             'icon_color': '999999',
//             'icon_name': '保',
//             'id': 7,
//             'name': '外卖保'
//         }],
//         'type': 0
//     }, {
//         'activities': [{
//             'attribute': '17.0',
//             'description': '新用户下单立减17.0元',
//             'icon_color': '70bc46',
//             'icon_name': '首',
//             'id': 39840734,
//             'is_exclusive_with_food_activity': true,
//             'name': '新用户立减(不与其他活动共享)',
//             'tips': '新用户下单立减17.0元',
//             'type': 103
//         }, {
//             'attribute': '{"34": {"1": 12.0, "0": 0}, "50": {"1": 20.0, "0": 0}, "15": {"1": 10.0, "0": 0}}',
//             'description': '满15减10，满34减12，满50减20',
//             'icon_color': 'f07373',
//             'icon_name': '减',
//             'id': 41853562,
//             'is_exclusive_with_food_activity': true,
//             'name': '满减优惠',
//             'tips': '满15减10，满34减12，满50减20',
//             'type': 102
//         }],
//         'address': '北京市朝阳区左家庄东里3号楼5层101部分',
//         'authentic_id': 3341465527833339,
//         'delivery_mode': {
//             'color': '2395FF',
//             'gradient': {'rgb_from': '00AAFF', 'rgb_to': '0085FF'},
//             'id': 1,
//             'is_solid': true,
//             'text': '蜂鸟专送'
//         },
//         'description': '这个世界没有什么烦心事是吃一份巨饿便当不能解决的，如果不能，那就试试两份。',
//         'distance': 1686,
//         'favored': false,
//         'float_delivery_fee': 5,
//         'float_minimum_order_amount': 20,
//         'id': 152338239,
//         'image_path': '9006a1ed63ee708418d2b92868293966jpeg',
//         'is_new': false,
//         'is_premium': false,
//         'is_stock_empty': 0,
//         'is_valid': 1,
//         'latitude': 39.95632,
//         'longitude': 116.44627,
//         'max_applied_quantity_per_order': -1,
//         'name': '巨饿便当（左家庄店）',
//         'next_business_time': '',
//         'only_use_poi': false,
//         'opening_hours': ['09:30/20:30'],
//         'order_lead_time': 50,
//         'phone': '021-80294898',
//         'piecewise_agent_fee': {
//             'description': '配送费¥5',
//             'extra_fee': 0,
//             'is_extra': false,
//             'rules': [{'fee': 5, 'price': 20}],
//             'tips': '配送费¥5'
//         },
//         'promotion_info': '巨饿，巨能吃，巨给力！ keep hungry keep foolish 1、为确保用餐时间望避开高峰期，提前45分钟下单 2、默认电子发票，下单24小时后以短信形式发送给您，如需纸质发票可联系客服021-80294898',
//         'rating': 4.5,
//         'rating_count': 0,
//         'recent_order_num': 1779,
//         'recommend': {
//             'image_hash': '731111f3f9379e772eedf4855beae8a1jpeg',
//             'is_ad': false,
//             'track': '{"rankType":"5"}'
//         },
//         'regular_customer_count': 0,
//         'status': 1,
//         'supports': [{
//             'description': '已加入“外卖保”计划，食品安全有保障',
//             'icon_color': '999999',
//             'icon_name': '保',
//             'id': 7,
//             'name': '外卖保'
//         }, {'description': '该商家支持开发票，请在下单时填写好发票抬头', 'icon_color': '999999', 'icon_name': '票', 'id': 4, 'name': '开发票'}],
//         'type': 0
//     }, {
//         'activities': [{
//             'attribute': '20.0',
//             'description': '新用户下单立减20.0元',
//             'icon_color': '70bc46',
//             'icon_name': '首',
//             'id': 64857713,
//             'is_exclusive_with_food_activity': true,
//             'name': '新用户立减(不与其他活动共享)',
//             'tips': '新用户下单立减20.0元',
//             'type': 103
//         }, {
//             'attribute': '{"120": {"1": 45.0, "0": 0.0}, "25": {"1": 15.0, "0": 0.0}, "60": {"1": 30.0, "0": 0.0}}',
//             'description': '满25减15，满60减30，满120减45',
//             'icon_color': 'f07373',
//             'icon_name': '减',
//             'id': 42563625,
//             'is_exclusive_with_food_activity': true,
//             'name': '满减优惠',
//             'tips': '满25减15，满60减30，满120减45',
//             'type': 102
//         }],
//         'address': '北京市朝阳区亮马桥路24号',
//         'authentic_id': 1311485536843727,
//         'description': '',
//         'distance': 2260,
//         'favored': false,
//         'float_delivery_fee': 6,
//         'float_minimum_order_amount': 20,
//         'id': 157072327,
//         'image_path': '70fdc0d6b2380e1902263efdf43cfbd2jpeg',
//         'is_new': true,
//         'is_premium': false,
//         'is_stock_empty': 0,
//         'is_valid': 1,
//         'latitude': 39.960119,
//         'longitude': 116.491282,
//         'max_applied_quantity_per_order': -1,
//         'name': '安徽板面',
//         'next_business_time': '',
//         'only_use_poi': false,
//         'opening_hours': ['07:55/22:30'],
//         'order_lead_time': 42,
//         'phone': '13693661732',
//         'piecewise_agent_fee': {
//             'description': '配送费¥6',
//             'extra_fee': 0,
//             'is_extra': false,
//             'rules': [{'fee': 6, 'price': 20}],
//             'tips': '配送费¥6'
//         },
//         'promotion_info': '',
//         'rating': 4.2,
//         'rating_count': 0,
//         'recent_order_num': 465,
//         'recommend': {
//             'image_hash': '731111f3f9379e772eedf4855beae8a1jpeg',
//             'is_ad': false,
//             'track': '{"rankType":"6"}'
//         },
//         'regular_customer_count': 0,
//         'status': 1,
//         'supports': [],
//         'type': 0
//     }, {
//         'activities': [{
//             'attribute': '24.0',
//             'description': '新用户下单立减24.0元',
//             'icon_color': '70bc46',
//             'icon_name': '首',
//             'id': 45057553,
//             'is_exclusive_with_food_activity': true,
//             'name': '新用户立减(不与其他活动共享)',
//             'tips': '新用户下单立减24.0元',
//             'type': 103
//         }, {
//             'attribute': '{"25": {"1": 24.0, "0": 0}, "60": {"1": 35.0, "0": 0}, "100": {"1": 55.0, "0": 0}}',
//             'description': '满25减24，满60减35，满100减55',
//             'icon_color': 'f07373',
//             'icon_name': '减',
//             'id': 42093809,
//             'is_exclusive_with_food_activity': true,
//             'name': '满减优惠',
//             'tips': '满25减24，满60减35，满100减55',
//             'type': 102
//         }],
//         'address': '北京市朝阳区左家庄东里3号楼5层101部分',
//         'authentic_id': 1341405529869253,
//         'bidding': '{"core":{"index":9,"target":{"restaurantId":1139553,"weight":160,"probability":0.1234000027179718},"come_from":1,"next":{"restaurantId":156173360,"weight":160,"probability":0.11299999803304672}}}',
//         'delivery_mode': {
//             'color': '2395FF',
//             'gradient': {'rgb_from': '00AAFF', 'rgb_to': '0085FF'},
//             'id': 1,
//             'is_solid': true,
//             'text': '蜂鸟专送'
//         },
//         'description': '',
//         'distance': 1665,
//         'favored': false,
//         'float_delivery_fee': 5,
//         'float_minimum_order_amount': 20,
//         'id': 1139553,
//         'image_path': '3c407ad3eb561d8e05ea200c6fdc53f2png',
//         'is_new': false,
//         'is_premium': false,
//         'is_stock_empty': 0,
//         'is_valid': 1,
//         'latitude': 39.95634,
//         'longitude': 116.44652,
//         'max_applied_quantity_per_order': -1,
//         'name': '大东北（三元桥店）',
//         'next_business_time': '',
//         'only_use_poi': false,
//         'opening_hours': ['09:00/21:25'],
//         'order_lead_time': 49,
//         'phone': '15901512575',
//         'piecewise_agent_fee': {
//             'description': '配送费¥5',
//             'extra_fee': 0,
//             'is_extra': false,
//             'rules': [{'fee': 5, 'price': 20}],
//             'tips': '配送费¥5'
//         },
//         'promotion_info': '2.99元.3.99.元特价酬宾.25-24大满减火爆热销中。限量！提前预定！赶紧下手！好评有惊喜',
//         'rating': 4.4,
//         'rating_count': 0,
//         'recent_order_num': 1904,
//         'recommend': {
//             'image_hash': '731111f3f9379e772eedf4855beae8a1jpeg',
//             'is_ad': true,
//             'reason': '广告',
//             'track': '{"rankType":"8"}'
//         },
//         'regular_customer_count': 0,
//         'status': 1,
//         'supports': [{
//             'description': '已加入“外卖保”计划，食品安全有保障',
//             'icon_color': '999999',
//             'icon_name': '保',
//             'id': 7,
//             'name': '外卖保'
//         }, {
//             'description': '该商家支持开发票，开票订单金额50.0元起，请在下单时填写好发票抬头',
//             'icon_color': '999999',
//             'icon_name': '票',
//             'id': 4,
//             'name': '开发票'
//         }],
//         'type': 0
//     }, {
//         'activities': [{
//             'attribute': '17.0',
//             'description': '新用户下单立减17.0元',
//             'icon_color': '70bc46',
//             'icon_name': '首',
//             'id': 39840831,
//             'is_exclusive_with_food_activity': true,
//             'name': '新用户立减(不与其他活动共享)',
//             'tips': '新用户下单立减17.0元',
//             'type': 103
//         }, {
//             'attribute': '{"25": {"1": 9.0, "0": 0}, "60": {"1": 20.0, "0": 0}, "45": {"1": 15.0, "0": 0}}',
//             'description': '满25减9，满45减15，满60减20',
//             'icon_color': 'f07373',
//             'icon_name': '减',
//             'id': 47356785,
//             'is_exclusive_with_food_activity': true,
//             'name': '满减优惠',
//             'tips': '满25减9，满45减15，满60减20',
//             'type': 102
//         }, {
//             'description': '优惠套餐',
//             'icon_color': 'f07373',
//             'icon_name': '惠',
//             'id': 47317857,
//             'name': '优惠套餐',
//             'tips': '优惠套餐'
//         }, {
//             'description': '新品上市',
//             'icon_color': 'f1884f',
//             'icon_name': '促',
//             'id': 43502561,
//             'name': '新品上市',
//             'tips': '新品上市'
//         }],
//         'address': '北京市朝阳区左家庄东里3号楼5层101部分',
//         'authentic_id': 7321425526622923,
//         'delivery_mode': {
//             'color': '2395FF',
//             'gradient': {'rgb_from': '00AAFF', 'rgb_to': '0085FF'},
//             'id': 1,
//             'is_solid': true,
//             'text': '蜂鸟专送'
//         },
//         'description': '辛生活麻辣美食品牌，简称《辛生活》，主打麻辣菜系，给您忙碌平淡的生活增添一点浓妆艳抹的麻辣重口味，口口过瘾！还有惊喜三观随餐附赠，让用餐时光更精彩~！关注新浪微博“辛生活麻辣美食”，发现更多生活真相！',
//         'distance': 1693,
//         'favored': false,
//         'float_delivery_fee': 5,
//         'float_minimum_order_amount': 20,
//         'id': 1457323,
//         'image_path': '5b15b6b0942f5100eac25bb07992131apng',
//         'is_new': false,
//         'is_premium': true,
//         'is_stock_empty': 0,
//         'is_valid': 1,
//         'latitude': 39.956734,
//         'longitude': 116.446261,
//         'max_applied_quantity_per_order': -1,
//         'name': '辛生活麻辣香锅便当（左家庄东里店）',
//         'next_business_time': '',
//         'only_use_poi': false,
//         'opening_hours': ['09:30/20:30'],
//         'order_lead_time': 49,
//         'phone': '4000655277',
//         'piecewise_agent_fee': {
//             'description': '配送费¥5',
//             'extra_fee': 0,
//             'is_extra': false,
//             'rules': [{'fee': 5, 'price': 20}],
//             'tips': '配送费¥5'
//         },
//         'promotion_info': '欢迎光临单人麻辣香锅美食品牌《辛生活》，10:30-12:30和16:30-18:30为用餐高峰期，请提前下单！本店默认开具电子发票，下单24小时后以短信链接发送用户，如需开纸质发票或修正开票信息，请致电客服4000655277！',
//         'rating': 4.1,
//         'rating_count': 0,
//         'recent_order_num': 1093,
//         'recommend': {
//             'image_hash': '731111f3f9379e772eedf4855beae8a1jpeg',
//             'is_ad': false,
//             'track': '{"rankType":"5"}'
//         },
//         'regular_customer_count': 0,
//         'status': 1,
//         'supports': [{
//             'description': '已加入“外卖保”计划，食品安全有保障',
//             'icon_color': '999999',
//             'icon_name': '保',
//             'id': 7,
//             'name': '外卖保'
//         }, {
//             'description': '该商家支持开发票，开票订单金额1.0元起，请在下单时填写好发票抬头',
//             'icon_color': '999999',
//             'icon_name': '票',
//             'id': 4,
//             'name': '开发票'
//         }],
//         'type': 0
//     }, {
//         'activities': [{
//             'attribute': '19.0',
//             'description': '新用户下单立减19.0元',
//             'icon_color': '70bc46',
//             'icon_name': '首',
//             'id': 45930561,
//             'is_exclusive_with_food_activity': true,
//             'name': '新用户立减(不与其他活动共享)',
//             'tips': '新用户下单立减19.0元',
//             'type': 103
//         }, {
//             'attribute': '{"60": {"1": 24.0, "0": 0}, "30": {"1": 12.0, "0": 0}}',
//             'description': '满30减12，满60减24',
//             'icon_color': 'f07373',
//             'icon_name': '减',
//             'id': 46503081,
//             'is_exclusive_with_food_activity': true,
//             'name': '满减优惠',
//             'tips': '满30减12，满60减24',
//             'type': 102
//         }, {
//             'description': '9.9特价',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 41683635,
//             'name': '9.9特价',
//             'tips': '9.9特价'
//         }, {
//             'description': '9.9特价',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 34152458,
//             'name': '9.9特价',
//             'tips': '9.9特价'
//         }, {
//             'description': '5元特价',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 35957500,
//             'name': '5元特价',
//             'tips': '5元特价'
//         }, {
//             'description': '白领5折套餐',
//             'icon_color': 'f07373',
//             'icon_name': '折',
//             'id': 39841500,
//             'name': '白领5折套餐',
//             'tips': '白领5折套餐'
//         }, {
//             'description': '6折',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 37614874,
//             'name': '6折',
//             'tips': '6折'
//         }, {
//             'description': '7折特惠',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 37614678,
//             'name': '7折特惠',
//             'tips': '7折特惠'
//         }, {
//             'description': '白领5折单人套餐',
//             'icon_color': 'f07373',
//             'icon_name': '折',
//             'id': 37598430,
//             'name': '白领5折单人套餐',
//             'tips': '白领5折单人套餐'
//         }, {
//             'description': '9.9特价',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 37597354,
//             'name': '9.9特价',
//             'tips': '9.9特价'
//         }, {
//             'description': '19.9特价',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 37597107,
//             'name': '19.9特价',
//             'tips': '19.9特价'
//         }],
//         'address': '北京市朝阳区朝阳公园1号1号楼A8单元',
//         'authentic_id': 1361475519811135,
//         'delivery_mode': {
//             'color': '2395FF',
//             'gradient': {'rgb_from': '00AAFF', 'rgb_to': '0085FF'},
//             'id': 1,
//             'is_solid': true,
//             'text': '蜂鸟专送'
//         },
//         'description': '欢迎光临',
//         'distance': 561,
//         'favored': false,
//         'float_delivery_fee': 5,
//         'float_minimum_order_amount': 20,
//         'id': 903535,
//         'image_path': '57f02b1cf81a6c9255690c62a4f15052png',
//         'is_new': false,
//         'is_premium': true,
//         'is_stock_empty': 0,
//         'is_valid': 1,
//         'latitude': 39.9515,
//         'longitude': 116.47135,
//         'max_applied_quantity_per_order': -1,
//         'name': '印巷小馆（燕莎店）',
//         'next_business_time': '',
//         'only_use_poi': false,
//         'opening_hours': ['10:00/22:00'],
//         'order_lead_time': 34,
//         'phone': '010-58670286',
//         'piecewise_agent_fee': {
//             'description': '配送费¥5',
//             'extra_fee': 0,
//             'is_extra': false,
//             'rules': [{'fee': 5, 'price': 20}],
//             'tips': '配送费¥5'
//         },
//         'promotion_info': '',
//         'rating': 4.4,
//         'rating_count': 0,
//         'recent_order_num': 970,
//         'recommend': {'is_ad': false, 'reason': ''},
//         'regular_customer_count': 0,
//         'status': 1,
//         'supports': [{
//             'description': '已加入“外卖保”计划，食品安全有保障',
//             'icon_color': '999999',
//             'icon_name': '保',
//             'id': 7,
//             'name': '外卖保'
//         }],
//         'type': 0
//     }, {
//         'activities': [{
//             'attribute': '17.0',
//             'description': '新用户下单立减17.0元',
//             'icon_color': '70bc46',
//             'icon_name': '首',
//             'id': 39840831,
//             'is_exclusive_with_food_activity': true,
//             'name': '新用户立减(不与其他活动共享)',
//             'tips': '新用户下单立减17.0元',
//             'type': 103
//         }, {
//             'attribute': '{"60": {"1": 23.0, "0": 0}, "45": {"1": 17.0, "0": 0}, "30": {"1": 11.0, "0": 0}}',
//             'description': '满30减11，满45减17，满60减23',
//             'icon_color': 'f07373',
//             'icon_name': '减',
//             'id': 42119193,
//             'is_exclusive_with_food_activity': true,
//             'name': '满减优惠',
//             'tips': '满30减11，满45减17，满60减23',
//             'type': 102
//         }, {
//             'description': '不止五折',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 62202049,
//             'name': '不止五折',
//             'tips': '不止五折'
//         }, {
//             'description': '特价19.9元套餐',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 48506105,
//             'name': '特价19.9元套餐',
//             'tips': '特价19.9元套餐'
//         }, {
//             'description': '特价25元套餐',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 43597633,
//             'name': '特价25元套餐',
//             'tips': '特价25元套餐'
//         }, {
//             'description': '9.9特价GetFun',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 43234177,
//             'name': '9.9特价GetFun',
//             'tips': '9.9特价GetFun'
//         }, {
//             'description': '五折新品套餐',
//             'icon_color': 'f07373',
//             'icon_name': '折',
//             'id': 39761785,
//             'name': '五折新品套餐',
//             'tips': '五折新品套餐'
//         }],
//         'address': '北京市朝阳区东三环北路辛2号2号楼一层',
//         'authentic_id': 7371455530442074,
//         'delivery_mode': {
//             'color': '2395FF',
//             'gradient': {'rgb_from': '00AAFF', 'rgb_to': '0085FF'},
//             'id': 1,
//             'is_solid': true,
//             'text': '蜂鸟专送'
//         },
//         'description': '优粮生活成立以来坚持多种经营模式的融合，堂食以主题餐饮、特色菜品为主；外卖以美味、营养、安全和便捷为主。在不断健全质量管理体系的过程中，将品质监管视为企业生命，从选材、备料、加工、出餐到配送无不竭心尽力。真诚希望能为忙碌于事业与家庭的人们做点事，周旋于各种事务之余能享受更好的生活',
//         'distance': 799,
//         'favored': false,
//         'float_delivery_fee': 5,
//         'float_minimum_order_amount': 20,
//         'folding_restaurant_brand': '优粮生活',
//         'folding_restaurants': [{
//             'distance': 2214,
//             'id': 861244,
//             'name': '优粮生活（三里屯店）',
//             'order_lead_time': 40,
//             'type': 0
//         }],
//         'id': 443074,
//         'image_path': 'ca30b616d6abd50faf8979896ac137b2jpeg',
//         'is_new': false,
//         'is_premium': true,
//         'is_stock_empty': 0,
//         'is_valid': 1,
//         'latitude': 39.960142,
//         'longitude': 116.460393,
//         'max_applied_quantity_per_order': -1,
//         'name': '优粮生活（三元桥东店）',
//         'next_business_time': '',
//         'only_use_poi': false,
//         'opening_hours': ['09:00/19:30'],
//         'order_lead_time': 47,
//         'phone': '13910788427',
//         'piecewise_agent_fee': {
//             'description': '配送费¥5',
//             'extra_fee': 0,
//             'is_extra': false,
//             'rules': [{'fee': 5, 'price': 20}],
//             'tips': '配送费¥5'
//         },
//         'promotion_info': '一：亲爱的们，本公司食材全程冷链运输，新鲜并保证品质，让您用餐有更高的体验和享受。 二：发票最小150元，并提供税号。本店所有餐品标准化，不能根据您的特殊要求进行修改与调整，请选择适合您口味的菜品。三：如遇特殊情况取消订单，请联系本店及饿了么客服10105757。祝您用餐愉快！\n',
//         'rating': 4.4,
//         'rating_count': 0,
//         'recent_order_num': 1493,
//         'recommend': {'is_ad': false, 'reason': ''},
//         'regular_customer_count': 0,
//         'status': 1,
//         'supports': [{
//             'description': '已加入“外卖保”计划，食品安全有保障',
//             'icon_color': '999999',
//             'icon_name': '保',
//             'id': 7,
//             'name': '外卖保'
//         }, {
//             'description': '该商家支持开发票，开票订单金额150.0元起，请在下单时填写好发票抬头',
//             'icon_color': '999999',
//             'icon_name': '票',
//             'id': 4,
//             'name': '开发票'
//         }],
//         'type': 0
//     }, {
//         'activities': [{
//             'attribute': '17.0',
//             'description': '新用户下单立减17.0元',
//             'icon_color': '70bc46',
//             'icon_name': '首',
//             'id': 39840734,
//             'is_exclusive_with_food_activity': true,
//             'name': '新用户立减(不与其他活动共享)',
//             'tips': '新用户下单立减17.0元',
//             'type': 103
//         }, {
//             'attribute': '{"25": {"1": 9.0, "0": 0}, "60": {"1": 20.0, "0": 0}, "45": {"1": 15.0, "0": 0}}',
//             'description': '满25减9，满45减15，满60减20',
//             'icon_color': 'f07373',
//             'icon_name': '减',
//             'id': 47327473,
//             'is_exclusive_with_food_activity': true,
//             'name': '满减优惠',
//             'tips': '满25减9，满45减15，满60减20',
//             'type': 102
//         }],
//         'address': '北京市朝阳区左家庄东里3号楼5层101部分',
//         'authentic_id': 5331425526873419,
//         'delivery_mode': {
//             'color': '2395FF',
//             'gradient': {'rgb_from': '00AAFF', 'rgb_to': '0085FF'},
//             'id': 1,
//             'is_solid': true,
//             'text': '蜂鸟专送'
//         },
//         'description': '"轰咖(HONG-GA!),新晋阳光外卖品牌。产品以咖喱为主，搭配鸡腿，香肠，猪排等西式餐品，打造满足符合当下年轻人对于口味、健康、创新等需求的外卖产品。我们希望通过我们对于口感的极致追求和食材的精挑细选，让咖喱这种“小众”产品融入你每天忙碌的生活。生活已然太艰辛、别让食界太安静',
//         'distance': 1649,
//         'favored': false,
//         'float_delivery_fee': 5,
//         'float_minimum_order_amount': 20,
//         'id': 1457319,
//         'image_path': 'eb2f0d8bccfcdafc24c37b779679e8f4png',
//         'is_new': false,
//         'is_premium': true,
//         'is_stock_empty': 0,
//         'is_valid': 1,
//         'latitude': 39.956356,
//         'longitude': 116.446713,
//         'max_applied_quantity_per_order': -1,
//         'name': '轰咖咖喱饭（静安市场店）',
//         'next_business_time': '',
//         'only_use_poi': false,
//         'opening_hours': ['09:30/20:30'],
//         'order_lead_time': 50,
//         'phone': '4000655177',
//         'piecewise_agent_fee': {
//             'description': '配送费¥5',
//             'extra_fee': 0,
//             'is_extra': false,
//             'rules': [{'fee': 5, 'price': 20}],
//             'tips': '配送费¥5'
//         },
//         'promotion_info': '轰咖咖喱饭，口味随心换！\n我们专注咖喱，让每一口浓郁都轰炸你的味蕾！\n订餐须知：\n1.请提前30分钟以上时间下单并确保电话畅通，以便送餐员及时联系。\n2.本店默认开具电子发票，下单24小时后以短信链接发送用户，如需开纸质发票或修正开票信息，请致电客服4000655177！',
//         'rating': 4.5,
//         'rating_count': 0,
//         'recent_order_num': 1098,
//         'recommend': {
//             'image_hash': '731111f3f9379e772eedf4855beae8a1jpeg',
//             'is_ad': false,
//             'track': '{"rankType":"5"}'
//         },
//         'regular_customer_count': 0,
//         'status': 1,
//         'supports': [{
//             'description': '已加入“外卖保”计划，食品安全有保障',
//             'icon_color': '999999',
//             'icon_name': '保',
//             'id': 7,
//             'name': '外卖保'
//         }, {
//             'description': '该商家支持开发票，开票订单金额1.0元起，请在下单时填写好发票抬头',
//             'icon_color': '999999',
//             'icon_name': '票',
//             'id': 4,
//             'name': '开发票'
//         }],
//         'type': 0
//     }, {
//         'activities': [{
//             'attribute': '20.0',
//             'description': '新用户下单立减20.0元',
//             'icon_color': '70bc46',
//             'icon_name': '首',
//             'id': 65626465,
//             'is_exclusive_with_food_activity': true,
//             'name': '新用户立减(不与其他活动共享)',
//             'tips': '新用户下单立减20.0元',
//             'type': 103
//         }, {
//             'attribute': '{"50": {"1": 38.0, "0": 0.0}, "21": {"1": 20.0, "0": 0.0}, "85": {"1": 55.0, "0": 0.0}}',
//             'description': '满21减20，满50减38，满85减55',
//             'icon_color': 'f07373',
//             'icon_name': '减',
//             'id': 46740425,
//             'is_exclusive_with_food_activity': true,
//             'name': '满减优惠',
//             'tips': '满21减20，满50减38，满85减55',
//             'type': 102
//         }, {
//             'attribute': '{"88.0": {"quantity": 1, "must_pay_online": 1, "name": "\\u5927\\u53ef\\u4e50"}, "60.0": {"quantity": 1, "must_pay_online": 1, "name": "\\u9178\\u5976\\u4e00\\u76d2"}}',
//             'description': '满60.0元赠送酸奶一盒1份，满88.0元赠送大可乐1份',
//             'icon_color': '3cc791',
//             'icon_name': '赠',
//             'id': 46739465,
//             'is_exclusive_with_food_activity': true,
//             'name': '满赠优惠',
//             'tips': '满60.0元赠送酸奶一盒1份，满88.0元赠送大可乐1份',
//             'type': 106
//         }],
//         'address': '北京市朝阳区东三环路甲2号8幢地下一层部分',
//         'authentic_id': 2351465521959260,
//         'bidding': '{"core":{"index":14,"target":{"restaurantId":156173360,"weight":160,"probability":0.11299999803304672},"come_from":1,"next":{"restaurantId":1051388,"weight":150,"probability":0.11500000208616257}}}',
//         'description': '',
//         'distance': 403,
//         'favored': false,
//         'float_delivery_fee': 3,
//         'float_minimum_order_amount': 20,
//         'id': 156173360,
//         'image_path': '1f1a0910ee96629f6d976318f94c13b0jpeg',
//         'is_new': false,
//         'is_premium': false,
//         'is_stock_empty': 0,
//         'is_valid': 1,
//         'latitude': 39.954158,
//         'longitude': 116.461144,
//         'max_applied_quantity_per_order': -1,
//         'name': '满香园土耳其烤肉饭',
//         'next_business_time': '',
//         'only_use_poi': false,
//         'opening_hours': ['09:00/21:00'],
//         'order_lead_time': 40,
//         'phone': '15010423965 15801310868',
//         'piecewise_agent_fee': {
//             'description': '配送费¥3',
//             'extra_fee': 0,
//             'is_extra': false,
//             'rules': [{'fee': 3, 'price': 20}],
//             'tips': '配送费¥3'
//         },
//         'promotion_info': '\n优惠多多，惊喜多多，比西式快餐更营养，比中式快餐更时尚。',
//         'rating': 4.6,
//         'rating_count': 0,
//         'recent_order_num': 1935,
//         'recommend': {
//             'image_hash': '731111f3f9379e772eedf4855beae8a1jpeg',
//             'is_ad': true,
//             'reason': '广告',
//             'track': '{"rankType":"8"}'
//         },
//         'regular_customer_count': 0,
//         'status': 1,
//         'supports': [{
//             'description': '已加入“外卖保”计划，食品安全有保障',
//             'icon_color': '999999',
//             'icon_name': '保',
//             'id': 7,
//             'name': '外卖保'
//         }, {
//             'description': '该商家支持开发票，开票订单金额50.0元起，请在下单时填写好发票抬头',
//             'icon_color': '999999',
//             'icon_name': '票',
//             'id': 4,
//             'name': '开发票'
//         }],
//         'type': 0
//     }, {
//         'activities': [{
//             'attribute': '20.0',
//             'description': '新用户下单立减20.0元',
//             'icon_color': '70bc46',
//             'icon_name': '首',
//             'id': 62974097,
//             'is_exclusive_with_food_activity': true,
//             'name': '新用户立减(不与其他活动共享)',
//             'tips': '新用户下单立减20.0元',
//             'type': 103
//         }, {
//             'attribute': '{"128": {"1": 9.0, "0": 0.0}, "98": {"1": 7.0, "0": 0.0}, "68": {"1": 5.0, "0": 0.0}}',
//             'description': '满68减5，满98减7，满128减9',
//             'icon_color': 'f07373',
//             'icon_name': '减',
//             'id': 39788774,
//             'is_exclusive_with_food_activity': true,
//             'name': '满减优惠',
//             'tips': '满68减5，满98减7，满128减9',
//             'type': 102
//         }, {
//             'description': '哈哈镜系列买2送1，小龙虾花蛤买1送1花蛤【大锁骨海鲜除外】',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 32670494,
//             'name': '哈哈镜系列买2送1，小龙虾花蛤买1送1花蛤【大锁骨海鲜除外】',
//             'tips': '哈哈镜系列买2送1，小龙虾花蛤买1送1花蛤【大锁骨海鲜除外】'
//         }, {
//             'description': '特价商品',
//             'icon_color': 'f07373',
//             'icon_name': '特',
//             'id': 27608236,
//             'name': '特价商品',
//             'tips': '特价商品'
//         }],
//         'address': '北京市朝阳区静安里22号住宅楼1层4-4',
//         'authentic_id': 6341495535722843,
//         'description': '图片仅供参考，一切以实物为准',
//         'distance': 1592,
//         'favored': false,
//         'float_delivery_fee': 6,
//         'float_minimum_order_amount': 27,
//         'folding_restaurant_brand': '哈哈镜',
//         'folding_restaurants': [{
//             'distance': 2726,
//             'id': 669732,
//             'name': '哈哈镜（望京）',
//             'order_lead_time': 38,
//             'type': 0
//         }, {'distance': 4510, 'id': 155297913, 'name': '哈哈镜(朝阳门店)', 'order_lead_time': 30, 'type': 0}, {
//             'distance': 5290,
//             'id': 1134170,
//             'name': '哈哈镜  望京 超市',
//             'order_lead_time': 32,
//             'type': 0
//         }, {'distance': 5708, 'id': 1860192, 'name': '哈哈镜（双井店）', 'order_lead_time': 0, 'type': 0}, {
//             'distance': 5811,
//             'id': 655899,
//             'name': '哈哈镜（外馆斜街店）',
//             'order_lead_time': 34,
//             'type': 0
//         }, {'distance': 6332, 'id': 150967037, 'name': '哈哈镜', 'order_lead_time': 40, 'type': 1}, {
//             'distance': 7733,
//             'id': 544063,
//             'name': '哈哈镜（马甸桥店）',
//             'order_lead_time': 35,
//             'type': 1
//         }, {'distance': 8376, 'id': 155792438, 'name': '哈哈镜（24H全城速配）', 'order_lead_time': 49, 'type': 1}, {
//             'distance': 9069,
//             'id': 150899238,
//             'name': '哈哈镜',
//             'order_lead_time': 44,
//             'type': 0
//         }, {'distance': 9203, 'id': 154349262, 'name': '哈哈镜', 'order_lead_time': 40, 'type': 0}, {
//             'distance': 9447,
//             'id': 2169998,
//             'name': '哈哈镜（天桥店）',
//             'order_lead_time': 0,
//             'type': 0
//         }, {'distance': 9617, 'id': 1511409, 'name': '哈哈镜（全城配送）', 'order_lead_time': 36, 'type': 0}, {
//             'distance': 9679,
//             'id': 152306148,
//             'name': '哈哈镜(前门店)',
//             'order_lead_time': 30,
//             'type': 1
//         }, {'distance': 10547, 'id': 2269572, 'name': '哈哈镜（超市购）', 'order_lead_time': 39, 'type': 1}, {
//             'distance': 10608,
//             'id': 449690,
//             'name': '哈哈镜（陶然亭店）',
//             'order_lead_time': 35,
//             'type': 0
//         }, {'distance': 10632, 'id': 156391761, 'name': '哈哈镜（太平街店）', 'order_lead_time': 0, 'type': 1}, {
//             'distance': 10734,
//             'id': 1959415,
//             'name': '哈哈镜',
//             'order_lead_time': 37,
//             'type': 0
//         }, {'distance': 10760, 'id': 911379, 'name': '哈哈镜（南站店）', 'order_lead_time': 27, 'type': 0}, {
//             'distance': 10778,
//             'id': 150028030,
//             'name': '哈哈镜',
//             'order_lead_time': 35,
//             'type': 0
//         }, {'distance': 11647, 'id': 150064545, 'name': '哈哈镜(广安门店)', 'order_lead_time': 30, 'type': 1}, {
//             'distance': 11827,
//             'id': 155001647,
//             'name': '哈哈镜',
//             'order_lead_time': 30,
//             'type': 0
//         }, {'distance': 12352, 'id': 1154980, 'name': '哈哈镜(木樨地店)', 'order_lead_time': 43, 'type': 0}, {
//             'distance': 13268,
//             'id': 890469,
//             'name': '哈哈镜（广外店）',
//             'order_lead_time': 38,
//             'type': 0
//         }, {'distance': 13857, 'id': 446054, 'name': '哈哈镜（中关村店）', 'order_lead_time': 42, 'type': 0}, {
//             'distance': 13980,
//             'id': 1785285,
//             'name': '哈哈镜（西站店）',
//             'order_lead_time': 0,
//             'type': 0
//         }, {'distance': 17589, 'id': 150102603, 'name': '哈哈镜', 'order_lead_time': 39, 'type': 0}],
//         'id': 537443,
//         'image_path': 'cd4fa4a12708552df84d2ee0d4978adcjpeg',
//         'is_new': false,
//         'is_premium': false,
//         'is_stock_empty': 0,
//         'is_valid': 1,
//         'latitude': 39.960857,
//         'longitude': 116.449256,
//         'max_applied_quantity_per_order': -1,
//         'name': '哈哈镜（三元西桥店）',
//         'next_business_time': '',
//         'only_use_poi': false,
//         'opening_hours': ['07:30/02:00'],
//         'order_lead_time': 39,
//         'phone': '13241064726 13611079309',
//         'piecewise_agent_fee': {
//             'description': '配送费¥6',
//             'extra_fee': 0,
//             'is_extra': false,
//             'rules': [{'fee': 6, 'price': 27}],
//             'tips': '配送费¥6'
//         },
//         'promotion_info': '欢迎光临本店，每天有特价商品敬请关注。',
//         'rating': 4.7,
//         'rating_count': 0,
//         'recent_order_num': 620,
//         'recommend': {'is_ad': false, 'reason': ''},
//         'regular_customer_count': 0,
//         'status': 1,
//         'supports': [{
//             'description': '该商家支持开发票，开票订单金额30.0元起，请在下单时填写好发票抬头',
//             'icon_color': '999999',
//             'icon_name': '票',
//             'id': 4,
//             'name': '开发票'
//         }],
//         'type': 0
//     }, {
//         'activities': [{
//             'attribute': '17.0',
//             'description': '新用户下单立减17.0元',
//             'icon_color': '70bc46',
//             'icon_name': '首',
//             'id': 39840734,
//             'is_exclusive_with_food_activity': true,
//             'name': '新用户立减(不与其他活动共享)',
//             'tips': '新用户下单立减17.0元',
//             'type': 103
//         }, {
//             'description': '275元 十人团餐，实惠！',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 42740321,
//             'name': '275元 十人团餐，实惠！',
//             'tips': '275元 十人团餐，实惠！'
//         }, {
//             'description': '六人优惠餐仅售170元',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 42729305,
//             'name': '六人优惠餐仅售170元',
//             'tips': '六人优惠餐仅售170元'
//         }, {
//             'description': '三人优惠餐仅售 92 元',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 42726041,
//             'name': '三人优惠餐仅售 92 元',
//             'tips': '三人优惠餐仅售 92 元'
//         }, {
//             'description': '49元咖喱鸡肉+照烧鸡肉双人餐',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 42714833,
//             'name': '49元咖喱鸡肉+照烧鸡肉双人餐',
//             'tips': '49元咖喱鸡肉+照烧鸡肉双人餐'
//         }, {
//             'description': '52.5元双人超值餐',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 42703809,
//             'name': '52.5元双人超值餐',
//             'tips': '52.5元双人超值餐'
//         }, {
//             'description': '44.5元双人优惠餐，美味~~~',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 42689001,
//             'name': '44.5元双人优惠餐，美味~~~',
//             'tips': '44.5元双人优惠餐，美味~~~'
//         }, {
//             'description': '蔬菜牛肉黑椒鸡排双人套餐“5”折特惠！',
//             'icon_color': 'f07373',
//             'icon_name': '折',
//             'id': 42678833,
//             'name': '蔬菜牛肉黑椒鸡排双人套餐“5”折特惠！',
//             'tips': '蔬菜牛肉黑椒鸡排双人套餐“5”折特惠！'
//         }, {
//             'description': '23.5元黑椒鸡排优惠套餐，超值！',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 42672705,
//             'name': '23.5元黑椒鸡排优惠套餐，超值！',
//             'tips': '23.5元黑椒鸡排优惠套餐，超值！'
//         }, {
//             'attribute': '{"50.0": {"quantity": 1, "must_pay_online": 1, "name": "\\u56e2\\u6247"}}',
//             'description': '满50.0元赠送团扇1份',
//             'icon_color': '3cc791',
//             'icon_name': '赠',
//             'id': 41472144,
//             'is_exclusive_with_food_activity': true,
//             'name': '满赠优惠',
//             'tips': '满50.0元赠送团扇1份',
//             'type': 106
//         }],
//         'address': '北京市朝阳区霄云路35号（6-5）45幢一层',
//         'authentic_id': 7311475536029920,
//         'description': ' 吉野家(霄云路店)',
//         'distance': 440,
//         'favored': false,
//         'float_delivery_fee': 7,
//         'float_minimum_order_amount': 0,
//         'id': 406820,
//         'image_path': '9da99e61b6978553324d485a70c67ebapng',
//         'is_new': false,
//         'is_premium': true,
//         'is_stock_empty': 0,
//         'is_valid': 1,
//         'latitude': 39.9571437226091,
//         'longitude': 116.462281230716,
//         'max_applied_quantity_per_order': -1,
//         'name': '吉野家(霄云路店)',
//         'next_business_time': '',
//         'only_use_poi': false,
//         'opening_hours': ['07:30/21:30'],
//         'order_lead_time': 45,
//         'phone': '4008197197',
//         'piecewise_agent_fee': {
//             'description': '配送费¥7',
//             'extra_fee': 0,
//             'is_extra': false,
//             'rules': [{'fee': 7, 'price': 0}],
//             'tips': '配送费¥7'
//         },
//         'promotion_info': '本店只提供电子发票，请您按照收银条指引自行开票，谢谢。',
//         'rating': 4.5,
//         'rating_count': 0,
//         'recent_order_num': 1576,
//         'recommend': {'is_ad': false, 'reason': ''},
//         'regular_customer_count': 0,
//         'status': 1,
//         'supports': [{
//             'description': '该商家支持开发票，请在下单时填写好发票抬头',
//             'icon_color': '999999',
//             'icon_name': '票',
//             'id': 4,
//             'name': '开发票'
//         }],
//         'type': 0
//     }, {
//         'activities': [{
//             'attribute': '20.0',
//             'description': '新用户下单立减20.0元',
//             'icon_color': '70bc46',
//             'icon_name': '首',
//             'id': 64005217,
//             'is_exclusive_with_food_activity': true,
//             'name': '新用户立减(不与其他活动共享)',
//             'tips': '新用户下单立减20.0元',
//             'type': 103
//         }, {
//             'attribute': '{"80": {"1": 33.0, "0": 0}, "25": {"1": 14.0, "0": 0}, "50": {"1": 23.0, "0": 0}}',
//             'description': '满25减14，满50减23，满80减33',
//             'icon_color': 'f07373',
//             'icon_name': '减',
//             'id': 356157226,
//             'is_exclusive_with_food_activity': true,
//             'name': '满减优惠',
//             'tips': '满25减14，满50减23，满80减33',
//             'type': 102
//         }, {
//             'attribute': '{"1.0": {"quantity": 1, "must_pay_online": 1, "name": "\\u996e\\u6599"}}',
//             'description': '满1.0元赠送饮料1份',
//             'icon_color': '3cc791',
//             'icon_name': '赠',
//             'id': 39190048,
//             'is_exclusive_with_food_activity': true,
//             'name': '满赠优惠',
//             'tips': '满1.0元赠送饮料1份',
//             'type': 106
//         }],
//         'address': '北京市朝阳区东三环北路甲2号8幢（京信大厦地下一层部分）',
//         'authentic_id': 1341435533158388,
//         'bidding': '{"core":{"index":17,"target":{"restaurantId":1051388,"weight":150,"probability":0.11500000208616257},"come_from":1,"next":{"restaurantId":156276037,"weight":200,"probability":0.0835999995470047}}}',
//         'description': '',
//         'distance': 406,
//         'favored': false,
//         'float_delivery_fee': 3,
//         'float_minimum_order_amount': 20,
//         'id': 1051388,
//         'image_path': 'bf28a8e6cf78b192379c42ce063b3f4ejpeg',
//         'is_new': false,
//         'is_premium': false,
//         'is_stock_empty': 0,
//         'is_valid': 1,
//         'latitude': 39.954608,
//         'longitude': 116.461128,
//         'max_applied_quantity_per_order': -1,
//         'name': '砂锅土豆粉',
//         'next_business_time': '',
//         'only_use_poi': false,
//         'opening_hours': ['09:00/21:00'],
//         'order_lead_time': 40,
//         'phone': '13693092402',
//         'piecewise_agent_fee': {
//             'description': '配送费¥3',
//             'extra_fee': 0,
//             'is_extra': false,
//             'rules': [{'fee': 3, 'price': 20}],
//             'tips': '配送费¥3'
//         },
//         'promotion_info': '',
//         'rating': 4.4,
//         'rating_count': 0,
//         'recent_order_num': 2094,
//         'recommend': {
//             'image_hash': '731111f3f9379e772eedf4855beae8a1jpeg',
//             'is_ad': true,
//             'reason': '广告',
//             'track': '{"rankType":"8"}'
//         },
//         'regular_customer_count': 0,
//         'status': 1,
//         'supports': [{
//             'description': '已加入“外卖保”计划，食品安全有保障',
//             'icon_color': '999999',
//             'icon_name': '保',
//             'id': 7,
//             'name': '外卖保'
//         }],
//         'type': 0
//     }, {
//         'activities': [{
//             'attribute': '19.0',
//             'description': '新用户下单立减19.0元',
//             'icon_color': '70bc46',
//             'icon_name': '首',
//             'id': 46025209,
//             'is_exclusive_with_food_activity': true,
//             'name': '新用户立减(不与其他活动共享)',
//             'tips': '新用户下单立减19.0元',
//             'type': 103
//         }, {
//             'attribute': '{"35": {"1": 14.0, "0": 0}, "20": {"1": 10.0, "0": 0}}',
//             'description': '满20减10，满35减14',
//             'icon_color': 'f07373',
//             'icon_name': '减',
//             'id': 53546921,
//             'is_exclusive_with_food_activity': true,
//             'name': '满减优惠',
//             'tips': '满20减10，满35减14',
//             'type': 102
//         }, {
//             'description': '合利屋五折套餐！',
//             'icon_color': 'f07373',
//             'icon_name': '折',
//             'id': 49260257,
//             'name': '合利屋五折套餐！',
//             'tips': '合利屋五折套餐！'
//         }, {
//             'description': '合利屋五折鸡肉套餐！',
//             'icon_color': 'f07373',
//             'icon_name': '折',
//             'id': 46819329,
//             'name': '合利屋五折鸡肉套餐！',
//             'tips': '合利屋五折鸡肉套餐！'
//         }, {
//             'description': '9.9鲜榨芒果汁！',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 46818241,
//             'name': '9.9鲜榨芒果汁！',
//             'tips': '9.9鲜榨芒果汁！'
//         }, {
//             'description': '19.9乌冬炒面！',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 46817433,
//             'name': '19.9乌冬炒面！',
//             'tips': '19.9乌冬炒面！'
//         }, {
//             'description': '6折超值套餐',
//             'icon_color': 'f07373',
//             'icon_name': '特',
//             'id': 38322842,
//             'name': '6折超值套餐',
//             'tips': '6折超值套餐'
//         }, {
//             'description': '经典优惠套餐',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 37333452,
//             'name': '经典优惠套餐',
//             'tips': '经典优惠套餐'
//         }, {
//             'description': '超值商务套餐',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 33583737,
//             'name': '超值商务套餐',
//             'tips': '超值商务套餐'
//         }],
//         'address': '北京市朝阳区霄云路26号BF103',
//         'authentic_id': 8391445512898450,
//         'description': '外卖种类： ①正餐②特色小吃③包饭系列④焗饭系列⑤铁板系列⑥沙拉⑦果饮 请您提前一个小时订餐！',
//         'distance': 521,
//         'favored': false,
//         'float_delivery_fee': 6,
//         'float_minimum_order_amount': 22,
//         'folding_restaurant_brand': '合利屋',
//         'folding_restaurants': [{'distance': 541, 'id': 18176, 'name': '合利屋（三元桥店）', 'order_lead_time': 58, 'type': 0}],
//         'id': 261050,
//         'image_path': 'e6fca29ff86dadef0818f6af2a86abe6png',
//         'is_new': false,
//         'is_premium': true,
//         'is_stock_empty': 0,
//         'is_valid': 1,
//         'latitude': 39.9589729174272,
//         'longitude': 116.466464108096,
//         'max_applied_quantity_per_order': -1,
//         'name': '合利屋（鹏润店）',
//         'next_business_time': '',
//         'only_use_poi': false,
//         'opening_hours': ['06:40/20:20'],
//         'order_lead_time': 48,
//         'phone': '84580699 84580799',
//         'piecewise_agent_fee': {
//             'description': '配送费¥6',
//             'extra_fee': 0,
//             'is_extra': false,
//             'rules': [{'fee': 6, 'price': 22}],
//             'tips': '配送费¥6'
//         },
//         'promotion_info': '应国家税务总局公告2017年第16号文件要求，自2017年7月1日起，购买方为企业的，索取增值税普通发票时，应向销售方提供纳税人识别号或统一社会信用代码。',
//         'rating': 4.6,
//         'rating_count': 0,
//         'recent_order_num': 1071,
//         'recommend': {'is_ad': false, 'reason': ''},
//         'regular_customer_count': 0,
//         'status': 1,
//         'supports': [{
//             'description': '该商家支持开发票，开票订单金额20.0元起，请在下单时填写好发票抬头',
//             'icon_color': '999999',
//             'icon_name': '票',
//             'id': 4,
//             'name': '开发票'
//         }],
//         'type': 0
//     }, {
//         'activities': [{
//             'attribute': '28.0',
//             'description': '新用户下单立减28.0元',
//             'icon_color': '70bc46',
//             'icon_name': '首',
//             'id': 46306441,
//             'is_exclusive_with_food_activity': true,
//             'name': '新用户立减(不与其他活动共享)',
//             'tips': '新用户下单立减28.0元',
//             'type': 103
//         }, {
//             'attribute': '{"80": {"1": 25.0, "0": 0}, "50": {"1": 20.0, "0": 0}, "20": {"1": 9.0, "0": 0}, "30": {"1": 12.0, "0": 0}}',
//             'description': '满20减9，满30减12，满50减20，满80减25',
//             'icon_color': 'f07373',
//             'icon_name': '减',
//             'id': 44517081,
//             'is_exclusive_with_food_activity': true,
//             'name': '满减优惠',
//             'tips': '满20减9，满30减12，满50减20，满80减25',
//             'type': 102
//         }, {
//             'description': '好多肉特价秒杀1',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 66323449,
//             'name': '好多肉特价秒杀1',
//             'tips': '好多肉特价秒杀1'
//         }, {
//             'description': '五折抢购',
//             'icon_color': 'f07373',
//             'icon_name': '特',
//             'id': 66061881,
//             'name': '五折抢购',
//             'tips': '五折抢购'
//         }, {
//             'description': '好多肉特价秒杀',
//             'icon_color': 'f1884f',
//             'icon_name': '特',
//             'id': 66053561,
//             'name': '好多肉特价秒杀',
//             'tips': '好多肉特价秒杀'
//         }],
//         'address': '北京市朝阳区顺源街3号院10号楼四层南侧1号',
//         'authentic_id': 5311415521814937,
//         'bidding': '{"core":{"index":19,"target":{"restaurantId":156276037,"weight":200,"probability":0.0835999995470047},"come_from":1,"next":{"restaurantId":1972136,"weight":180,"probability":0.0828000009059906}}}',
//         'delivery_mode': {
//             'color': '2395FF',
//             'gradient': {'rgb_from': '00AAFF', 'rgb_to': '0085FF'},
//             'id': 1,
//             'is_solid': true,
//             'text': '蜂鸟专送'
//         },
//         'description': '堡莱士/MADE TODay /生活轻一点/健康多一点/清凉夏天/堡你快乐！！！',
//         'distance': 811,
//         'favored': false,
//         'float_delivery_fee': 5,
//         'float_minimum_order_amount': 20,
//         'id': 156276037,
//         'image_path': '939e3ac21de73e9a1a05484e089f4575jpeg',
//         'is_new': false,
//         'is_premium': false,
//         'is_stock_empty': 0,
//         'is_valid': 1,
//         'latitude': 39.949949,
//         'longitude': 116.458236,
//         'max_applied_quantity_per_order': -1,
//         'name': '堡莱士炸鸡汉堡(三元桥店)',
//         'next_business_time': '',
//         'only_use_poi': false,
//         'opening_hours': ['09:00/21:50'],
//         'order_lead_time': 45,
//         'phone': '13001003827',
//         'piecewise_agent_fee': {
//             'description': '配送费¥5',
//             'extra_fee': 0,
//             'is_extra': false,
//             'rules': [{'fee': 5, 'price': 20}],
//             'tips': '配送费¥5'
//         },
//         'promotion_info': '亲，中午饿了么系统高峰期运力调控，自动提高配送费，满减活动取消，区域缩小，请错开高峰期下单，带来的不便敬请谅解哈！',
//         'rating': 4.7,
//         'rating_count': 0,
//         'recent_order_num': 1396,
//         'recommend': {
//             'image_hash': '731111f3f9379e772eedf4855beae8a1jpeg',
//             'is_ad': true,
//             'reason': '广告',
//             'track': '{"rankType":"8"}'
//         },
//         'regular_customer_count': 0,
//         'status': 1,
//         'supports': [{
//             'description': '已加入“外卖保”计划，食品安全有保障',
//             'icon_color': '999999',
//             'icon_name': '保',
//             'id': 7,
//             'name': '外卖保'
//         }, {
//             'description': '该商家支持开发票，开票订单金额60.0元起，请在下单时填写好发票抬头',
//             'icon_color': '999999',
//             'icon_name': '票',
//             'id': 4,
//             'name': '开发票'
//         }],
//         'type': 0
//     }];
//# sourceMappingURL=index.js.map