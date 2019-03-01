
namespace BlackCat {

    export class SDK {

        private static is_init: boolean = false;
        private static main: Main;

        // SDK初始化
        static init(listener, lang = "cn"): void {
            console.log("[BlaCat]", '[SDK]', '[init]', 'start ...')
            if (SDK.is_init === false) {
                SDK.main = new Main();
                SDK.main.init(listener, lang);
            }
            SDK.is_init = true;
        }

        // 设置界面语言
        static setLang(type: string) {
            console.log("[BlaCat]", '[SDK]', '[setLang]', 'start ...')
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '[setLang]', '请先初始化init')
                return;
            }
            this.main.setLang(type);
        }

        // 显示主界面
        static showMain() {
            console.log("[BlaCat]", '[SDK]', '[showMain]', 'start ...')
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '[showMain]', '请先初始化init')
                return;
            }
            this.main.showMain()
        }

        // 显示icon
        static showIcon() {
            console.log("[BlaCat]", '[SDK]', '[showIcon]', 'start ...')
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '[showIcon]', '请先初始化init')
                return;
            }
            this.main.showIcon()
        }

        // 登录
        static login(callback = null) {
            console.log("[BlaCat]", '[SDK]', '[login]', 'start ...')
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '[login]', '请先初始化init')
                return;
            }
            SDK.main.start(callback);
        }

        // 合约读取
        static async invokescript(params, callback = null) {
            console.log("[BlaCat]", '[SDK]', '[invokescript]', 'start ...')
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '[invokescript]', '请先初始化init')
                return;
            }
            if (!SDK.main.isLogined()) {
                console.log("[BlaCat]", '[SDK]', '[invokescript]', '请先登录')
                this.showMain()
                return;
            }
            await SDK.main.invokescript(params, callback);
        }

        // 合约交易
        static async makeRawTransaction(params, callback = null) {
            console.log("[BlaCat]", '[SDK]', '[makeRawTransaction]', 'start ...')
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '[makeRawTransaction]', '请先初始化init')
                return;
            }
            if (!SDK.main.isLogined()) {
                console.log("[BlaCat]", '[SDK]', '[makeRawTransaction]', '请先登录')
                this.showMain()
                return;
            }
            await SDK.main.makeRawTransaction(params, callback);
        }

        // app确认notify
        static async confirmAppNotify(params, callback = null) {
            console.log("[BlaCat]", '[SDK]', '[confirmAppNotify]', 'start ...')
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '[confirmAppNotify]', '请先初始化init')
                return;
            }
            if (!SDK.main.isLogined()) {
                console.log("[BlaCat]", '[SDK]', '[confirmAppNotify]', '请先登录')
                return;
            }
            await SDK.main.confirmAppNotify(params, callback)
        }

        // 获取余额
        static async getBalance(callback = null) {
            console.log("[BlaCat]", '[SDK]', '[getBalance]', 'start ...')
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '[getBalance]', '请先初始化init')
                return;
            }
            if (!SDK.main.isLogined()) {
                console.log("[BlaCat]", '[SDK]', '[getBalance]', '请先登录')
                return;
            }
            await SDK.main.getBalance(null, callback);
        }

        // 获取高度
        static async getHeight(callback = null) {
            console.log("[BlaCat]", '[SDK]', '[getHeight]', 'start ...')
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '[getHeight]', '请先初始化init')
                return;
            }
            await SDK.main.getHeight(null, callback);
        }

        // 获取登录用户信息
        static getUserInfo(callback = null) {
            console.log("[BlaCat]", '[SDK]', '[getUserInfo]', 'start ...')
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '[getUserInfo]', '请先初始化init')
            }
            if (!SDK.main.isLogined()) {
                console.log("[BlaCat]", '[SDK]', '[getUserInfo]', '请先登录')
            }
            SDK.main.getUserInfo(null, callback)
        }

        // 通用转账
        static async makeTransfer(params, callback = null) {
            console.log("[BlaCat]", '[SDK]', '[makeTransfer]', 'start ...')
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '[makeTransfer]', '请先初始化init')
                return;
            }
            if (!SDK.main.isLogined()) {
                console.log("[BlaCat]", '[SDK]', '[makeTransfer]', '请先登录')
                this.showMain()
                return;
            }
            await SDK.main.makeTransfer(params, callback);
        }

        // gas转账（批量）
        static async makeGasTransferMulti(params, callback = null) {
            console.log("[BlaCat]", '[SDK]', '[makeGasTransferMulti]', 'start ...')
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '[makeGasTransferMulti]', '请先初始化init')
                return;
            }
            if (!SDK.main.isLogined()) {
                console.log("[BlaCat]", '[SDK]', '[makeGasTransferMulti]', '请先登录')
                this.showMain()
                return;
            }
            await SDK.main.makeGasTransferMulti(params, callback);
        }


        // 查询网络类型
        static getNetType(callback = null) {
            console.log("[BlaCat]", '[SDK]', '[getNetType]', 'start ...')
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '[getNetType]', '请先初始化init')
                return;
            }
            SDK.main.getNetType(null, callback)
        }

        // 设置默认网络
        static setDefaultNetType(type) {
            console.log("[BlaCat]", '[SDK]', '[setDefaultNetType]', 'start ...')
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '[setDefaultNetType]', '请先初始化init')
                return;
            }
            SDK.main.setDefaultNetType(type)
        }

        // 锁定网络
        static lockNet() {
            console.log("[BlaCat]", '[SDK]', '[lockNet]', 'start ...')
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '[lockNet]', '请先初始化init')
                return;
            }
            if (SDK.main.isLogined()) {
                console.log("[BlaCat]", '[SDK]', '[lockNet]', '请在登录前操作')
                return;
            }
            SDK.main.lockNet()
        }


    }

    export class Result {
        err: boolean;
        info: any;
    }
}