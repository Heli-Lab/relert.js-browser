/**********************************
 * relert.register.js
 * relert.js 注册表基类
 **********************************/

 const __RelertRegister = function() {
    this.entrance = '';
    this.register = '';
    this.defaults = {};
    this.exports = ['parameters', 'entrance', 'forEach', 'add', 'delete', 'empty', Symbol.iterator];
    this.parent = undefined;

    this.checkArray = () => {
        if (this.parent.INI[this.register] == undefined) {
            this.parent.INI[this.register] = [];
        } else if (typeof this.parent.INI[this.register] == 'object') {
            this.parent.INI[this.register] = Object.values(this.parent.INI[this.register])
        }
    }
    
    // 主代理
    this.proxy = new Proxy(this, {
        has: (obj, key) => {
            if (obj.parent.INI[obj.register][key]) {
                return true;
            }
        },
        get: (obj, key) => {
            this.checkArray();
            if (this.exports.indexOf(key) >= 0) {
                return obj[key];
            } else if (['length', 'count'].indexOf(key) >= 0) {
                if (this.arrayLike) {
                    return obj.parent.INI[obj.register].length;
                } else {
                    return Object.keys(obj.parent.INI[obj.register]).length;
                }
            } else if (obj.parent.INI[obj.register][key]) {
                return obj.getInterface(key);
            }
        },
        deleteProperty: (obj, key) => {
            if (obj.parent.INI[obj.register][key]) {
                obj.getInterface(key).delete();
                return true;
            }
        },
        set: (obj, key, value) => {
            throw new Error(`TypeError: Assignment to constant property 'relert.${this.entrance}.${key}'.`);
        },
        ownKeys: (obj) => {
            return Object.keys(obj.parent.INI[obj.register]);
        },
    });

    // 挂载函数
    this.mount = (parent) => {
        if (parent) {
            this.parent = parent;
            this.checkArray();
            Object.defineProperty(this.parent, this.entrance, {
                get: () => {
                    return this.proxy;
                },
                set: (value) => {
                    throw new Error(`TypeError: Assignment to constant property 'relert.${this.entrance}'.`);
                }
            })
        }
    }

    this.getInterface = (index) => {
        return this.parent.INI[this.parent.INI[this.register][index]];
    }

    // 新增
    this.add = (obj) => {
        // Todo
    }

    // 批量删除
    this.delete = (judge) => {
        // Todo
    }

    // 置空
    this.empty = () => {
        // Todo
    }
}

// 导出
if ((typeof window == 'undefined') || !(this === window)) {
    module.exports = __RelertRegister;
}
