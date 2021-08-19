/**********************************
 * relert.object.aircraft.js
 * relert.js 飞行器代理层
 **********************************/

const __Aircraft = function() {
    if (typeof __RelertObject == 'function') {
        __RelertObject.call(this);
    } else {
        require('./relert.object').call(this);
    }
    this.entrance = 'Aircraft';
    this.register = 'Aircraft';
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
        'Recombinant',
        'AIRecombinant',
    ]
    this.defaults = {
        'House': 'Neutral House',
        'Type': 'ORCA',
        'Strength': '255',
        'X': '0',
        'Y': '0',
        'Facing': '0',
        'Status': 'Guard',
        'Tag': 'none',
        'Experience': '0',
        'Team': '-1',
        'Recombinant': '0',
        'AIRecombinant': '1',
    };
    this.arrayLike = true;
}

if ((typeof window == 'object') && (this === window)) {
    new __Aircraft().mount(relert);
} else {
    module.exports = (parent) => {
        new __Aircraft().mount(parent);
    }
}
