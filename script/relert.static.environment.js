/**********************************
 * relert.static.environment.js
 * relert.js 环境判断
 **********************************/

globalThis = this;

const __Environment = new function() {
    if (typeof __RelertStatic == 'function') {
        __RelertStatic.call(this);
    } else {
        require('./relert.static').call(this);
    }
    this.isNode = ((typeof window == 'undefined') || !(globalThis === window));
    this.isBrowser = ((typeof window == 'object') && (globalThis === window));
    this.exports = {
        isNode: this.isNode,
        isBrowser: this.isBrowser,
        version: 0.1,
    }
}

if ((typeof window == 'object') && (this === window)) {
    __Environment.mount(relert);
} else {
    module.exports = __Environment.mount;
}
