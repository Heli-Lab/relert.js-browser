/**********************************
 * relert.object.unit.js
 * relert.js 车辆代理层
 **********************************/

const __Unit = function() {
    if (typeof __RelertObject == 'function') {
        __RelertObject.call(this);
    } else {
        require('./relert.object').call(this);
    }
    this.entrance = 'Unit';
    this.register = 'Units';
    this.parameters = [
        'House',
        'Type',
        'Strength',
        'X',
        'Y',
        'Facing',
        'Status',
        'Tag',
        'Experience',
        'Team',
        'OnBridge',
        'FollowID',
        'Recombinant',
        'AIRecombinant',
    ]
    this.defaults = {
        'House': 'Neutral House',
        'Type': 'E1',
        'Strength': 255,
        'X': 0,
        'Y': 0,
        'Facing': 0,
        'Status': 'Guard',
        'Tag': 'none',
        'Experience': 0,
        'Team': -1,
        'OnBridge': 0,
        'FollowID': -1,
        'Recombinant': 0,
        'AIRecombinant': 1,
    };
    this.arrayLike = true;
}

if ((typeof window == 'object') && (this === window)) {
    new __Unit().mount(relert);
} else {
    module.exports = (parent) => {
        new __Unit().mount(parent);
    }
}
