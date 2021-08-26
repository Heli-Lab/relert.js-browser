/**********************************
 * relert.register.js
 * relert.js 注册表基类
 **********************************/

 const __RelertRegister = function(reg = '', def = {}) {
    this.entrance = reg;
    this.register = reg;
    this.defaults = def;
    this.exports = ['parameters', 'entrance', 'forEach', 'add', 'delete', 'empty', 'includes', Symbol.iterator];
    this.parent = undefined;
    this.addName = false;

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
            if (this.exports.includes(key)) {
                return obj[key];
            } else if (['length', 'count'].includes(key)) {
                if (this.arrayLike) {
                    return obj.parent.INI[obj.register].length;
                } else {
                    return Object.keys(obj.parent.INI[obj.register]).length;
                }
            } else if (obj.parent.INI[obj.register][key]) {
                return obj.getInterface(key);
            } else if (obj.parent.INI[obj.register].includes(key)) {
                return obj.getInterface(obj.parent.INI[obj.register].indexOf(key));
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
        return {
            Name: this.parent.INI[this.register][index],
            INI: this.parent.INI[this.parent.INI[this.register][index]],
        };
    }

    // forEach迭代器
    this.forEach = (callback) => {
        let lastItem = null;
        for (index in this.parent.INI[this.register]) {
            do {
                lastItem = this.parent.INI[this.register][index];
                callback(this.getInterface(index), index);
            } while (!(lastItem == this.parent.INI[this.register][index]));
        }
    }

    // for ... of Iterator迭代器
    this[Symbol.iterator] = function*() {
        let lastItem = null;
        for (index in this.parent.INI[this.register]) {
            do {
                lastItem = this.parent.INI[this.register][index];
                yield this.getInterface(index);
            } while (!(lastItem == this.parent.INI[this.register][index]));
        }
    }.bind(this);

    // 新增
    this.add = (obj) => {
        if (!obj.Name) {
            throw new Error(`relert.${this.entrance}.add Error - Parameter not found: Name`);
        }
        let index = this.parent.INI[this.register].push(obj.Name);
        if (!this.parent.INI[obj.Name]) {
            this.parent.INI[obj.Name] = {};
        }
        for (let i in obj.INI) {
            this.parent.INI[obj.Name][i] = obj.INI[i];
        }
        if (this.addName) {
            this.parent.INI[obj.Name]['Name'] = obj.Name;
        }
        for (let i in this.defaults) {
            if (!this.parent.INI[obj.Name][i]) {
                this.parent.INI[obj.Name][i] = this.defaults[i];
            }
        }
        return this.getInterface(index - 1);
    }

    // 判断是否有注册
    this.includes = (key) => {
        return obj.parent.INI[obj.register].includes(key);
    }

    // 批量删除
    this.delete = (judge) => {
        if (typeof judge == 'function') {
            this.forEach((item, index) => {
                if (judge(item)) {
                    delete this.parent.INI[item.Name];
                    this.parent.INI[this.register].splice(index, 1);
                }
            });
        } else if (typeof judge == 'object') {
            this.forEach((item, index) => {
                for (let key in judge) {
                    if (item[key] != judge[key]) {
                        return;
                    }
                    delete this.parent.INI[item.Name];
                    this.parent.INI[this.register].splice(index, 1);
                }
            });
        }
    }

    // 置空
    this.empty = () => {
        this.forEach((item) => {
            delete item.INI;
        });
        this.parent.INI[this.register] = [];
    }
}

// 导出
if ((typeof window == 'undefined') || !(this === window)) {
    module.exports = __RelertRegister;
}
