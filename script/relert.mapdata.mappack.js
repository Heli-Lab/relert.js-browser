/**********************************
 * relert.mapdata.mappack.js
 * relert.js 地形代理层
 **********************************/

 const __MapPack = function() {
    if (typeof __RelertMapData == 'function') {
        __RelertMapData.call(this);
    } else {
        require('./relert.mappack').call(this);
    }
    this.entrance = 'MapPack';
    this.register = 'IsoMapPack5';
    this.parameters = [{
            name: 'X',
            bytes: 2,
        }, {
            name: 'Y',
            bytes: 2,
        }, {
            name: 'TileIndex',
            bytes: 4,
        }, {
            name: 'TileSubIndex',
            bytes: 1,
        }, {
            name: 'Level',
            bytes: 1,
        }, {
            name: 'IceGrowth',
            bytes: 1,
        },
    ];
    this.defaults = {
        TileIndex: 0,
        TileSubIndex: 0,
        Level: 0,
        IceGrowth: 0,
    }
}

if ((typeof window == 'object') && (this === window)) {
    new __MapPack().mount(relert);
} else {
    module.exports = (parent) => {
        new __MapPack().mount(parent);
    }
}
