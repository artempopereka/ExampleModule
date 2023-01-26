"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashSplashWinBoxViewApp = void 0;
var sw_runtime_1 = require("@skywind-group/sw-runtime");
var sw_extension_mark2_1 = require("@skywind-group/sw-extension-mark2");
var CashSplashWinBoxViewApp = /** @class */ (function (_super) {
    __extends(CashSplashWinBoxViewApp, _super);
    function CashSplashWinBoxViewApp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CashSplashWinBoxViewApp.prototype.onAdded = function () {
        _super.prototype.onAdded.call(this);
        this.alpha = 0;
        this.counter = new sw_extension_mark2_1.CommonCountUp();
        this.counter.setupGraphics(this.cashSplashWinLabel);
    };
    CashSplashWinBoxViewApp.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        if (this.counter) {
            this.counter.destroy();
            this.counter = null;
        }
    };
    CashSplashWinBoxViewApp.prototype.startWinTickup = function (fromValue, toValue, duration) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.cashSplashWinLabel.visible = true;
            _this.counter.setTickupTime(duration);
            _this.counter.countUp(fromValue, toValue, function () { return resolve(); });
        });
    };
    CashSplashWinBoxViewApp.prototype.resetBonusWin = function (winValue) {
        if (winValue === void 0) { winValue = ""; }
        this.cashSplashWinLabel.visible = true;
        this.cashSplashWinLabel.text = winValue;
    };
    CashSplashWinBoxViewApp.prototype.skipBonusWin = function () {
        this.counter.skip();
    };
    return CashSplashWinBoxViewApp;
}(sw_runtime_1.Container));
exports.CashSplashWinBoxViewApp = CashSplashWinBoxViewApp;
