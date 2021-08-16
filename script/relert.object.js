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
            getData: () => {
                return this.parent.INI[this.register][index];
            },
            setData: (data) => {
                this.parent.INI[this.register][index] = data;
            }
        }, {
            get: (obj, key) => {
                if (this.parameters.indexOf(key) >= 0) {
                    return obj.getData().split(',')[this.parameters.indexOf(key)];
                } else if (key == '$register') {
                    return this.register;
                }
            },
            set: (obj, key, value) => {
                if (this.parameters.indexOf(key) >= 0) {
                    let params = obj.getData().split(',');
                    params[this.parameters.indexOf(key)] = value;
                    obj.setData(params.join(','));
                    return true;
                }
            }
        });
    }

    this.forEach = (callback) => {
        for (index in this.parent.INI[this.register]) {
            callback(this.getInterface(index), index);
        }
    }

    this[Symbol.iterator] = function*() {
        for (index in this.parent.INI[this.register]) {
            yield this.getInterface(index);
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
        }
    }

    this.delete = (judge) => {
        if (typeof judge == 'function') {
            this.forEach((item) => {
                if (judge(item)) {
                    item.delete();
                }
            })
        } else if (typeof judge == 'object') {
            this.forEach((item) => {

            })
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
