/**********************************
 * relert.object.terrain.js
 * relert.js 地形对象代理层
 **********************************/

 const __Terrain = function() {
    if (typeof __RelertObject == 'function') {
        __RelertObject.call(this);
    } else {
        require('./relert.object').call(this);
    }
    this.entrance = 'Terrain';
    this.register = 'Terrain';
    this.parameters = [
        'Type',
    ]
    this.defaults = {
        'Type': 'TREE01',
    };
    this.arrayLike = false;
}

if ((typeof window == 'object') && (this === window)) {
    new __Terrain().mount(relert);
} else {
    module.exports = (parent) => {
        new __Terrain().mount(parent);
    }
}
