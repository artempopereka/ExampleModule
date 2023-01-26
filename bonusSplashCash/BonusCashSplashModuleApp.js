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
exports.BonusCashSplashModuleApp = void 0;
var sw_runtime_1 = require("@skywind-group/sw-runtime");
var BonusCashSplashModelApp_1 = require("./model/BonusCashSplashModelApp");
var CashSplashActionApp_1 = require("./actions/CashSplashActionApp");
var CashSplashWinBoxViewApp_1 = require("./views/CashSplashWinBoxViewApp");
var CashSplashWinMediatorApp_1 = require("./mediators/CashSplashWinMediatorApp");
var constants_1 = require("./constants");
var BonusCashSplashModuleApp = /** @class */ (function (_super) {
    __extends(BonusCashSplashModuleApp, _super);
    function BonusCashSplashModuleApp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BonusCashSplashModuleApp.prototype.addInjections = function (kernel) {
        kernel.bind(BonusCashSplashModelApp_1.BonusCashSplashModelApp)
            .asSingleton()
            .forceCreation()
            .asModel()
            .serverModel();
        kernel.bind(CashSplashActionApp_1.CashSplashActionApp)
            .asSingleton();
        kernel.bindView(CashSplashWinBoxViewApp_1.CashSplashWinBoxViewApp)
            .toId(constants_1.CashSplashConstantApp.layouts.cashSplashWinView);
        kernel.bindMediator(CashSplashWinMediatorApp_1.CashSplashWinMediatorApp)
            .toView(CashSplashWinBoxViewApp_1.CashSplashWinBoxViewApp);
    };
    return BonusCashSplashModuleApp;
}(sw_runtime_1.ApplicationModule));
exports.BonusCashSplashModuleApp = BonusCashSplashModuleApp;
