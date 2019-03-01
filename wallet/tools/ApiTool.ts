namespace BlackCat {
    export class ApiTool {

        static api_version: string = "3";

        static base_url: string = ''


        static async isLogined() {
            let login = tools.LoginInfo.getCurrentLogin()
            if (login) {
                return true;
            }
            return false;
        }

        static addUserWalletLogs(txid: string, cnts: string, type: string, params: string, net_fee: string = "", type_detail: string = "0", sdk: string = "0") {
            let log = new walletLists()
            log.ctm = (Date.parse(new Date().toString())/1000).toString()
            log.state = "0"
            log.type = type
            log.type_detail = type_detail
            log.params = params
            log.txid = txid
            log.cnts = cnts
            log.net_fee = net_fee
            log.wallet = Main.user.info.wallet
            log['sdk'] = sdk
            
            WalletListLogs.add(log)
        }

        static getWalletListss(page: number, num: number, pedding: number) {
            
            let res: any = {r: "1", data: []}
            let logs = WalletListLogs.get()

            if (logs.length > 0) {
                if (pedding == 1) {
                    // 正在处理的
                    for (let k=logs.length - 1; k>=0; k--) {
                        let log = logs[k]
                        if (log['state'] != "1") {
                            res.data.push(log)
                        }
                    }
                }
                else {
                    // 处理完成的
                    let nums_end_idx = logs.length - page * num
                    let nums_start_idx = nums_end_idx + num - 1
                    if (nums_end_idx < 0) {
                        nums_end_idx = 0
                    }
                    if (nums_start_idx < 0) {
                        nums_start_idx = 0
                    }

                    for (let k = nums_start_idx; k>=nums_end_idx; k--) {
                        let log = logs[k]
                        if (log['state'] == "1") {
                            res.data.push(log)
                        }
                    }
                }
            }
            return res
        }

        static async walletNotify(txid: string) {
            let log = WalletListLogs.get(txid)
            if (log != null) {
                WalletListLogs.update(txid, {client_notify: "1"})
            }
        }

        static async getAppWalletNotifys() {
            let res: any = {r: "1", data: []}
            let logs = WalletListLogs.get()

            if (logs.length > 0) {
                for (let k=logs.length - 1; k>=0; k--) {
                    let log = logs[k]
                    if (log['sdk'] == "1" && log.client_notify == "0" && log.state != "0") {
                        res.data.push(log)
                    }
                }
            }
            return res
        }

        static async getPlatWalletNotifys(uid: string, token: string) {
            // return this.common('user_wallet.get_notify_plat', { uid: uid, token: token})
        }

        static async walletNotifyExt(txid: string, ext: string) {
            let log = WalletListLogs.get(txid)
            if (log) {
                WalletListLogs.update(txid, {ext: ext})
            }
        }
    }
}