/**
 * Created by iNahoo on 2017/8/18.
 */

const fs = require('fs');
const {resolve} = require('path');
const noop = () => {
};

class Logger {

    private path = resolve(__dirname, './.log');

    constructor() {
        if (fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, '', 'utf-8');
        }
    }

    private append(text) {
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

