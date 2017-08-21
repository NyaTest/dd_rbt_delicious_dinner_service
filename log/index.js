"use strict";
/**
 * Created by iNahoo on 2017/8/18.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path_1 = require("path");
const noop = () => {
};
class Logger {
    constructor() {
        this.path = path_1.resolve(__dirname, './.log');
        if (fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, '', 'utf-8');
        }
    }
    append(text) {
        fs.appendFile(this.path, text, noop);
    }
    log(...arg) {
        let text = '\n';
        arg.forEach(o => {
        });
        text += '\n';
        this.append(text);
    }
}
//# sourceMappingURL=index.js.map