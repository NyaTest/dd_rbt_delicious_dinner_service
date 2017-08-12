/**
 * Created by iNahoo on 2017/8/11.
 */
import Koa = require('koa');
import menbersHandle = require('./members');
import {dinner, menu} from './dinners';

const loadService = (app: Koa) => {
    menbersHandle.load(app);
    dinner.load(app);
    menu.load(app);
};

export =loadService;