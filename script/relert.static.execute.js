/**********************************
 * relert.execute.js
 * relert.js-browser 脚本执行沙箱
 * 此模块为浏览器端独有
 **********************************/

 const __Execute = new function() {
    if (typeof __RelertStatic == 'function') {
        __RelertStatic.call(this);
    } else {
        require('./relert.static').call(this);
    }
    this.exports = {
        execute: (script) => {
            window.eval(`
                (function() {
                    'use strict';
                    let window = undefined;
                    let document = undefined;
                    let timeline = undefined;
                    let editor = undefined;
                    let $ = undefined;
                    relert.tickProcess(() => {
                        try {
                            ${script}
                        } catch (err) {
                            relert.error(err);
                            throw(err);
                        }
                    });
                })();
            `);
        }
    }
}

if ((typeof window == 'object') && (this === window)) {
    __Execute.mount(relert);
} else {
    module.exports = __Execute.mount;
}
