

namespace BlackCat {

    export class AppNotify {


        static async confirm(params, callback = null) {
            await ApiTool.walletNotify(params.txid);

            sdkCallback.succ("1", sdkCallback.confirmAppNotify, params, callback)
            console.log("[BlaCat]", '[AppNotify]', '[confirm]', '确认成功..')
            
        }
        
    }
}


