
namespace BlackCat {

    export class WalletListLogs {

        static logs = []

        static get_key() {
            return Main.wallet.wallet_addr + "_walletListLogs"
        }

        static get_array_key(txid) {
            for (let k =0; k< this.logs.length; k++) {
                if (this.logs[k]['txid'] == txid) {
                    return k
                }
            }
            return null
        }


        static get(txid: string = "") {
            if (this.logs.length == 0) {
                let key = this.get_key()
                let log_str = localStorage.getItem(key)
                if (log_str) {
                    try {
                        this.logs = JSON.parse(log_str)
                    }
                    catch (e) {
                        
                    }
                }
            }
            
            if (txid == "") {
                return this.logs
            }

            for (let k =0; k<this.logs.length; k++) {
                if (txid == this.logs[k]['txid']) {
                    return this.logs[k]
                }
            }
            return null
        }

        static add(info: walletLists) {
            this.logs = this.get()
            this.logs.push(info)
            localStorage.setItem(this.get_key(), JSON.stringify(this.logs))
        }

        static del(txid: string) {
            let k = this.get_array_key(txid)
            if (k != null) {
                this.logs.splice(k, 1);
                localStorage.setItem(this.get_key(), JSON.stringify(this.logs))
            }
        }

        static update(txid: string, info) {
            let key = this.get_array_key(txid)
            if (key != null) {
                for (let k in info) {
                    this.logs[key][k] = info[k]
                }
                localStorage.setItem(this.get_key(), JSON.stringify(this.logs))
            }
        }

    }
}