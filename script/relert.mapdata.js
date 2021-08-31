/**********************************
 * relert.mapdata.js
 * relert.js 地图数据基类
 **********************************/

 const __RelertMapData = function() {
    // 入口
    this.entrance = '';
    // 挂载点
    this.mount = (parent) => {
        this.parent = parent;
        Object.defineProperty(parent, this.entrance, {
            get: () => {
                return this.proxy;
            },
            set: () => {
                throw new Error(`TypeError: Assignment to constant property 'relert.${func}'.`);
            },
        });
    }
    // 主代理
    this.proxy = new Proxy({}, {
        apply: (obj, target, args) => {
            let data = this.unpack();
            if (typeof args[0] == 'function') {
                data = args[0](data);
            }
            this.pack(data);
        }
    });

    // 打包解包函数
    this.unpack = () => {
        return 0;
    }

    this.pack = () => {

    }
}

// 导出
if ((typeof window == 'undefined') || !(this === window)) {
    module.exports = __RelertMapData;
}
