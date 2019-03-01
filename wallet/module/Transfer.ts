
namespace BlackCat {

    export class Transfer {

        private static transferCallback

        static async make(params, callback = null) {
            let coin_type = params.type
            let coin_type_first = ""
            if (params.hasOwnProperty('type_first') && params['type_first'] == "1") {
                coin_type_first = coin_type.charAt(0).toUpperCase() + coin_type.slice(1)
            }
            let coin_type_upper = coin_type.toUpperCase()
            params['nnc'] = Main.netMgr.getCoinTool()['id_'+coin_type_upper]

            // 类型检查
            if (!Main.viewMgr.payView.hasOwnProperty(coin_type)) {
                sdkCallback.error("unsupport type " + coin_type, "make"+coin_type_first+"TransferRes", params, callback)
                return
            }

            if (Main.viewMgr.mainView.isHidden()) {
                // 如果mainView隐藏，显示出来
                Main.viewMgr.mainView.show()
                Main.viewMgr.iconView.hidden()
            }

            // 判断余额
            if (Main.viewMgr.payView && Main.viewMgr.payView[coin_type] < Number(params.count)) {
                Main.showErrMsg('pay_not_enough_money')
                sdkCallback.error("not_enough_" + coin_type, "make"+coin_type_first+"TransferRes", params, callback)
                return
            }

            if (Main.isWalletOpen()) {
                // 打开钱包了
                // 记录回调，锁定状态，当前不接收makeTransfer请求了
                if (this.transferCallback) {
                    // 已经有请求在处理，返回
                    // Main.showErrMsg("请先确认或者取消上个交易请求再执行")
                    Main.showErrMsg(("main_wait_for_last_tran"))
                    sdkCallback.error("wait_for_last_tran", "make"+coin_type_first+"TransferRes", params, callback)
                    return;
                }
                this.transferCallback = callback;

                // 打开确认页

                var list = new walletLists();

                params['nnc'] = Main.netMgr.getCoinTool()['id_' + coin_type_upper]

                list.params = JSON.stringify(params);
                list.wallet = Main.user.info.wallet;
                list.icon = Main.appicon;
                list.name = Main.appname;
                list.ctm = Math.round(new Date().getTime() / 1000).toString();
                list.cnts = params.count.toString();
                list.type = "6";
                list.type_detail = PayTransferView.log_type_detail[coin_type]

                ViewTransferConfirm.list = list;
                ViewTransferConfirm.refer = ""
                ViewTransferConfirm.callback_params = params;

                ViewTransferConfirm.callback = async (params, net_fee) => {
                    console.log("[BlaCat]", '[Transfer]', '[make]', '交易确认..')

                    Main.viewMgr.change("ViewLoading")

                    // var net_fee = "0.00000001" // for test
                    // var net_fee = ViewTransferConfirm.net_fee

                    setTimeout(async () => {
                        try {
                            if (Main.netMgr.getCurrChain() == 2) {
                                if (Main.in_array(coin_type, ["gas", "neo"])) {
                                    // utxo
                                    var res: Result = await Main.netMgr.getCoinTool().rawTransaction(params.toaddr, Main.netMgr.getCoinTool()["id_" + coin_type_upper], params.count, Neo.Fixed8.fromNumber(Number(net_fee)));
                                }
                                else {
                                    // nep5
                                    var res: Result = await Main.netMgr.getCoinTool().nep5Transaction(Main.user.info.wallet, params.toaddr, Main.netMgr.getCoinTool()["id_" + coin_type_upper], params.count, net_fee);
                                }
                            }
                            
                            if (res.err == false) {
                                params.sbPushString = "transfer"
                                // 成功，上报
                                var logRes = await ApiTool.addUserWalletLogs(
                                    res.info,
                                    params.count.toString(),
                                    "6",
                                    JSON.stringify(params),
                                    net_fee,
                                    PayTransferView.log_type_detail[coin_type],
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

                            console.log("[BlaCat]", '[Transfer]', '[make'+coin_type_first+'Transfer]', 'ViewTransferConfirm.callback error, params => ', params, 'e => ', e.toString())
                        }

                        
                        Main.viewMgr.viewLoading.remove()

                        sdkCallback.res(res, "make"+coin_type_first+"TransferRes", params, this.transferCallback)
                        this.transferCallback = null;

                    }, 300);
                }
                ViewTransferConfirm.callback_cancel = () => {
                    console.log("[BlaCat]", '[Transfer]', '[make'+coin_type_first+'Transfer]', '交易取消..')

                    sdkCallback.error('cancel', "make"+coin_type_first+"TransferRes", params, this.transferCallback)
                    this.transferCallback = null;
                }
                Main.viewMgr.change("ViewTransferConfirm")

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = ""
                ViewWalletOpen.callback_params = params;
                ViewWalletOpen.callback_callback = callback;
                ViewWalletOpen.callback = (params, callback) => {
                    this["make"+coin_type_first+"Transfer"](params, callback)
                }
                ViewWalletOpen.callback_cancel = (params, callback) => {
                    sdkCallback.error('cancel', "make"+coin_type_first+"TransferRes", params, callback)
                }
                Main.viewMgr.change("ViewWalletOpen")
            }
        }

    }
}