/**********************************
 * relert.object.smudge.js
 * relert.js 污染代理层
 **********************************/

 const __Smudge = function() {
    if (typeof __RelertObject == 'function') {
        __RelertObject.call(this);
    } else {
        require('./relert.object').call(this);
    }
    this.entrance = 'Smudge';
    this.register = 'Smudge';
    this.parameters = [
        'Type',
        'X',
        'Y',
        'Ignore',
    ]
    this.defaults = {
        'Type': 'CRATER01',
        'X': '0',
        'Y': '0',
        'Ignore': '0',
    };
    this.arrayLike = true;
}

if ((typeof window == 'object') && (this === window)) {
    new __Smudge().mount(relert);
} else {
    module.exports = (parent) => {
        new __Smudge().mount(parent);
    }
}
