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
exports.CashSplashWinMediatorApp = void 0;
var sw_runtime_1 = require("@skywind-group/sw-runtime");
var sw_extension_common_1 = require("@skywind-group/sw-extension-common");
var sw_extension_mark2_1 = require("@skywind-group/sw-extension-mark2");
var BonusCashSplashModelApp_1 = require("../model/BonusCashSplashModelApp");
var ArtTopIntentsApp_1 = require("../../artTopAnimation/events/ArtTopIntentsApp");
var constants_1 = require("../../artTopAnimation/constants");
var ParrotFlyingEventsApp_1 = require("../../artTopAnimation/events/ParrotFlyingEventsApp");
var WinBoxIntentsApp_1 = require("../../winBox/events/WinBoxIntentsApp");
var gsap_1 = require("gsap");
var CashSplashWinMediatorApp = /** @class */ (function (_super) {
    __extends(CashSplashWinMediatorApp, _super);
    function CashSplashWinMediatorApp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bonusCashSplashModel = sw_runtime_1.inject(BonusCashSplashModelApp_1.BonusCashSplashModelApp);
        _this.soundsManager = sw_runtime_1.inject(sw_runtime_1.SoundManager);
        _this.waitOpenFirstChest = false;
        return _this;
    }
    CashSplashWinMediatorApp.prototype.initialize = function () {
        this.addListener(ArtTopIntentsApp_1.ArtTopIntentsApp.PARROT_FLYING_START_ANIMATION, this.onParrotFlyingStartAnimation);
        this.addListener(ArtTopIntentsApp_1.ArtTopIntentsApp.OPEN_CHEST, this.onOpenChest);
        this.addListener(ParrotFlyingEventsApp_1.ParrotFlyingEventsApp.PARROT_FLYING_BACK_COMPLETED, this.onParrotFlyingBackCompleted);
        this.addListener(ArtTopIntentsApp_1.ArtTopIntentsApp.SKIP_WIN_BOX_ANIMATION, this.onSkipWinBoxAnimations);
        this.addListener(WinBoxIntentsApp_1.WinBoxIntentsApp.HIDE_WIN_BOX_LABELS, this.onHideWinBoxLabel);
        this.addListener(sw_extension_common_1.StakesModelEvent.STAKES_CHANGE, this.onStakesChange);
        this.addListener(sw_extension_mark2_1.WinBoxEvents.TOGGLE_WIN_BOX_LABELS, this.onToggleWinBoxLabels);
        this.addListener(sw_extension_mark2_1.WinBoxEvents.SHOW_WIN_BOX_LABEL, this.onShowWinBoxLabel);
    };
    CashSplashWinMediatorApp.prototype.onParrotFlyingBackCompleted = function () {
        this.view.skipBonusWin();
    };
    CashSplashWinMediatorApp.prototype.onSkipWinBoxAnimations = function () {
        this.view.alpha = 1;
        this.updateTotalWin();
        this.view.skipBonusWin();
    };
    CashSplashWinMediatorApp.prototype.onParrotFlyingStartAnimation = function () {
        this.waitOpenFirstChest = true;
    };
    CashSplashWinMediatorApp.prototype.onHideWinBoxLabel = function () {
        this.hideCashSplashWinView();
    };
    CashSplashWinMediatorApp.prototype.onStakesChange = function () {
        this.hideCashSplashWinView();
    };
    CashSplashWinMediatorApp.prototype.onToggleWinBoxLabels = function () {
        this.hideCashSplashWinView();
    };
    CashSplashWinMediatorApp.prototype.onShowWinBoxLabel = function () {
        this.hideCashSplashWinView();
    };
    CashSplashWinMediatorApp.prototype.onOpenChest = function () {
        if (this.waitOpenFirstChest) {
            this.waitOpenFirstChest = false;
            this.onShowTotalWin();
            this.updateTotalWin();
        }
    };
    CashSplashWinMediatorApp.prototype.onShowTotalWin = function () {
        this.view.resetBonusWin();
        gsap_1.TweenLite.killTweensOf(this.view);
        gsap_1.TweenLite.to(this.view, 0.35, { alpha: 1, ease: gsap_1.Linear.easeOut });
    };
    CashSplashWinMediatorApp.prototype.hideCashSplashWinView = function () {
        gsap_1.TweenLite.killTweensOf(this.view);
        gsap_1.TweenLite.to(this.view, 0.35, { alpha: 0, ease: gsap_1.Linear.easeOut });
    };
    CashSplashWinMediatorApp.prototype.updateTotalWin = function () {
        var _this = this;
        var duration = this.bonusCashSplashModel.positionsBonusCash.length *
            (constants_1.ArtTopAnimationConstantsApp.flyingDurationSync + constants_1.ArtTopAnimationConstantsApp.openChestDuration) +
            constants_1.ArtTopAnimationConstantsApp.backingDuration;
        this.soundsManager.playSound(sw_extension_mark2_1.WinBoxConstants.sounds.freespinTickupLoopSoundId, -1);
        this.view.startWinTickup(0, this.bonusCashSplashModel.cashPrize, duration).then(function () {
            _this.soundsManager.stopSound(sw_extension_mark2_1.WinBoxConstants.sounds.freespinTickupLoopSoundId);
            _this.soundsManager.playSound(sw_extension_mark2_1.WinBoxConstants.sounds.freespinTickupEndSoundId);
        });
    };
    return CashSplashWinMediatorApp;
}(sw_runtime_1.Mediator));
exports.CashSplashWinMediatorApp = CashSplashWinMediatorApp;
