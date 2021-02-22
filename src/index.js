"use strict";
exports.__esModule = true;
var react_1 = require("react");
function AddDependency(name) {
    var _this = this;
    // 添加依赖
    var _a = react_1.useState(this.state.value), a = _a[0], setA = _a[1];
    this.dependency.set(name, setA); // 添加依赖
    react_1.useEffect(function () {
        return function () {
            _this.dependency["delete"](name);
        };
    }, [name]);
    return [a, function (value) {
            _this.state.value = value;
        }];
}
var HooksProxyStore = /** @class */ (function () {
    function HooksProxyStore(initValue) {
        this.addDependency = AddDependency;
        this.dependency = new Map();
        if (!window.Proxy && typeof window.Proxy === 'function') {
            this.state = new Proxy({ value: initValue }, this._handler(this));
        }
        else {
            this.state = {
                value: undefined,
                dependency: this.dependency,
                _value: undefined
            };
            this._init(initValue);
        }
        return this;
    }
    HooksProxyStore.prototype._init = function (initValue) {
        Object.defineProperty(this.state, 'value', {
            set: function (newValue) {
                this.dependency.forEach(function (func) {
                    if (typeof func === 'function') {
                        func(newValue);
                    }
                });
                this._value = newValue;
            },
            get: function () {
                return this._value;
            }
        });
        this.state.dependency = this.dependency;
        this.state.value = initValue;
    };
    HooksProxyStore.prototype._handler = function (that) {
        return {
            set: function (target, key, value) {
                that.dependency.forEach(function (func) {
                    if (typeof func === 'function') {
                        func(value);
                    }
                });
                target[key] = value;
                return true;
            }
        };
    };
    HooksProxyStore.prototype.clean = function (key) {
        if (key) {
            this.dependency["delete"](key);
        }
        else {
            this.dependency.clear();
        }
    };
    HooksProxyStore.prototype.setValue = function (value) {
        this.state.value = value;
    };
    HooksProxyStore.prototype.getValue = function () {
        return this.state.value;
    };
    return HooksProxyStore;
}());
exports["default"] = HooksProxyStore;
