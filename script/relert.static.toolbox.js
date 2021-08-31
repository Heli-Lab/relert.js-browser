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
        return parseInt(this.parent.INI['Map']['Size'].split(',')[2]);
    }

    this.mapHeight = () => {
        return parseInt(this.parent.INI['Map']['Size'].split(',')[3]);
    }

    this.posInnerMap = (pos) => {
        let width = this.mapWidth();
        let height = this.mapHeight();
        let x = parseInt(pos.X);
        let y = parseInt(pos.Y);
        return ((x + y) > width) && ((x + y) <= (width + height * 2)) && ((x - y) < width) && ((y - x) < width);
    }

    this.exports = {
        // 坐标转换相关
        posToCoord: (pos) => {
            return pos.Y.toString() + pos.X.toString().padStart(3, '0');
        },
        coordToPos: (coord) => {
            let str = coord.toString();
            return {
                X: parseInt(str.subString(str.length - 3).replace(/\b(0+)/gi, '')),
                Y: parseInt(str.subString(0, str.length - 3).replace(/\b(0+)/gi, '')),
            };
        },
        isPos: (pos) => {
            return (typeof pos.X == 'number') && (typeof pos.Y == 'number');
        },
        // 地图尺寸相关
        mapWidth: this.mapWidth,
        mapHeight: this.mapHeight,
        posInnerMap: this.posInnerMap,
        // 几何相关、
        posInnerCircle: (pos, center, r) => {
            return (Math.hypot(parseInt(pos.X) - parseInt(center.X), parseInt(pos.Y) - parseInt(center.Y)) < r);
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

    // Object.assign
    Object.defineProperty(Object.prototype, 'assign', {
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
