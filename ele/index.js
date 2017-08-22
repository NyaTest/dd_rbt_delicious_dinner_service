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
        this.getRecommend = async function (limit = 30) {
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
    getRequestData(offset = 0, limit = 50) {
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
//# sourceMappingURL=index.js.map