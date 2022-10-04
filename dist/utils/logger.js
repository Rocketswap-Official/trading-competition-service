"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
var clc = require('cli-color');
var conf = {
    filters: {
        log: clc.green.bgBlack,
        trace: clc.magenta,
        debug: clc.cyan,
        info: clc.green,
        warn: clc.xterm(202).bgXterm(236),
        error: clc.red.bold
    },
    format: [
        '{{timestamp}} <{{title}}> [{{file}}:{{line}}] {{message}}',
        {
            error: '{{timestamp}} ({{file}}:{{line}}) <{{title}}> {{message}}\nCall Stack:\n{{stack}}'
        }
    ],
    dateformat: 'HH:MM:ss',
    preprocess: function (data) {
        data.title = data.title.toUpperCase();
        data.method = data.method.toUpperCase();
    },
    inspectOpts: { color: true }
};
exports.log = require('tracer').colorConsole(conf);
//# sourceMappingURL=logger.js.map