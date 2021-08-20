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
                    let errorMessage = (err) => {
                        let stack = ErrorStackParser.parse(err);
                        let msg = err.message;
                        let evalBegin = false;
                        for (let i in stack) {
                            if ((stack[i].functionName == 'eval') || (stack[i].fileName == scriptName)) {
                                if (!evalBegin) {
                                    evalBegin = true;
                                }
                                msg += `\n        at ${scriptName} (row ${stack[i].lineNumber}, col ${stack[i].columnNumber})`;
                            } else {
                                if (evalBegin) {
                                    break;
                                }
                                msg += `\n        at ${stack[i].fileName} - ${stack[i].functionName} (row ${stack[i].lineNumber}, col ${stack[i].columnNumber})`;
                            }
                        }
                        return msg;
                    }
                    relert.error(errorMessage(err));
                    throw(err);
                }
            });
        })();
    }
}
