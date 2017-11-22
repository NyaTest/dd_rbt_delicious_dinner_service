"use strict";

const fs = require('fs');
const {resolve} = require('path');


const logger = {
    path: resolve(__dirname, './logs'),
    init() {
        fs.writeFileSync(this.path, '', 'utf-8');
    },
    log(str) {
        fs.appendFileSync(this.path, str + '\n', 'utf-8');
    }
};

const content = fs.readFileSync(resolve(__dirname, './content'), 'utf-8').split('\n');

const source = fs.readFileSync(resolve(__dirname, './rohr.js'), 'utf-8');

const be = source

    .replace(/a\[(\d+)]/g, function (str, i) {
        logger.log(`${str} => ${content[Number(i)]}`);
        return `${content[Number(i)]}`;
    })

    .replace(/"use strict"/g, '')

    .replace(/\["([^"\]]+)"]/g, function (str, i) {
        logger.log(`${str} => .${i}`);
        return `.${i}`;
    });

fs.writeFileSync(resolve(__dirname, './rohr.be.js'), be, 'utf-8');