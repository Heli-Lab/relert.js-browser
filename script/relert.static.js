/**********************************
 * relert.static.js
 * relert.js 静态方法导出基类
 **********************************/

const __RelertStatic = function() {
    // 导出的函数
    this.exports = {};
    // 挂载后行为
    this.mounted = null;
    // 挂载点
    this.mount = (parent, mounted = this.mounted) => {
        this.parent = parent;
        for (let func in this.exports) {
            Object.defineProperty(parent, func, {
                get: () => {
                    return this.exports[func];
                },
                set: () => {
                    throw new Error(`TypeError: Assignment to constant property 'relert.${func}'.`);
                },
            });
        }
        if (typeof mounted == 'function') {
            mounted.call();
        }
    }
}

// 导出
if ((typeof window == 'undefined') || !(this === window)) {
    module.exports = __RelertStatic;
}
