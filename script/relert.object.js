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
                return obj.parent.INI[obj.register].length;
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
    })

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
        return new Proxy({
            regKey: index.toString(),
        }, {
            get: (obj, key) => {
                if (this.parameters.indexOf(key) >= 0) {
                    if (this.parent.INI[this.register][obj.regKey]) {
                        return this.parent.INI[this.register][obj.regKey].split(',')[this.parameters.indexOf(key)];
                    }
                } else if (key == '$register') {
                    return this.register;
                } else if (key == 'delete') {
                    return () => {
                        delete this.parent.INI[this.register][obj.regKey];
                        if (this.arrayLike) {
                            this.parent.INI[this.register].splice(obj.regKey, 1);
                        }
                    }
                } else if (!(this.arrayLike)) {
                    if (key == 'X') {
                        return obj.regKey.substring(obj.regKey.length - 3).replace(/\b(0+)/gi, '');
                    } else if (key == 'Y') {
                        return obj.regKey.substring(0, obj.regKey.length - 3).replace(/\b(0+)/gi, '');
                    }
                }
            },
            set: (obj, key, value) => {
                if (this.parameters.indexOf(key) >= 0) {
                    let params = this.parent.INI[this.register][obj.regKey].split(',');
                    params[this.parameters.indexOf(key)] = value;
                    this.parent.INI[this.register][obj.regKey] = params.join(',');
                    return true;
                } else if (!(this.arrayLike)) {
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
        });
    }

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

    this.add = (obj) => {
        if (this.arrayLike) {
            let params = [];
            this.parameters.forEach((key) => {
                if (obj[key]) {
                    params.push(obj[key]);
                } else {
                    params.push(this.defaults[key])
                }
            });
            this.parent.INI[this.register].push(params.join(','));
        } else {
            let x = obj.X ? obj.X : 0;
            let y = obj.Y ? obj.Y : 0;
            let params = [];
            this.parameters.forEach((key) => {
                if (obj[key]) {
                    params.push(obj[key]);
                } else {
                    params.push(this.defaults[key])
                }
            });
            this.parent.INI[this.register][y.toString() + x.toString().padStart(3, '0')] = params.join(',');
        }
    }

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
