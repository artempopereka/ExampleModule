import {Container, Label} from "@skywind-group/sw-runtime";
import {CommonCountUp} from "@skywind-group/sw-extension-mark2";

export class CashSplashWinBoxViewApp extends Container {
    protected cashSplashWinLabel: Label;
    protected counter: CommonCountUp;

    public onAdded(): void {
        super.onAdded();
        this.alpha = 0;
        this.counter = new CommonCountUp();
        this.counter.setupGraphics(this.cashSplashWinLabel);
    }

    public destroy(): void {
        super.destroy();
        if (this.counter) {
            this.counter.destroy();
            this.counter = null;
        }
    }

    public startWinTickup(fromValue: number, toValue: number, duration:number): Promise<any> {
        return new Promise<any>(resolve => {
            this.cashSplashWinLabel.visible = true;
            this.counter.setTickupTime(duration);
            this.counter.countUp(fromValue, toValue, () => resolve());
        });
    }

    public resetBonusWin(winValue: string = ""): void {
        this.cashSplashWinLabel.visible = true;
        this.cashSplashWinLabel.text = winValue;
    }

    public skipBonusWin(): void {
        this.counter.skip();
    }

}
