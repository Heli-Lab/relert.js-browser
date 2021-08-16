/**********************************
 * relert.tick.js
 * relert.js 打点计时器
 **********************************/

const __Tick = new function() {
    this.entrance = '';
    this.mount = (parent) => {
        for (let func in this.exports) {
            Object.defineProperty(parent, func, {
                get: () => {
                    return this.exports[func];
                },
                set: () => {
                    throw new Error(`TypeError: Assignment to constant property '${func}'.`);
                },
            });
        }
        parent.$INI = parent.INI;
        Object.defineProperty(parent, 'INI', {
            get: () => {
                parent.tick();
                return parent.$INI;
            },
            set: (newINI) => {
                parent.tick();
                parent.$INI = newINI;
            },
        });
    };

    this.getNow = () => {};
    if (typeof window == 'object') {
        this.getNow = () => {
            return performance.now();
        }
    } else {
        this.getNow = () => {
            return process.uptime() * 1000;
        }
    }

    this.timeOut = 3000;
    this.globalId = Symbol();
    this.process = {
        [this.globalId]: {
            running: false,
        },
    };

    this.tickStart = (processId = this.globalId, timeOut = this.timeOut) => {
        this.process[processId] = {
            running: true,
            startTime: this.getNow(),
            timeOut: timeOut,
        }
        return processId;
    }

    this.tickEnd = (processId = this.globalId) => {
        this.process[processId].running = false;
    }

    this.tick = (processId = this.globalId) => {
        if (this.process[processId].running) {
            let interval = this.getNow() - this.process[processId].startTime;
            if (interval > this.process[processId].timeOut) {
                throw new Error(`Time Limit Exceeded: [${interval}ms > ${this.process[processId].timeOut}ms]
    The script process has already been killed.
    Please check if there is an INFINITE LOOP in your script,
    or, manually increase the time limit with method <relert.tickTimeOut(number[in millseconds])>.`);
            }
            return interval;
        } else {
            return 0;
        }
    }

    this.tickProcess = (func, processId = this.globalId, timeOut = this.timeOut) => {
        try {
            this.tickStart(processId, timeOut);
            func.call();
        } catch(err) {
            throw(err);
        } finally {
            this.tickEnd(processId);
        }
    }

    this.tickTimeOut = (ms) => {
        if (ms) {
            this.timeOut = ms;
            this.process[this.globalId].timeOut = ms;
        }
        return this.timeOut;
    }

    this.exports = {
        tickStart: this.tickStart,
        tickEnd: this.tickEnd,
        tick: this.tick,
        tickProcess: this.tickProcess,
        tickTimeOut: this.tickTimeOut,
    }
}

if ((typeof window == 'object') && (this === window)) {
    __Tick.mount(relert);
} else {
    module.exports = __Tick.mount;
}
