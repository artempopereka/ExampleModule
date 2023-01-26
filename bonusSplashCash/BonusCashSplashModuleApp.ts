import {
    IKernel,
    ApplicationModule
} from "@skywind-group/sw-runtime";

import {BonusCashSplashModelApp} from "./model/BonusCashSplashModelApp";
import {CashSplashActionApp} from "./actions/CashSplashActionApp";
import {CashSplashWinBoxViewApp} from "./views/CashSplashWinBoxViewApp";
import {CashSplashWinMediatorApp} from "./mediators/CashSplashWinMediatorApp";
import {CashSplashConstantApp} from "./constants";

export class BonusCashSplashModuleApp extends ApplicationModule {
    public addInjections(kernel: IKernel): void {
        kernel.bind(BonusCashSplashModelApp)
            .asSingleton()
            .forceCreation()
            .asModel()
            .serverModel();

        kernel.bind(CashSplashActionApp)
            .asSingleton();

        kernel.bindView(CashSplashWinBoxViewApp)
            .toId(CashSplashConstantApp.layouts.cashSplashWinView);
        kernel.bindMediator(CashSplashWinMediatorApp)
            .toView(CashSplashWinBoxViewApp);
    }
}