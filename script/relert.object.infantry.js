/**********************************
 * relert.object.infantry.js
 * relert.js 步兵代理层
 **********************************/

const __Infantry = function() {
    if (typeof __RelertObject == 'function') {
        __RelertObject.call(this);
    } else {
        require('./relert.object').call(this);
    }
    this.entrance = 'Infantry';
    this.register = 'Infantry';
    this.parameters = [
        'House',
        'Type',
        'Strength',
        'X',
        'Y',
        'Stance',
        'Status',
        'Facing',
        'Tag',
        'Experience',
        'Team',
        'OnBridge',
        'Recombinant',
        'AIRecombinant',
    ]
    this.defaults = {
        'House': 'Neutral House',
        'Type': 'E1',
        'Strength': '255',
        'X': '0',
        'Y': '0',
        'Stance': '0',
        'Status': 'Guard',
        'Facing': '0',
        'Tag': 'none',
        'Experience': '0',
        'Team': '-1',
        'OnBridge': '0',
        'Recombinant': '0',
        'AIRecombinant': '1',
    };
    this.arrayLike = true;
}

if ((typeof window == 'object') && (this === window)) {
    new __Infantry().mount(relert);
} else {
    module.exports = (parent) => {
        new __Infantry().mount(parent);
    }
}
