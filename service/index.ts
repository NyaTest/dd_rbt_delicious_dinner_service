/**
 * Created by iNahoo on 2017/8/11.
 */
import Koa = require('koa');
import menbersHandle = require('./members');
import {dinner, menu, discounts} from './dinners';
import {test} from './test';

const loadService = (app: Koa) => {
    menbersHandle.load(app);
    dinner.load(app);
    menu.load(app);
    discounts.load(app);

    test.load(app);
};

export = loadService;