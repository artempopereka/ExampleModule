import {IServerModel, IServerResponseVO} from "@skywind-group/sw-extension-common";
import {Point} from "@skywind-group/sw-runtime";
import {RewardTypeApp, SceneTypeApp, SymbolsIdsApp} from "../../../constants/constants";
import {IGameSpinResponseApp} from "../../server/data/IServerResponseVOApp";

export class BonusCashSplashModelApp implements IServerModel {

    private currentScene: string;
    public bonusCash: boolean;
    public positionsBonusCash: Point[];
    public cashPrize: number;

    public parseResponse(responseSource: IServerResponseVO): void {
        this.cashPrize = 0;
        this.positionsBonusCash = [];
        this.bonusCash = false;
        if (responseSource.state && responseSource.tempSourceResponse && (responseSource.tempSourceResponse.result as IGameSpinResponseApp).scene) {
            this.currentScene = (responseSource.tempSourceResponse.result as IGameSpinResponseApp).scene;
        }
        if (responseSource.rewards && responseSource.rewards.length > 0) {
            for (let rewardIndex: number = 0; rewardIndex < responseSource.rewards.length; rewardIndex++) {
                const reward: string = responseSource.rewards[rewardIndex].reward;
                if (reward === RewardTypeApp.CASH && this.currentScene === SceneTypeApp.MAIN && this.currentScene === responseSource.state.currentScene) {
                    this.bonusCash = true;
                    this.cashPrize = responseSource.rewards[rewardIndex].payout;
                }
            }
        }
        if (this.bonusCash) {
            const rowLength: number = responseSource.reels.view.length;
            const reelLength: number = responseSource.reels.view[rowLength - 1].length;
            for (let reelIndex: number = 0; reelIndex < reelLength; reelIndex++) {
                for (let rowIndex: number = 0; rowIndex < rowLength; rowIndex++) {
                    if (responseSource.reels.view[rowIndex][reelIndex] === SymbolsIdsApp.BONUS_CASH) {
                        this.positionsBonusCash.push(new Point(reelIndex, rowIndex));
                    }
                }
            }
        }
    }
}