"use strict";
exports.__esModule = true;
var react_1 = require("react");
// import ProxyStore from './src/index'
// var a = new ProxyStore(22)
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
var ProxyStore = /** @class */ (function () {
    function ProxyStore(initValue) {
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
    ProxyStore.prototype._init = function (initValue) {
        Object.defineProperty(this.state, 'value', {
            set: function (newValue) {
                for (var _i = 0, _a = this.dependency.values(); _i < _a.length; _i++) {
                    var func = _a[_i];
                    if (typeof func === 'function') {
                        func(newValue);
                    }
                }
                this._value = newValue;
            },
            get: function () {
                return this._value;
            }
        });
        this.state.dependency = this.dependency;
        this.state.value = initValue;
    };
    ProxyStore.prototype._handler = function (that) {
        return {
            set: function (target, key, value) {
                for (var _i = 0, _a = that.dependency.values(); _i < _a.length; _i++) {
                    var func = _a[_i];
                    if (typeof func === 'function') {
                        func(value);
                    }
                }
                target[key] = value;
                return true;
            }
        };
    };
    ProxyStore.prototype.clean = function (key) {
        if (key) {
            this.dependency["delete"](key);
        }
        else {
            this.dependency.clear();
        }
    };
    ProxyStore.prototype.setValue = function (value) {
        this.state.value = value;
    };
    return ProxyStore;
}());
exports["default"] = ProxyStore;
