/**********************************
 * relert.execute.js
 * relert.js-browser 脚本执行沙箱
 * 此模块为浏览器端独有
 **********************************/

const sandbox = new function() {
    this.execute = (script, scriptName) => {
        (function() {
            'use strict';
            let window = undefined;
            let document = undefined;
            let timeline = undefined;
            let editor = undefined;
            let sandbox = undefined;
            let $ = undefined;
            relert.tickProcess(() => {
                try {
                    eval(`${script}
                    \/\/# sourceURL=${scriptName}`);
                } catch (err) {
                    let errorStack = String(err.stack);
                    errorStack = errorStack.substring(0, errorStack.indexOf('sandbox'));
                    errorStack = errorStack.substring(0, errorStack.lastIndexOf('\n'));
                    relert.error(`${err.message} - ${errorStack}`);
                    throw(err);
                }
            });
        })();
    }
}
