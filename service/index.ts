/**
 * Created by iNahoo on 2017/8/11.
 */
import Koa = require('koa');
import menbersHandle = require('./members');

const loadService = (app: Koa) => {
    menbersHandle.load(app);
};

export =loadService;