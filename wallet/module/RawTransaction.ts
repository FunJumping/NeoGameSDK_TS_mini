
namespace BlackCat {

    export class RawTransaction {

        private static transactionCallback

        static async make(params, callback) {

            if (Main.isWalletOpen()) {
                // 打开钱包了
                let loginInfo: tools.LoginInfo = tools.LoginInfo.getCurrentLogin()

                // 获取网络类型
                let chain = Main.netMgr.getCurrChain()

                // 获取手续费配置
                let net_fee_config: any = Main.getFeeConfig(chain)
                

                // 检查手续费是否足够
                let hasEnoughFeeRes = Main.hasEnoughFee(params, net_fee_config, chain)

                // 执行交易确认
                if (Main.viewMgr.mainView.isHidden()) {
                    // 如果mainView隐藏，显示出来
                    Main.viewMgr.mainView.show()
                    Main.viewMgr.iconView.hidden()
                }

                // 记录回调，锁定状态，当前不接收makerawtransaction请求了
                if (this.transactionCallback) {
                    // 已经有请求在处理，返回
                    // Main.showErrMsg("请先确认或者取消上个交易请求再执行")
                    Main.showErrMsg("main_wait_for_last_tran")
                    sdkCallback.error('main_wait_for_last_tran', sdkCallback.makeRaw, params, callback)
                    return;
                }
                this.transactionCallback = callback;

                // 打开确认页

                var list = new walletLists();
                list.params = JSON.stringify(params);
                list.wallet = Main.user.info.wallet;
                list.icon = Main.appicon;
                list.name = Main.appname;
                list.ctm = Math.round(new Date().getTime() / 1000).toString();
                list.cnts = "0"
                list.type = "5"
                list.state = "0"

                ViewTransactionConfirm.list = list;
                ViewTransactionConfirm.refer = ""
                ViewTransactionConfirm.callback_params = params

                ViewTransactionConfirm.callback = async (params, trust, net_fee) => {
                    console.log("[BlaCat]", '[RawTransaction]', '[make]', '交易确认..')

                    Main.viewMgr.change("ViewLoading")

                    // var net_fee = "0.00000001" // for test
                    // var net_fee = ViewTransactionConfirm.net_fee

                    setTimeout(async () => {
                        try {
                            await this._make(params, trust, net_fee, this.transactionCallback)
                        }
                        catch (e) {
                            console.log("[BlaCat]", '[RawTransaction]', '[make]', '_make(params, trust, net_fee, this.transactionCallback) error, params => ', params, 'trust =>', trust, 'net_fee =>', net_fee, 'error => ', e.toString())
                        }
                        Main.viewMgr.viewLoading.remove()
                    }, 300);
                }
                ViewTransactionConfirm.callback_cancel = () => {
                    console.log("[BlaCat]", '[RawTransaction]', '[make]', '交易取消..')
                    sdkCallback.error('cancel', sdkCallback.makeRaw, params, this.transactionCallback)
                    this.transactionCallback = null;
                }
                Main.viewMgr.change("ViewTransactionConfirm")

            } else {
                // 未打开钱包

                if (Main.viewMgr.mainView.isHidden()) {
                    // 如果mainView隐藏，显示出来
                    Main.viewMgr.mainView.show()
                    Main.viewMgr.iconView.hidden()
                }

                ViewWalletOpen.refer = ""
                ViewWalletOpen.callback_params = params;
                ViewWalletOpen.callback_callback = callback;
                ViewWalletOpen.callback = (params, callback) => {
                    this.make(params, callback)
                }
                ViewWalletOpen.callback_cancel = (params, callback) => {
                    sdkCallback.error('cancel', sdkCallback.makeRaw, params, callback)
                }
                Main.viewMgr.change("ViewWalletOpen")
            }
        }
        // 对外接口：合约交易的私有函数
        private static async _make(params, trust: string = "0", net_fee: any, callback = null) {
            // 合约交易，延长钱包退出时间
            Main.setLiveTime()

            try {
                var res = await Main.wallet.makeRawTransaction(params, trust, net_fee);
            }
            catch (e) {
                var res = new Result()
                res.err = true
                res.info = e.toString()

                console.log("[BlaCat]", '[RawTransaction]', '[_make]', '_make(params, trust, net_fee) error, params => ', params, 'trust =>', trust, 'net_fee =>', net_fee, 'e => ', e.toString())
            }

            // 重新获取钱包记录
            await Main.viewMgr.payView.doGetWalletLists(1)

            // 回调
            sdkCallback.res(res, sdkCallback.makeRaw, params, callback)
            this.transactionCallback = null;
        }
    }
}