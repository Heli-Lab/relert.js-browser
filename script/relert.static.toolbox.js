/**********************************
 * relert.toolbox.js
 * relert.js 静态函数工具箱
 **********************************/

const __Toolbox = function() {
    if (typeof __RelertStatic == 'function') {
        __RelertStatic.call(this);
    } else {
        require('./relert.static').call(this);
    }
    this.exports = {
        randomFacing: () => {
            return Math.trunc(Math.random() * 8) * 32;
        },
        randomStrength: (a, b) => {
            Math.trunc(255 * (a + Math.random() * (b - a)))
        },
        randomBetween: (a, b) => {
            return Math.trunc(a + Math.random() * (b - a));
        },
        randomSelect: (list) => {
            return list[Math.trunc(Math.random() * list.length)];
        }
    }
}

if ((typeof window == 'object') && (this === window)) {
    new __Toolbox().mount(relert);
} else {
    module.exports = (parent) => {
        new __Toolbox().mount(parent);
    }
}
