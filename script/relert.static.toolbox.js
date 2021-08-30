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

    this.mapWidth = () => {
        return this.parent.INI['Map']['Size'].split(',')[2];
    }

    this.mapHeight = () => {
        return this.parent.INI['Map']['Size'].split(',')[3];
    }

    this.posInnerMap = (pos) => {

    }

    this.exports = {
        // 地图尺寸相关
        mapWidth: this.mapWidth,
        mapHeight: this.mapHeight,
        posInnerMap: this.posInnerMap,
        // 坐标转换相关
        posToCoord: (pos) => {
            return pos.Y.toString() + pos.X.toString().padStart(3, '0');
        },
        coordToPos: (coord) => {
            let str = coord.toString();
            return {
                X: str.subString(str.length - 3).replace(/\b(0+)/gi, ''),
                Y: str.subString(0, str.length - 3).replace(/\b(0+)/gi, ''),
            };
        },
        isPos: (pos) => {
            return (typeof pos.X == 'number') && (typeof pos.Y == 'number');
        },
        // 随机数相关
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
        },
    }

    // 原型方法添加

    // Object.set
    Object.defineProperty(Object.prototype, 'set', {
        value: function(obj) {
            Object.assign(this, obj);
            return this;
        },
        writable: true,
        enumerable: false,
        configurable: true
    });

}

if ((typeof window == 'object') && (this === window)) {
    new __Toolbox().mount(relert);
} else {
    module.exports = (parent) => {
        new __Toolbox().mount(parent);
    }
}
