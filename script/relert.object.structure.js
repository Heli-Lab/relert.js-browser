/**********************************
 * relert.object.structure.js
 * relert.js 建筑代理层
 **********************************/

const __Structure = function() {
    if (typeof __RelertObject == 'function') {
        __RelertObject.call(this);
    } else {
        require('./relert.object').call(this);
    }
    this.entrance = 'Structure';
    this.register = 'Structures';
    this.parameters = [
        'House',
        'Type',
        'Strength',
        'X',
        'Y',
        'Facing',
        'Tag',
        'Sellable',
        'Rebuild',
        'Enabled',
        'UpgradesCount',
        'SpotLight',
        'Upgrade1',
        'Upgrade2',
        'Upgrade3',
        'AIRepair',
        'ShowName'
    ]
    this.defaults = {
        'House': 'Neutral House',
        'Type': 'GAPOWR',
        'Strength': 255,
        'X': 0,
        'Y': 0,
        'Facing': 0,
        'Tag': 'none',
        'Sellable': 0,
        'Rebuild': 0,
        'Enabled': 1,
        'UpgradesCount': 0,
        'SpotLight': 0,
        'Upgrade1': 'none',
        'Upgrade2': 'none',
        'Upgrade3': 'none',
        'AIRepair': 1,
        'ShowName': 0
    };
    this.arrayLike = true;
}

if ((typeof window == 'object') && (this === window)) {
    new __Structure().mount(relert);
} else {
    module.exports = (parent) => {
        new __Structure().mount(parent);
    }
}
