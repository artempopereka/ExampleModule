"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BonusCashSplashModelApp = void 0;
var sw_runtime_1 = require("@skywind-group/sw-runtime");
var constants_1 = require("../../../constants/constants");
var BonusCashSplashModelApp = /** @class */ (function () {
    function BonusCashSplashModelApp() {
    }
    BonusCashSplashModelApp.prototype.parseResponse = function (responseSource) {
        this.cashPrize = 0;
        this.positionsBonusCash = [];
        this.bonusCash = false;
        if (responseSource.state && responseSource.tempSourceResponse && responseSource.tempSourceResponse.result.scene) {
            this.currentScene = responseSource.tempSourceResponse.result.scene;
        }
        if (responseSource.rewards && responseSource.rewards.length > 0) {
            for (var rewardIndex = 0; rewardIndex < responseSource.rewards.length; rewardIndex++) {
                var reward = responseSource.rewards[rewardIndex].reward;
                if (reward === constants_1.RewardTypeApp.CASH && this.currentScene === constants_1.SceneTypeApp.MAIN && this.currentScene === responseSource.state.currentScene) {
                    this.bonusCash = true;
                    this.cashPrize = responseSource.rewards[rewardIndex].payout;
                }
            }
        }
        if (this.bonusCash) {
            var rowLength = responseSource.reels.view.length;
            var reelLength = responseSource.reels.view[rowLength - 1].length;
            for (var reelIndex = 0; reelIndex < reelLength; reelIndex++) {
                for (var rowIndex = 0; rowIndex < rowLength; rowIndex++) {
                    if (responseSource.reels.view[rowIndex][reelIndex] === constants_1.SymbolsIdsApp.BONUS_CASH) {
                        this.positionsBonusCash.push(new sw_runtime_1.Point(reelIndex, rowIndex));
                    }
                }
            }
        }
    };
    return BonusCashSplashModelApp;
}());
exports.BonusCashSplashModelApp = BonusCashSplashModelApp;
