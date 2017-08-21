"use strict";
const menbersHandle = require("./members");
const dinners_1 = require("./dinners");
const loadService = (app) => {
    menbersHandle.load(app);
    dinners_1.dinner.load(app);
    dinners_1.menu.load(app);
    dinners_1.discounts.load(app);
};
module.exports = loadService;
//# sourceMappingURL=index.js.map