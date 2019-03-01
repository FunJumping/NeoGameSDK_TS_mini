namespace BlackCat {

    export class sdkCallback {

        static getBalance: string = 'getBalanceRes'
        static getHeight: string = 'getHeightRes'
        static getUserInfo: string = 'getUserInfoRes'
        static getNetType: string = 'getNetTypeRes'
        
        // makeRawTransaction
        static makeRaw: string = 'makeRawTransactionRes'
        static invoke: string = 'invokescriptRes'

        // makeGasTransferMulti
        static makeGasTransferMulti: string = 'makeGasTransferMultiRes'

        // confirmAppNotifyRes
        static confirmAppNotify: string = 'confirmAppNotifyRes'

        static error(error: any, type: string, params, callback = null): void {
            let error_res: Result = new Result();
            error_res.err = true;
            error_res.info = error

            let callback_data = {
                params: params,
                res: error_res
            }
            sdkCallback.callback(error_res, type, callback_data, callback)
        }

        static succ(info: any, type: string, params, callback = null): void {
            let succ_res: Result = new Result()
            succ_res.err = false
            succ_res.info = info

            let callback_data = {
                params: params,
                res: succ_res
            }
            sdkCallback.callback(succ_res, type, callback_data, callback)
        }

        static res(res: Result, type: string, params, callback = null): void {
            let callback_data = {
                params: params,
                res: res
            }
            sdkCallback.callback(res, type, callback_data, callback)
        }

        private static callback(res: Result, type: string, callback_data, callback) {
            // listener回调
            try {
                Main.listenerCallback(type, callback_data);
            }
            catch (e) {
                console.log("[BlaCat]", '[sdkCallback]', '[callback]', 'sdk listener callback error, type =>', type, ', res =>', res, ', e =>', e)
            }
            // function回调
            try {
                if (callback) callback(res)
            }
            catch (e) {
                console.log("[BlaCat]", '[sdkCallback]', '[callback]', 'sdk function callback error, type =>', type, ', res =>', res, ', e =>', e)
            }
        }
    }
}

