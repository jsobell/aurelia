import { subscriberCollection } from './subscriber-collection.js';
/**
 * Observer for the mutation of object property value employing getter-setter strategy.
 * This is used for observing object properties that has no decorator.
 */
export class SetterObserver {
    constructor(obj, propertyKey) {
        this.obj = obj;
        this.propertyKey = propertyKey;
        this.currentValue = void 0;
        this.oldValue = void 0;
        this.inBatch = false;
        this.observing = false;
        // todo(bigopon): tweak the flag based on typeof obj (array/set/map/iterator/proxy etc...)
        this.type = 4 /* Obj */;
    }
    getValue() {
        return this.currentValue;
    }
    setValue(newValue, flags) {
        if (this.observing) {
            const currentValue = this.currentValue;
            this.currentValue = newValue;
            this.callSubscribers(newValue, currentValue, flags);
        }
        else {
            // If subscribe() has been called, the target property descriptor is replaced by these getter/setter methods,
            // so calling obj[propertyKey] will actually return this.currentValue.
            // However, if subscribe() was not yet called (indicated by !this.observing), the target descriptor
            // is unmodified and we need to explicitly set the property value.
            // This will happen in one-time, to-view and two-way bindings during $bind, meaning that the $bind will not actually update the target value.
            // This wasn't visible in vCurrent due to connect-queue always doing a delayed update, so in many cases it didn't matter whether $bind updated the target or not.
            this.obj[this.propertyKey] = newValue;
        }
    }
    flushBatch(flags) {
        this.inBatch = false;
        const currentValue = this.currentValue;
        const oldValue = this.oldValue;
        this.oldValue = currentValue;
        this.callSubscribers(currentValue, oldValue, flags);
    }
    subscribe(subscriber) {
        if (this.observing === false) {
            this.start();
        }
        this.addSubscriber(subscriber);
    }
    start() {
        if (this.observing === false) {
            this.observing = true;
            this.currentValue = this.obj[this.propertyKey];
            Reflect.defineProperty(this.obj, this.propertyKey, {
                enumerable: true,
                configurable: true,
                get: ( /* Setter Observer */) => this.getValue(),
                set: (/* Setter Observer */ value) => {
                    this.setValue(value, 0 /* none */);
                },
            });
        }
        return this;
    }
    stop() {
        if (this.observing) {
            Reflect.defineProperty(this.obj, this.propertyKey, {
                enumerable: true,
                configurable: true,
                writable: true,
                value: this.currentValue,
            });
            this.observing = false;
            // todo(bigopon/fred): add .removeAllSubscribers()
        }
        return this;
    }
}
export class SetterNotifier {
    // todo(bigopon): remove flag aware assignment in ast, move to the decorator itself
    constructor(s) {
        this.s = s;
        // ideally, everything is an object,
        // probably this flag is redundant, just None?
        this.type = 4 /* Obj */;
        /**
         * @internal
         */
        this.v = void 0;
    }
    getValue() {
        return this.v;
    }
    setValue(value, flags) {
        if (typeof this.s === 'function') {
            value = this.s(value);
        }
        const oldValue = this.v;
        if (!Object.is(value, oldValue)) {
            this.v = value;
            this.callSubscribers(value, oldValue, flags);
        }
    }
}
subscriberCollection()(SetterObserver);
subscriberCollection()(SetterNotifier);
//# sourceMappingURL=setter-observer.js.map