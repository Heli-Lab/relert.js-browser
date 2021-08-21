 /**********************************
  * relert.js
  * relert.js-browser 入口点
  **********************************/

globalThis = this;

const __Relert = function() {

    this.INI = {};

    let isNode = ((typeof window == 'undefined') || !(globalThis === window));
    let isBrowser = ((typeof window == 'object') && (globalThis === window));
    let jsFolder = 'script';

    // 动态加载模块
    let __loadModule = (path, callback) => {
        if (!path) {
            return;
        }
        if (isBrowser) {
            var scriptDOM = document.createElement('script');
            scriptDOM.type = 'text/javascript';
            scriptDOM.src = './' + jsFolder + '/' + path + '.js';
            scriptDOM.onload = () => {
                if (typeof callback == 'function') {
                    callback();
                }
            }
            document.getElementsByTagName('body')[0].appendChild(scriptDOM); 
        }
        if (isNode) {
            require('./' + path + '.js')(this);
            if (typeof callback == 'function') {
                callback();
            }
        }
    }

    // 确保加载的顺序
    let __loadModules = () => {
        if (enabled_modules.length > 0) {
            __loadModule(enabled_modules.shift(), __loadModules);
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
        'relert.static.toolbox',

        'relert.object',
        'relert.object.structure',
        'relert.object.infantry',
        'relert.object.unit',
        'relert.object.aircraft',
        'relert.object.smudge',
        'relert.object.terrain',
        'relert.object.celltag',

    ];

    // 浏览器端额外的模块
    if (isBrowser) {
        enabled_modules.push('relert.timeline');
        enabled_modules.push('relert.editor');
        enabled_modules.push('relert.sandbox');
    }

    // 加载模块
    __loadModules();
}

if ((typeof window == 'undefined') || !(this === window)) {
    module.exports = () => {
        return new __Relert();
    }
} else {
    relert = new __Relert();
}
