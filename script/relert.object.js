/**********************************
 * relert.object.js
 * relert.js Object基类
 **********************************/

const __RelertObject = function() {
    this.entrance = '';
    this.register = '';
    this.parameters = [];
    this.defaults = {};
    this.exports = ['parameters', 'entrance', 'forEach', 'add', 'delete', 'empty', Symbol.iterator];
    this.parent = undefined;

    // 数组类型or坐标类型
    this.arrayLike = false;
    this.checkArray = () => {
        if (this.parent.INI[this.register] == undefined) {
            this.parent.INI[this.register] = {};
        }
        if (this.arrayLike) {
            if (typeof this.parent.INI[this.register] == 'object') {
                this.parent.INI[this.register] = Object.values(this.parent.INI[this.register])
            }
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

    // 子代理
    this.getInterface = (index) => {
        return new Proxy({
            regKey: index.toString(),
        }, {
            get: (obj, key) => {
                if (this.parameters.includes(key)) { // parameters中定义的参数
                    if (this.parent.INI[this.register][obj.regKey]) {
                        return this.parent.INI[this.register][obj.regKey].split(',')[this.parameters.indexOf(key)];
                    }
                } else if (key == '$register') { // 注册表
                    return this.register;
                } else if (key == 'delete') { // 删除方法
                    return () => {
                        delete this.parent.INI[this.register][obj.regKey];
                        if (this.arrayLike) {
                            this.parent.INI[this.register].splice(obj.regKey, 1);
                        }
                    }
                } else if (key == 'set') { // set方法：同时修改多条属性
                    return (newObj) => {
                        let params = [];
                        let oldParams = this.parent.INI[this.register][obj.regKey].split(',');
                        for (let i in this.parameters) {
                            if (newObj[this.parameters[i]]) {
                                params.push(newObj[this.parameters[i]]);
                            } else {
                                params.push(oldParams[i]);
                            }
                        }
                        if (!this.arrayLike) {
                            let oldRegKey = obj.regKey;
                            let x = newObj.X ? newObj.X : oldRegKey.substring(oldRegKey.length - 3);
                            let y = newObj.Y ? newObj.Y : oldRegKey.substring(0, oldRegKey.length - 3);
                            obj.regKey = y.toString() + x.toString().padStart(3, '0');
                            if (!(obj.regKey == oldRegKey)) {
                                delete this.parent.INI[this.register][oldRegKey];
                            }
                        }
                        this.parent.INI[this.register][obj.regKey] = params.join(',');
                        return this.getInterface(obj.regKey);
                    }
                } else if (!(this.arrayLike)) { // 坐标注册元素额外的X、Y属性
                    if (key == 'X') {
                        return obj.regKey.substring(obj.regKey.length - 3).replace(/\b(0+)/gi, '');
                    } else if (key == 'Y') {
                        return obj.regKey.substring(0, obj.regKey.length - 3).replace(/\b(0+)/gi, '');
                    }
                }
            },
            set: (obj, key, value) => {
                if (this.parameters.includes(key)) { // parameters中定义的参数
                    let params = this.parent.INI[this.register][obj.regKey].split(',');
                    params[this.parameters.indexOf(key)] = value;
                    this.parent.INI[this.register][obj.regKey] = params.join(',');
                    return true;
                } else if (!(this.arrayLike)) { // 坐标注册元素额外的X、Y属性
                    if (key == 'X') {
                        let oldData = this.parent.INI[this.register][obj.regKey];
                        let oldRegKey = obj.regKey;
                        delete this.parent.INI[this.register][oldRegKey];
                        obj.regKey = oldRegKey.substring(0, oldRegKey.length - 3) + value.toString().padStart(3, '0');
                        this.parent.INI[this.register][obj.regKey] = oldData;
                        return true;
                    } else if (key == 'Y') {
                        let oldData = this.parent.INI[this.register][obj.regKey];
                        let oldRegKey = obj.regKey;
                        delete this.parent.INI[this.register][oldRegKey];
                        obj.regKey = value.toString() + oldRegKey.substring(oldRegKey.length - 3);
                        this.parent.INI[this.register][obj.regKey] = oldData;
                        return true;
                    }
                }
            },
            ownKeys: (obj) => {
                if (this.arrayLike) {
                    return this.parameters;
                } else {
                    return this.parameters.concat(['X', 'Y']);
                }
            },
            has: (obj, key) => {
                if (this.parameters.includes(key)) {
                    return true;
                } else if (this.arrayLike) {
                    if (['X', 'Y'].includes(key)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        });
    }

    // forEach迭代器
    this.forEach = (callback) => {
        let lastItem = null;
        for (index in this.parent.INI[this.register]) {
            if (this.arrayLike) {
                do {
                    lastItem = this.parent.INI[this.register][index];
                    callback(this.getInterface(index), index);
                } while (!(lastItem == this.parent.INI[this.register][index]));
            } else {
                callback(this.getInterface(index), index);
            }
        }
    }

    // for ... of Iterator迭代器
    this[Symbol.iterator] = function*() {
        let lastItem = null;
        for (index in this.parent.INI[this.register]) {
            if (this.arrayLike) {
                do {
                    lastItem = this.parent.INI[this.register][index];
                    yield this.getInterface(index);
                } while (!(lastItem == this.parent.INI[this.register][index]));
            } else {
                yield this.getInterface(index);
            }
        }
    }.bind(this);

    // 新增
    this.add = (obj) => {
        if (this.arrayLike) {
            let params = [];
            this.parameters.forEach((key) => {
                if (obj[key]) {
                    params.push(obj[key]);
                } else {
                    params.push(this.defaults[key]);
                }
            });
            return this.getInterface(this.parent.INI[this.register].push(params.join(',')) - 1);
        } else {
            let x = obj.X ? obj.X : 0;
            let y = obj.Y ? obj.Y : 0;
            let params = [];
            let regKey = y.toString() + x.toString().padStart(3, '0');
            this.parameters.forEach((key) => {
                if (obj[key]) {
                    params.push(obj[key]);
                } else {
                    params.push(this.defaults[key])
                }
            });
            this.parent.INI[this.register][regKey] = params.join(',');
            return this.getInterface(regKey);
        }
    }

    // 批量删除
    this.delete = (judge) => {
        if (typeof judge == 'function') {
            this.forEach((item) => {
                if (judge(item)) {
                    item.delete();
                }
            });
        } else if (typeof judge == 'object') {
            this.forEach((item) => {
                for (let key in judge) {
                    if (item[key] != judge[key]) {
                        return;
                    }
                    item.delete();
                }
            });
        }
    }

    // 置空
    this.empty = () => {
        if (this.arrayLike) {
            this.parent.INI[this.register] = [];
        } else {
            this.parent.INI[this.register] = {};
        }
    }
}

if ((typeof window == 'undefined') || !(this === window)) {
    module.exports = __RelertObject;
}
