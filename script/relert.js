 /**********************************
  * relert.js
  * relert.js-browser 入口点
  **********************************/

globalThis = this;

const relert = new function() {

    this.INI = {};

    let isNode = ((typeof window == 'undefined') || !(globalThis === window));
    let isBrowser = ((typeof window == 'object') && (globalThis === window));
    let jsFolder = 'script';

    // 动态加载模块
    let __loadModule = (path) => {
        if (isBrowser) {
            var scriptDOM = document.createElement('script');
            scriptDOM.type = 'text/javascript';
            scriptDOM.src = './' + jsFolder + '/' + path + '.js';
            document.getElementsByTagName('body')[0].appendChild(scriptDOM); 
        }
        if (isNode) {
            require('./' + path + '.js')(this);
        }
    }

    // 可用的模块
    let enabled_modules = [
        'relert.tick',

        'relert.static',

        'relert.static.environment',
        'relert.static.gb2312',
        'relert.static.log',
        'relert.static.filesys',
        'relert.static.execute',
        'relert.static.toolbox',

        'relert.object',
        'relert.object.structure',
        'relert.object.infantry',
        'relert.object.unit',
        'relert.object.aircraft',

    ];

    // 浏览器端额外的模块
    if (isBrowser) {
        enabled_modules.push('relert.timeline');
        enabled_modules.push('relert.editor');
    }

    // 加载模块
    enabled_modules.forEach((relert_module) => {
        __loadModule(relert_module);
    });
}

if ((typeof window == 'undefined') || !(this === window)) {
    module.exports = relert;
}

