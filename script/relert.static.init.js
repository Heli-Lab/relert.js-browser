/**********************************
 * relert.init.js
 * relert.js 地图初始化工具
 **********************************/

 const __Init = function() {
    if (typeof __RelertStatic == 'function') {
        __RelertStatic.call(this);
    } else {
        require('./relert.static').call(this);
    }

    this.digest = (len = 27) => {
        let alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < len; i++) {
            result += alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        return result + '=';
    }

    let initParams = {
        'Basic': {
            'Name': 'No name',
            'Player': 'none',
            'Percent': '0',
            'GameMode': 'standard',
            'HomeCell': '98',
            'InitTime': '10000',
            'Official': 'no',
            'EndOfGame': 'no',
            'FreeRadar': 'no',
            'MaxPlayer': '2',
            'MinPlayer': '2',
            'SkipScore': 'no',
            'TrainCrate': 'no',
            'TruckCrate': 'no',
            'AltHomeCell': '99',
            'OneTimeOnly': 'no',
            'CarryOverCap': '0',
            'NewINIFormat': '4',
            'NextScenario': '',
            'SkipMapSelect': 'no',
            'CarryOverMoney': '0.000000',
            'AltNextScenario': '',
            'MultiplayerOnly': '0',
            'IceGrowthEnabled': 'yes',
            'VeinGrowthEnabled': 'yes',
            'TiberiumGrowthEnabled': 'yes',
            'IgnoreGlobalAITriggers': 'yes',
            'TiberiumDeathToVisceroid': 'no',
        },
        'Lighting': {
            'Red': 1.000000,
            'Blue': 1.000000,
            'Green': 1.000000,
            'Level': 0.015000,
            'Ground': 0.000000,
            'IonRed': 0.695000,
            'Ambient': 1.000000,
            'IonBlue': 0.775000,
            'IonGreen': 0.445000,
            'IonLevel': 0.015000,
            'IonGround': 0.000000,
            'IonAmbient': 0.650000,
            'DominatorRed': 0.850000,
            'DominatorBlue': 0.300000,
            'DominatorGreen': 0.200000,
            'DominatorLevel': 0.000000,
            'DominatorGround': 0.000000,
            'DominatorAmbient': 1.500000,
            'DominatorAmbientChangeRate': 0.009000,
        },
        'Map': {
            'Size': '0,0,80,80',
            'Theater': 'TEMPERATE',
            'LocalSize': '3,5,74,69',
        },
        'SpecialFlags': {
            'Inert': 'no',
            'FogOfWar': 'no',
            'IonStorms': 'no',
            'MCVDeploy': 'no',
            'Meteorites': 'no',
            'Visceroids': 'yes',
            'FixedAlliance': 'no',
            'TiberiumGrows': 'yes',
            'InitialVeteran': 'no',
            'HarvesterImmune': 'no',
            'TiberiumSpreads': 'yes',
            'TiberiumExplosive': 'no',
            'DestroyableBridges': 'no',
        },
        'Digest': {
            '1': this.digest(27),
        }
    }

    let combineObj = (obj1, obj2) => {
        for (let key in obj2) {
            if (!(obj1[key])) {
                obj1[key] = obj2[key];
            } else {
                if (typeof obj2[key] == 'object') {
                    combineObj(obj1[key], obj2[key]);
                }
            }
        }
    }

    this.init = () => {
        combineObj(this.parent.INI, initParams);
    }

    this.exports = {
        init: this.init,
        digest: this.digest,
    }
}

if ((typeof window == 'object') && (this === window)) {
    new __Init().mount(relert);
} else {
    module.exports = (parent) => {
        new __Init().mount(parent);
    }
}
