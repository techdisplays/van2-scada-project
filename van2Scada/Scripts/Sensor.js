const request = require('./lib/restMasterRequest.js');

/**
 * Convert synchronous iterable to asynchronous iterable.
 * It is needed to use for await loop with synchronous iterable and used in updateData() method.
 * @param {Array} syncIterable 
 */
async function* syncToAsyncIterable(syncIterable) {
    for (const elem of syncIterable) {
        yield elem;
    };
};

class Sensor {
    /**
    * @param {string} deviceAlias Alias of the device written in master.
    * @param {Array<{name: string, index: number, subindex: number, method: string}>} parameters Array of objects with parameterSet properties.
    * @example
    * const BIS01E5 = new Sensor('BIS01E5', [
    * { name: 'vibrationLevel',  index: 8462, subindex: 0, method: '.readFloatBE()' },
    * { name: 'inclination',  index: 8532, subindex: 0, method: '[0]' },
    * { name: 'vibrationAlarm',  index: 8464, subindex: 0, method: '[0] === 255 ? true : false' },
    * { name: 'inclinationAlarm',  index: 8530, subindex: 2, method: '[0] === 255 ? true : false' },
    * ]);
    * console.log(BIS01E5);
    * Output:
    * Sensor {
    * deviceAlias: 'BIS01E5',
    * parameters: [
    * { name: 'vibrationLevel', index: 8462, subindex: 0, method: '.readFloatBE()' },
    * { name: 'inclination', index: 8532, subindex: 0, method: '[0]' },
    * { name: 'vibrationAlarm', index: 8464, subindex: 0, method: '[0] === 255 ? true : false' },
    * { name: 'inclinationAlarm', index: 8530, subindex: 2, method: '[0] === 255 ? true : false' }
    * ],
    * parameterData: { vibrationLevel: 0, inclination: 0, vibrationAlarm: 0, inclinationAlarm: 0 }
    * }
    * 
    */
    constructor(deviceAlias, parameters) {
        this.deviceAlias = deviceAlias;
        this.parameters = parameters;
        this.parameterData = {};

        // Define object properties for each parameter set.
        parameters.forEach(element => {
            this.parameterData[element.name] = 0;
        });
    };

    /**
     * Get data from master and update parameterData object.
     * @param {string} masterIP IP address of the master.
     * @example
     */
    async updateData(masterIP) {
        for await (const element of syncToAsyncIterable(this.parameters)) {
            let buff = await request.readParameterData(masterIP, this.deviceAlias, element.index, element.subindex);
            try {
                // works like BIS01E5.parameterData[vibrationLevel] = buff.readFloatBE();
                if (buff !== null) this.parameterData[element.name] = eval('buff' + element.method);
            } catch {
                console.error(`Error in eval - wrong method ${element.method} in ${element.name} parameterSet.`)
                //throw new Error(`Error in eval - wrong method ${element.method} in ${element.name} parameterSet.`);
            };
        };
    };

    /**
     * Print object (without 'parameters' array of objects).
     */
    print() {
        const clone = (({ parameters, ...o }) => o)(this) // remove b and c
        console.log(clone)
    }
};


module.exports = Sensor;