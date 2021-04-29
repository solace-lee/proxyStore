"use strict";
exports.__esModule = true;
var react_1 = require("react");
function AddDependency(name, late) {
    var _this = this;
    if (late === void 0) { late = false; }
    // 添加依赖
    var _a = react_1.useState(this.state.value), a = _a[0], setA = _a[1];
    var isMounted = react_1.useRef(true);
    if (late) {
        this.dependency.set(name, function (value) {
            setTimeout(function () {
                if (isMounted.current) {
                    setA(value);
                }
            });
        }); // 添加依赖
    }
    else {
        this.dependency.set(name, function (value) {
            if (isMounted.current) {
                setA(value);
            }
        }); // 添加依赖
    }
    react_1.useEffect(function () {
        return function () {
            isMounted.current = false;
            _this.dependency["delete"](name);
        };
    }, [name]);
    return [
        a,
        function (value) {
            _this.state.value = value;
        },
    ];
}
var HooksProxyStore = /** @class */ (function () {
    function HooksProxyStore(initValue) {
        this.addDependency = AddDependency;
        this.dependency = new Map();
        if (window.Proxy && typeof window.Proxy === "function") {
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
        Object.defineProperty(this.state, "value", {
            set: function (newValue) {
                if (this._value !== newValue) {
                    this._value = newValue;
                    this.dependency.forEach(function (func) {
                        if (typeof func === "function") {
                            func(newValue);
                        }
                    });
                }
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
                if (target[key] !== value) {
                    target[key] = value;
                    that.dependency.forEach(function (func) {
                        if (typeof func === "function") {
                            func(value);
                        }
                    });
                }
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
        // 修改值
        this.state.value = value;
    };
    HooksProxyStore.prototype.getValue = function () {
        // 获取值
        return this.state.value;
    };
    return HooksProxyStore;
}());
exports["default"] = HooksProxyStore;
