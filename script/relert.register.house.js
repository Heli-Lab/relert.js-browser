/**********************************
 * relert.object.house.js
 * relert.js 作战方代理层
 **********************************/

 const __House = function() {
    if (typeof __RelertRegister == 'function') {
        __RelertRegister.call(this);
    } else {
        require('./relert.object').call(this);
    }
    this.entrance = 'House';
    this.register = 'Houses';
    this.addName = true;
    this.defaults = {
        'IQ': 5,
        'Edge': 'North',
        'Name': '',
        'Color': 'DarkBlue',
        'Allies': '',
        'Country': '',
        'Credits': 0,
        'NodeCount': 0,
        'TechLevel': 10,
        'PercentBuilt': 100,
        'PlayerControl': 'no',
    };
}

if ((typeof window == 'object') && (this === window)) {
    new __House().mount(relert);
} else {
    module.exports = (parent) => {
        new __House().mount(parent);
    }
}
