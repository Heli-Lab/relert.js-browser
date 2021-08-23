/**********************************
 * relert.init.js
 * relert.js 地图初始化工具
 **********************************/

 const __Init = function() {
    if (typeof __RelertStatic == 'function') {
        __RelertStatic.call(this);
    } else {
        require('./relert.static').call(this);
    }

    let initParams = {

    }

    let combineObj = (obj1, obj2) => {
        for (let key in obj2) {
            if (!(obj1[key])) {
                obj1[key] = obj2[key];
            } else {
                if (typeof obj2[key] == 'object') {
                    combineObj(obj1[key], obj2[key]);
                }
            }
        }
    }

    this.init = () => {
        combineObj(this.parent.INI, initParams);
    }

    this.exports = {
        init: this.init,
    }
}

if ((typeof window == 'object') && (this === window)) {
    new __Init().mount(relert);
} else {
    module.exports = (parent) => {
        new __Init().mount(parent);
    }
}
