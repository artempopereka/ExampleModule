import {inject, Mediator, SoundManager} from "@skywind-group/sw-runtime";
import {StakesModelEvent} from "@skywind-group/sw-extension-common";
import {WinBoxEvents, WinBoxConstants} from "@skywind-group/sw-extension-mark2";
import {CashSplashWinBoxViewApp} from "../views/CashSplashWinBoxViewApp";
import {BonusCashSplashModelApp} from "../model/BonusCashSplashModelApp";
import {ArtTopIntentsApp} from "../../artTopAnimation/events/ArtTopIntentsApp";
import {ArtTopAnimationConstantsApp} from "../../artTopAnimation/constants";
import {ParrotFlyingEventsApp} from "../../artTopAnimation/events/ParrotFlyingEventsApp";
import {WinBoxIntentsApp} from "../../winBox/events/WinBoxIntentsApp";
import { TweenLite, Linear } from "gsap";

export class CashSplashWinMediatorApp extends Mediator {
    protected view: CashSplashWinBoxViewApp;

    private bonusCashSplashModel: BonusCashSplashModelApp = inject(BonusCashSplashModelApp);
    private soundsManager: SoundManager = inject(SoundManager);
    private waitOpenFirstChest: boolean = false;

    public initialize() {
        this.addListener(ArtTopIntentsApp.PARROT_FLYING_START_ANIMATION, this.onParrotFlyingStartAnimation);
        this.addListener(ArtTopIntentsApp.OPEN_CHEST, this.onOpenChest);
        this.addListener(ParrotFlyingEventsApp.PARROT_FLYING_BACK_COMPLETED, this.onParrotFlyingBackCompleted);
        this.addListener(ArtTopIntentsApp.SKIP_WIN_BOX_ANIMATION, this.onSkipWinBoxAnimations);
        this.addListener(WinBoxIntentsApp.HIDE_WIN_BOX_LABELS, this.onHideWinBoxLabel);
        this.addListener(StakesModelEvent.STAKES_CHANGE, this.onStakesChange);
        this.addListener(WinBoxEvents.TOGGLE_WIN_BOX_LABELS, this.onToggleWinBoxLabels);
        this.addListener(WinBoxEvents.SHOW_WIN_BOX_LABEL, this.onShowWinBoxLabel);
    }

    private onParrotFlyingBackCompleted(): void {
        this.view.skipBonusWin();
    }

    private onSkipWinBoxAnimations(): void {
        this.view.alpha = 1;
        this.updateTotalWin();
        this.view.skipBonusWin();
    }

    private onParrotFlyingStartAnimation(): void {
        this.waitOpenFirstChest = true;
    }

    private onHideWinBoxLabel(): void {
        this.hideCashSplashWinView();
    }

    private onStakesChange(): void {
        this.hideCashSplashWinView();
    }

    private onToggleWinBoxLabels(): void {
        this.hideCashSplashWinView();
    }

    private onShowWinBoxLabel(): void {
        this.hideCashSplashWinView();
    }

    private onOpenChest(): void {
        if (this.waitOpenFirstChest) {
            this.waitOpenFirstChest = false;
            this.onShowTotalWin();
            this.updateTotalWin();
        }
    }

    private onShowTotalWin(): void {
        this.view.resetBonusWin();

        TweenLite.killTweensOf(this.view);
        TweenLite.to(this.view, 0.35, {alpha: 1, ease: Linear.easeOut});
    }

    private hideCashSplashWinView(): void {
        TweenLite.killTweensOf(this.view);
        TweenLite.to(this.view, 0.35, {alpha: 0, ease: Linear.easeOut});
    }

    private updateTotalWin():void {
        const duration: number = this.bonusCashSplashModel.positionsBonusCash.length *
            (ArtTopAnimationConstantsApp.flyingDurationSync + ArtTopAnimationConstantsApp.openChestDuration) +
            ArtTopAnimationConstantsApp.backingDuration;
        this.soundsManager.playSound(WinBoxConstants.sounds.freespinTickupLoopSoundId, -1);
        this.view.startWinTickup(0, this.bonusCashSplashModel.cashPrize, duration).then(() => {
            this.soundsManager.stopSound(WinBoxConstants.sounds.freespinTickupLoopSoundId);
            this.soundsManager.playSound(WinBoxConstants.sounds.freespinTickupEndSoundId);
        });
    }
}
