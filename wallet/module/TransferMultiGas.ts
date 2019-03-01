
namespace BlackCat {

    export class TransferMultiGas {

        private static transferMultiCallback

        static async make(params, callback = null) {
            if (Main.viewMgr.mainView.isHidden()) {
                // 如果mainView隐藏，显示出来
                Main.viewMgr.mainView.show()
                Main.viewMgr.iconView.hidden()
            }

            // 计算交易金额
            var _count: number = 0;
            for (let i = 0; i < params.length; i++) {
                // _count += Number(params[i].count)
                _count = floatNum.plus(_count, Number(params[i].count))
            }

            params[0]['nnc'] = Main.netMgr.getCoinTool().id_GAS

            // 判定余额
            if (Main.viewMgr.payView && Main.viewMgr.payView.gas < Number(_count)) {
                Main.showErrMsg('pay_not_enough_money')
                sdkCallback.error("not_enough_gas", sdkCallback.makeGasTransferMulti, params, callback)
                return
            }

            if (Main.isWalletOpen()) {
                // 打开钱包了
                // 记录回调，锁定状态，当前不接收makeGasTransferMulti请求了
                if (this.transferMultiCallback) {
                    // 已经有请求在处理，返回
                    // Main.showErrMsg("请先确认或者取消上个交易请求再执行")
                    Main.showErrMsg(("main_wait_for_last_tran"))
                    return;
                }
                this.transferMultiCallback = callback;

                // 打开确认页

                var list = new walletLists();

                list.params = JSON.stringify(params);
                list.wallet = Main.user.info.wallet;
                list.icon = Main.appicon;
                list.name = Main.appname;
                list.ctm = Math.round(new Date().getTime() / 1000).toString();
                list.cnts = _count.toString(); // params.count.toString();
                list.type = "6";
                list.type_detail = PayTransferView.log_type_detail['gas']

                ViewTransferConfirm.list = list;
                ViewTransferConfirm.refer = ""
                ViewTransferConfirm.callback_params = params;

                ViewTransferConfirm.callback = async (params, net_fee) => {
                    console.log("[BlaCat]", '[TransferMultiGas]', '[make]', '交易确认..')

                    Main.viewMgr.change("ViewLoading")

                    // var net_fee = "0.00000001" // for test

                    setTimeout(async () => {
                        try {
                            var res: Result = await Main.netMgr.getCoinTool().rawTransactionMulti(params, Main.netMgr.getCoinTool().id_GAS, Neo.Fixed8.fromNumber(Number(net_fee)));
                            if (res.err == false) {
                                params.map(item => (item.sbPushString = "transfer"))
                                // 成功，上报
                                await ApiTool.addUserWalletLogs(
                                    res.info,
                                    _count.toString(),
                                    "6",
                                    JSON.stringify(params),
                                    net_fee,
                                    "",
                                    "1"
                                );
                                // 重新获取钱包记录
                                await Main.viewMgr.payView.doGetWalletLists(1)
                            }
                        }
                        catch (e) {
                            var res: Result = new Result();
                            res.err = true;
                            res.info = 'make trans err'
                            res['ext'] = e.toString()

                            console.log("[BlaCat]", '[TransferMultiGas]', '[make]', 'ViewTransferConfirm.callback error, params => ', params, 'e => ', e.toString())
                        }

                        Main.viewMgr.viewLoading.remove()

                        sdkCallback.res(res,sdkCallback.makeGasTransferMulti, params, this.transferMultiCallback)
                        this.transferMultiCallback = null;

                    }, 300);
                }
                ViewTransferConfirm.callback_cancel = () => {
                    console.log("[BlaCat]", '[TransferMultiGas]', '[make]', '交易取消..')

                    sdkCallback.error('cancel', sdkCallback.makeGasTransferMulti, params, this.transferMultiCallback)
                    this.transferMultiCallback = null;

                }
                Main.viewMgr.change("ViewTransferConfirm")

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = ""
                ViewWalletOpen.callback_params = params;
                ViewWalletOpen.callback_callback = callback;
                ViewWalletOpen.callback = (params, callback) => {
                    this.make(params, callback)
                }
                ViewWalletOpen.callback_cancel = (params, callback) => {
                    sdkCallback.error('cancel', sdkCallback.makeGasTransferMulti, params, callback)
                }
                Main.viewMgr.change("ViewWalletOpen")
            }
        }
    }
}