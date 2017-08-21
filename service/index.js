"use strict";
const menbersHandle = require("./members");
const dinners_1 = require("./dinners");
const test_1 = require("./test");
const loadService = (app) => {
    menbersHandle.load(app);
    dinners_1.dinner.load(app);
    dinners_1.menu.load(app);
    dinners_1.discounts.load(app);
    test_1.test.load(app);
};
module.exports = loadService;
//# sourceMappingURL=index.js.map