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
exports.CashSplashActionApp = void 0;
var sw_runtime_1 = require("@skywind-group/sw-runtime");
var sw_extension_common_1 = require("@skywind-group/sw-extension-common");
var sw_extension_mark2_1 = require("@skywind-group/sw-extension-mark2");
var BonusCashSplashModelApp_1 = require("../model/BonusCashSplashModelApp");
var BonusCashSplashEventsApp_1 = require("../events/BonusCashSplashEventsApp");
var BonusCashSplashIntentsApp_1 = require("../events/BonusCashSplashIntentsApp");
var ResourceIdApp_1 = require("../../../shared/ResourceIdApp");
var constants_1 = require("../constants");
var constants_2 = require("../../../sound/constants");
var CashSplashActionApp = /** @class */ (function (_super) {
    __extends(CashSplashActionApp, _super);
    function CashSplashActionApp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dispatcher = sw_runtime_1.inject(sw_runtime_1.EventDispatcher);
        _this.spinComponentModel = sw_runtime_1.inject(sw_extension_common_1.SpinComponentModel);
        _this.autoSpinsModel = sw_runtime_1.inject(sw_extension_common_1.AutoSpinsModel);
        _this.bonusCashSplashModel = sw_runtime_1.inject(BonusCashSplashModelApp_1.BonusCashSplashModelApp);
        _this.loadManager = sw_runtime_1.inject(sw_runtime_1.LoadManager);
        _this.popupManager = sw_runtime_1.inject(sw_extension_common_1.PopupManager);
        _this.regulationsModel = sw_runtime_1.inject(sw_extension_common_1.RegulationsModel);
        _this.ambientSoundManager = sw_runtime_1.inject(sw_extension_common_1.AmbientSoundsManager);
        _this.soundsManager = sw_runtime_1.inject(sw_runtime_1.SoundManager);
        return _this;
    }
    CashSplashActionApp.prototype.guard = function (actionInfo) {
        return (!actionInfo.isTerminating && this.bonusCashSplashModel.bonusCash);
    };
    CashSplashActionApp.prototype.onTerminate = function (actionInfo) {
        this.dispatcher.dispatch(sw_extension_common_1.Event.SHOW_REEL_SYMBOLS, this.bonusCashSplashModel.positionsBonusCash);
        this.soundsManager.stopSound(constants_2.SoundConstantsApp.bonus.cashSplashLoop);
        this.soundsManager.stopSound(constants_2.SoundConstantsApp.bonus.cashSplash);
        this.removePopupAndListener();
        return _super.prototype.onTerminate.call(this, actionInfo);
    };
    CashSplashActionApp.prototype.onExecute = function (actionInfo) {
        var _this = this;
        this.dispatcher.dispatch(sw_extension_common_1.MainScreenEvents.HIDE_OVERLAY);
        this.dispatcher.dispatch(sw_extension_common_1.Event.SHOW_REEL_SYMBOLS, this.bonusCashSplashModel.positionsBonusCash);
        this.startAnim();
        this.dispatcher.addListener(BonusCashSplashEventsApp_1.BonusCashSplashEventsApp.CASH_SPLASH_ANIMATION_COMPLETE, this.onCashSplashAnimationComplete, this);
        if (this.autoSpinsModel.isUntilFeature) {
            var config = {
                deactivateReason: sw_extension_mark2_1.AutoSpinsManagersConstants.DEACTIVATE_REASON.FEATURE
            };
            this.autoSpinsModel.deactivate(config);
        }
        return new Promise(function (resolve) {
            _this.mainResolve = resolve;
            _this.mainActionInfo = actionInfo;
        });
    };
    CashSplashActionApp.prototype.readyToFinish = function () {
        this.mainResolve(this.mainActionInfo);
    };
    CashSplashActionApp.prototype.onCashSplashAnimationComplete = function () {
        this.ambientSoundManager.stopCurrentSound();
        this.soundsManager.playSound(constants_2.SoundConstantsApp.bonus.cashSplashLoop, -1);
        this.removePopupAndListener();
        this.readyToFinish();
    };
    CashSplashActionApp.prototype.removePopupAndListener = function () {
        this.dispatcher.removeListener(BonusCashSplashEventsApp_1.BonusCashSplashEventsApp.CASH_SPLASH_ANIMATION_COMPLETE, this.onCashSplashAnimationComplete, this);
        this.popupManager.removePopupById(constants_1.CashSplashConstantApp.layouts.cashSplash, true);
    };
    CashSplashActionApp.prototype.startAnim = function () {
        var _this = this;
        this.isAnimSkipped = false;
        this.dispatcher.dispatch(BonusCashSplashIntentsApp_1.BonusCashSplashIntentsApp.SHOW_CASH_SPLASH);
        // Pause all possible animations, which might've been playing before the 5OAK anim
        this.dispatcher.removeAllListeners(sw_extension_common_1.SymbolAnimationEvents.PAUSE_ALL_SYMBOL_ANIMATIONS_COMPLETE);
        this.dispatcher.addListener(sw_extension_common_1.SymbolAnimationEvents.PAUSE_ALL_SYMBOL_ANIMATIONS_COMPLETE, function (positions) {
            _this.dispatcher.dispatch(sw_extension_common_1.Event.SHOW_REEL_SYMBOLS, positions);
        }, this);
        this.dispatcher.dispatch(sw_extension_common_1.SymbolAnimationEvents.PAUSE_ALL_SYMBOL_ANIMATIONS, true);
        this.setStartAnimationUI();
        if (this.loadManager.isResourcesLoaded(ResourceIdApp_1.ResourceIdApp.CASH_SPLASH_GROUP)) {
            this.addView();
        }
        else {
            this.dispatcher.dispatch(sw_extension_mark2_1.PopupEvent.SHOW_LOADING_POPUP);
            this.loadManager.loadImmediately(ResourceIdApp_1.ResourceIdApp.CASH_SPLASH_GROUP).then(function () {
                _this.dispatcher.dispatch(sw_extension_mark2_1.PopupEvent.HIDE_POPUP);
                _this.addView();
                _this.setStartAnimationUI();
            });
        }
    };
    CashSplashActionApp.prototype.addView = function () {
        this.popupManager.createPopupByLayoutId(constants_1.CashSplashConstantApp.layouts.cashSplash, sw_extension_common_1.PopupContainerId.INNER);
        this.soundsManager.playSound(constants_2.SoundConstantsApp.bonus.cashSplash);
    };
    CashSplashActionApp.prototype.setStartAnimationUI = function () {
        this.dispatcher.dispatch(sw_extension_common_1.UIEvent.CHANGE_UI, this.getUIConfig(false));
    };
    CashSplashActionApp.prototype.getUIConfig = function (enable) {
        var result = {
            info: enable,
            bets: enable
        };
        return result;
    };
    return CashSplashActionApp;
}(sw_runtime_1.Action));
exports.CashSplashActionApp = CashSplashActionApp;
