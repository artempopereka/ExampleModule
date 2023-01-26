import {Action, EventDispatcher, IActionInfo, inject, LoadManager, SoundManager} from "@skywind-group/sw-runtime";

import {Point} from "@skywind-group/sw-runtime";

import {
    Event,
    IUIControlsSet,
    PopupContainerId,
    PopupManager,
    RegulationsModel,
    SpinComponentModel,
    SpinComponentState,
    SymbolAnimationEvents,
    UIEvent,
    MainScreenEvents,
    AutoSpinsModel,
    AmbientSoundsManager
} from "@skywind-group/sw-extension-common";

import {
    PopupEvent,
    RegulationsModelMark2,
    AutoSpinsModelMark2,
    IAutoSpinsManager,
    AutoSpinsManagersConstants
} from "@skywind-group/sw-extension-mark2";

import {IWinningActionInfo} from "@skywind-group/sw-extension-mark2";
import {BonusCashSplashModelApp} from "../model/BonusCashSplashModelApp";
import {BonusCashSplashEventsApp} from "../events/BonusCashSplashEventsApp";
import {BonusCashSplashIntentsApp} from "../events/BonusCashSplashIntentsApp";
import {ResourceIdApp} from "../../../shared/ResourceIdApp";
import {CashSplashConstantApp} from "../constants";
import {SoundConstantsApp} from "../../../sound/constants";

export class CashSplashActionApp extends Action {

    protected dispatcher: EventDispatcher = inject(EventDispatcher);
    protected spinComponentModel: SpinComponentModel = inject(SpinComponentModel);
    protected autoSpinsModel: AutoSpinsModelMark2 = inject(AutoSpinsModel);
    protected bonusCashSplashModel: BonusCashSplashModelApp = inject(BonusCashSplashModelApp);
    protected loadManager: LoadManager = inject(LoadManager);
    protected popupManager: PopupManager = inject(PopupManager);
    protected regulationsModel: RegulationsModelMark2 = inject(RegulationsModel);
    protected ambientSoundManager: AmbientSoundsManager = inject(AmbientSoundsManager);
    protected mainResolve: (actionInfo: IWinningActionInfo) => void;
    protected mainActionInfo: IWinningActionInfo;
    protected isAnimSkipped: boolean;
    private soundsManager: SoundManager = inject(SoundManager);

    protected guard(actionInfo: IWinningActionInfo): boolean {
        return (!actionInfo.isTerminating && this.bonusCashSplashModel.bonusCash);
    }

    public onTerminate(actionInfo: IWinningActionInfo): Promise<IActionInfo> {
        this.dispatcher.dispatch(Event.SHOW_REEL_SYMBOLS, this.bonusCashSplashModel.positionsBonusCash);
        this.soundsManager.stopSound(SoundConstantsApp.bonus.cashSplashLoop);
        this.soundsManager.stopSound(SoundConstantsApp.bonus.cashSplash);
        this.removePopupAndListener();
        return super.onTerminate(actionInfo);
    }

    public onExecute(actionInfo: IWinningActionInfo): Promise<IActionInfo> {
        this.dispatcher.dispatch(MainScreenEvents.HIDE_OVERLAY);
        this.dispatcher.dispatch(Event.SHOW_REEL_SYMBOLS, this.bonusCashSplashModel.positionsBonusCash);
        this.startAnim();
        this.dispatcher.addListener(BonusCashSplashEventsApp.CASH_SPLASH_ANIMATION_COMPLETE, this.onCashSplashAnimationComplete, this);

        if (this.autoSpinsModel.isUntilFeature) {
            const config: IAutoSpinsManager = {
                deactivateReason: AutoSpinsManagersConstants.DEACTIVATE_REASON.FEATURE
            };
            this.autoSpinsModel.deactivate(config);
        }

        return new Promise((resolve) => {
            this.mainResolve = resolve;
            this.mainActionInfo = actionInfo;
        });
    }

    private readyToFinish(): void {
        this.mainResolve(this.mainActionInfo);
    }

    private onCashSplashAnimationComplete(): void {
        this.ambientSoundManager.stopCurrentSound();
        this.soundsManager.playSound(SoundConstantsApp.bonus.cashSplashLoop, -1);
        this.removePopupAndListener();
        this.readyToFinish();
    }

    private removePopupAndListener(): void {
        this.dispatcher.removeListener(BonusCashSplashEventsApp.CASH_SPLASH_ANIMATION_COMPLETE, this.onCashSplashAnimationComplete, this);
        this.popupManager.removePopupById(CashSplashConstantApp.layouts.cashSplash, true);
    }

    protected startAnim(): void {
        this.isAnimSkipped = false;

        this.dispatcher.dispatch(BonusCashSplashIntentsApp.SHOW_CASH_SPLASH);

        // Pause all possible animations, which might've been playing before the 5OAK anim
        this.dispatcher.removeAllListeners(SymbolAnimationEvents.PAUSE_ALL_SYMBOL_ANIMATIONS_COMPLETE);
        this.dispatcher.addListener(
            SymbolAnimationEvents.PAUSE_ALL_SYMBOL_ANIMATIONS_COMPLETE,
            (positions: Point[]) => {
                this.dispatcher.dispatch(
                    Event.SHOW_REEL_SYMBOLS,
                    positions
                );
            },
            this
        );

        this.dispatcher.dispatch(
            SymbolAnimationEvents.PAUSE_ALL_SYMBOL_ANIMATIONS,
            true
        );

        this.setStartAnimationUI();
        if (this.loadManager.isResourcesLoaded(ResourceIdApp.CASH_SPLASH_GROUP)) {
            this.addView();
        } else {
            this.dispatcher.dispatch(PopupEvent.SHOW_LOADING_POPUP);
            this.loadManager.loadImmediately(ResourceIdApp.CASH_SPLASH_GROUP).then(() => {
                this.dispatcher.dispatch(PopupEvent.HIDE_POPUP);
                this.addView();
                this.setStartAnimationUI();
            });
        }
    }

    protected addView(): void {
        this.popupManager.createPopupByLayoutId(CashSplashConstantApp.layouts.cashSplash, PopupContainerId.INNER);
        this.soundsManager.playSound(SoundConstantsApp.bonus.cashSplash);
    }

    protected setStartAnimationUI(): void {
        this.dispatcher.dispatch(UIEvent.CHANGE_UI, this.getUIConfig(false));
    }

    protected getUIConfig(enable: boolean): IUIControlsSet {
        const result: IUIControlsSet = {
            info: enable,
            bets: enable
        };

        return result;
    }
}
