/**********************************
 * relert.object.waypoint.js
 * relert.js 路径点代理层
 **********************************/

 const __Waypoint = function() {
    if (typeof __RelertObject == 'function') {
        __RelertObject.call(this);
    } else {
        require('./relert.object').call(this);
    }

    let MAX_WAYPOINT = 701;
    this.newNumber = () => {
        for (let i = 0; i <= MAX_WAYPOINT; i++) {
            if (!this.parent.INI[this.register][i]) {
                return i;
            }
        }
        return null;
    }
    this.entrance = 'Waypoint';
    this.register = 'Waypoints';
    this.parameters = [
        'Number',
        'X',
        'Y',
    ]
    this.defaults = {
        'Number': 0,
        'X': 0,
        'Y': 0,
    };
    this.arrayLike = false;

    // 子代理
    this.getInterface = (index) => {
        return new Proxy({
            regKey: index.toString(),
        }, {
            get: (obj, key) => {
                if (key == 'Number') { // 路径点的Number属性
                    return obj.regKey;
                } else if (key == '$register') { // 注册表
                    return this.register;
                } else if (key == 'delete') { // 删除方法
                    return () => {
                        delete this.parent.INI[this.register][obj.regKey];
                    }
                } else if (key == 'set') { // set方法：同时修改多条属性
                    return (newObj) => {
                        let oldData = this.parent.INI[this.register][obj.regKey];
                        let x = newObj.X ? newObj.X : oldData.substring(oldData.length - 3);
                        let y = newObj.Y ? newObj.Y : oldData.substring(0, oldData.length - 3);
                        let newData = y.toString() + x.toString().padStart(3, '0');
                        if (newObj.Number) {
                            delete this.parent.INI[this.register][obj.regKey];
                            obj.regKey = newObj.Number.toString();
                        }
                        this.parent.INI[this.register][obj.regKey] = newData;
                        return this.getInterface(obj.regKey);
                    }
                } else {
                    let value = this.parent.INI[this.register][obj.regKey];
                    if (key == 'X') {
                        return value.substring(value.length - 3).replace(/\b(0+)/gi, '');
                    } else if (key == 'Y') {
                        return value.substring(0, value.length - 3).replace(/\b(0+)/gi, '');
                    }
                }
            },
            set: (obj, key, value) => {
                if (key == 'Number') {
                    let oldRegKey = obj.regKey;
                    obj.regKey = value;
                    this.parent.INI[this.register][obj.regKey] = this.parent.INI[this.register][oldRegKey];
                    delete this.parent.INI[this.register][oldRegKey];
                    return true;
                } else {
                    let oldData = this.parent.INI[this.register][obj.regKey].toString();
                    if (key == 'X') {
                        this.parent.INI[this.register][obj.regKey] = oldData.substring(0, oldData.length - 3) + value.toString().padStart(3, '0');
                        return true;
                    } else if (key == 'Y') {
                        this.parent.INI[this.register][obj.regKey] = value.toString().padStart(3, '0') + oldData.substring(oldData.length - 3);
                        return true;
                    }
                }
            },
        });
    }

    // 新增
    this.add = (obj) => {
        let x = obj.X ? obj.X : this.defaults['X'];
        let y = obj.Y ? obj.Y : this.defaults['Y'];
        let data = y.toString() + x.toString().padStart(3, '0');
        let number = obj.Number ? obj.Number : this.newNumber();
        this.parent.INI[this.register][number] = data;
        return this.getInterface(number);
    }
}

if ((typeof window == 'object') && (this === window)) {
    new __Waypoint().mount(relert);
} else {
    module.exports = (parent) => {
        new __Waypoint().mount(parent);
    }
}
