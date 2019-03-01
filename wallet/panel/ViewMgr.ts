namespace BlackCat {
    // 视图管理器
    export class ViewMgr {

        views: any; // 所有在mainView打开过的界面

        iconView: IconView; // 最小化界面
        mainView: MainView; // 主界面

        viewWalletOpen: ViewWalletOpen; // 打开钱包
        viewTransferCount: ViewTransferCount; // 输入交易cgas/cneo数量
        viewTransactionConfirm: ViewTransactionConfirm; // 交易确认框
        viewTransferConfirm: ViewTransferConfirm; // Gas交易确认框
        viewAlert: ViewAlert;//提示
        viewConfirm: ViewConfirm;//确认
        viewToast: ViewToast;//自动消失
        viewLoading: ViewLoading;//Loading

        walletView: WalletView; // 钱包界面
        walletCreateView: WalletCreateView; // 创建钱包
        walletCreateDownloadView: WalletCreateDownloadView
        walletImportView: WalletImportView; // 导入钱包

        payView: PayView; // 我的钱包页
        payListDetailView: PayListDetailView; // 钱包记录详细
        payListProcessView: PayListProcessView // 钱包处理中记录
        payListMoreView: PayListMoreView; // 更多记录

        personalCenterView: PersonalCenterView; //个人中心

        modifyNetworkLineView: ModifyNetworkLineView;//修改网络线路

        securityCenterView: SecurityCenterView; //安全中心
        autoLogoutWalletView: AutoLogoutWalletView; //自动登出钱包

        payWalletDetailView: PayWalletDetailView; // 钱包详情

        payReceivablesView: PayReceivablesView;//收款
        payTransferView: PayTransferView; // 转账


        viewConnecting: ViewConnecting; // 连接中



        constructor() {
            this.mainView = new MainView();
            this.mainView.start()

            this.views = {}
        }

        change(type: string) {
            switch (type) {
                // 打开钱包时输入密码界面
                case "ViewWalletOpen":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示打开钱包输入密码界面(' + type + ') ...')
                    if (!this.viewWalletOpen) {
                        this.viewWalletOpen = new ViewWalletOpen();
                        this.views[type] = this.viewWalletOpen;
                    }
                    this.viewWalletOpen.start()
                    break;
                // 输入cgas/cneo交易数量
                case "ViewTransferCount":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示输入交易数量界面(' + type + ') ...')
                    if (!this.viewTransferCount) {
                        this.viewTransferCount = new ViewTransferCount();
                        this.views[type] = this.viewTransferCount
                    }
                    this.viewTransferCount.start()
                    break;
                // 交易确认
                case "ViewTransactionConfirm":
                    console.log("[BlaCat]", '[viewMgr]', '[change]', '显示确认交易界面(' + type + ') ...')
                    if (!this.viewTransactionConfirm) {
                        this.viewTransactionConfirm = new ViewTransactionConfirm();
                        this.views[type] = this.viewTransactionConfirm
                    }
                    this.viewTransactionConfirm.start()
                    break;
                // 小图标
                case "IconView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示SDK图标(' + type + ') ...')
                    if (!this.iconView) {
                        this.iconView = new IconView();
                        this.views[type] = this.iconView
                    }
                    this.iconView.start()
                    break;

                // 绑定&导入钱包
                case "WalletView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示绑定&导入钱包(' + type + ') ...')
                    if (!this.walletView) {
                        this.walletView = new WalletView();
                        this.views[type] = this.walletView
                    }
                    this.walletView.start();
                    break;
                case "WalletCreateView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示新建钱包(' + type + ') ...')
                    if (!this.walletCreateView) {
                        this.walletCreateView = new WalletCreateView();
                        this.views[type] = this.walletCreateView
                    }
                    this.walletCreateView.start();
                    break;
                case "WalletCreateDownloadView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示新建钱包下载(' + type + ') ...')
                    if (!this.walletCreateDownloadView) {
                        this.walletCreateDownloadView = new WalletCreateDownloadView();
                        this.views[type] = this.walletCreateDownloadView
                    }
                    this.walletCreateDownloadView.start();
                    break;
                case "WalletImportView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示导入钱包(' + type + ') ...')
                    if (!this.walletImportView) {
                        this.walletImportView = new WalletImportView();
                        this.views[type] = this.walletImportView
                    }
                    this.walletImportView.start();
                    break;
                // 钱包页
                case "PayView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示钱包页(' + type + ') ...')
                    if (!this.payView) {
                        this.payView = new PayView();
                        this.views[type] = this.payView
                    }
                    this.payView.start();
                    break;
                case "PayListDetailView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示交易详情(' + type + ') ...')
                    if (!this.payListDetailView) {
                        this.payListDetailView = new PayListDetailView();
                        this.views[type] = this.payListDetailView
                    }
                    this.payListDetailView.start()
                    break;
                case "PayListMoreView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示更多记录(' + type + ') ...')
                    if (!this.payListMoreView) {
                        this.payListMoreView = new PayListMoreView();
                        this.views[type] = this.payListMoreView
                    }
                    this.payListMoreView.start()
                    break;
                case "PayListProcessView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示处理中记录(' + type + ') ...')
                    if (!this.payListProcessView) {
                        this.payListProcessView = new PayListProcessView();
                        this.views[type] = this.payListProcessView
                    }
                    this.payListProcessView.start()
                    break;
                case "PersonalCenterView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示个人中心(' + type + ') ...')
                    if (!this.personalCenterView) {
                        this.personalCenterView = new PersonalCenterView();
                        this.views[type] = this.personalCenterView
                    }
                    this.personalCenterView.start()
                    break;

                case "PayWalletDetailView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示钱包详情(' + type + ') ...')
                    if (!this.payWalletDetailView) {
                        this.payWalletDetailView = new PayWalletDetailView();
                        this.views[type] = this.payWalletDetailView
                    }
                    this.payWalletDetailView.start()
                    break;
                case "PayReceivablesView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示收款(' + type + ') ...')
                    if (!this.payReceivablesView) {
                        this.payReceivablesView = new PayReceivablesView();
                        this.views[type] = this.payReceivablesView
                    }
                    this.payReceivablesView.start()
                    break;
                case "PayTransferView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示转账(' + type + ') ...')
                    if (!this.payTransferView) {
                        this.payTransferView = new PayTransferView();
                        this.views[type] = this.payTransferView
                    }
                    this.payTransferView.start()
                    break;
                case "ViewAlert":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示提示(' + type + ') ...')
                    if (!this.viewAlert) {
                        this.viewAlert = new ViewAlert();
                        this.views[type] = this.viewAlert
                    }
                    this.viewAlert.start()
                    break;
                case "ViewConfirm":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示确认(' + type + ') ...')
                    if (!this.viewConfirm) {
                        this.viewConfirm = new ViewConfirm();
                        this.views[type] = this.viewConfirm
                    }
                    this.viewConfirm.start()
                    break;
                case "ViewToast":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示Toast(' + type + ') ...')
                    if (!this.viewToast) {
                        this.viewToast = new ViewToast();
                    }
                    this.viewToast.start()
                    break;
                case "ViewLoading":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示Loading(' + type + ') ...')
                    if (!this.viewLoading) {
                        this.viewLoading = new ViewLoading();
                        this.views[type] = this.viewLoading
                    }
                    this.viewLoading.start()
                    break;
                case "ViewTransferConfirm":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示转账确认(' + type + ') ...')
                    if (!this.viewTransferConfirm) {
                        this.viewTransferConfirm = new ViewTransferConfirm();
                        this.views[type] = this.viewTransferConfirm
                    }
                    this.viewTransferConfirm.start()
                    break;

                case "ModifyNetworkLineView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示修改网络线路(' + type + ') ...')
                    if (!this.modifyNetworkLineView) {
                        this.modifyNetworkLineView = new ModifyNetworkLineView()
                        this.views[type] = this.modifyNetworkLineView
                    }
                    this.modifyNetworkLineView.start()
                    break;
                case "SecurityCenterView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示安全中心(' + type + ') ...')
                    if (!this.securityCenterView) {
                        this.securityCenterView = new SecurityCenterView()
                        this.views[type] = this.securityCenterView
                    }
                    this.securityCenterView.start()
                    break;
                case "AutoLogoutWalletView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示自动登出钱包(' + type + ') ...')
                    if (!this.autoLogoutWalletView) {
                        this.autoLogoutWalletView = new AutoLogoutWalletView()
                        this.views[type] = this.autoLogoutWalletView
                    }
                    this.autoLogoutWalletView.start()
                    break;
                
                case "ViewConnecting":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示连接中(' + type + ') ...')
                    if (!this.viewConnecting) {
                        this.viewConnecting = new ViewConnecting();
                        this.views[type] = this.viewConnecting
                    }
                    this.viewConnecting.start()
                    break;
            }
        }


        removeAll() {
            // console.log(Main.viewMgr.mainView.div.childNodes)

            for (let className in this.views) {
                let v = this.views[className];

                console.log("[BlaCat]", '[ViewMgr]', '[removeAll]', 'view => ', v)

                switch (className) {
                    case "IconView":
                        v.reset()
                        break;
                    default:
                        if (v.isCreated) {
                            v.remove()
                        }
                        break;
                }
            }
        }
        // 更新视图
        update() {
            console.log("[BlaCat]", '[ViewMgr]', '[update]', 'start ...')

            for (let className in this.views) {
                let v = this.views[className];

                console.log("[BlaCat]", '[ViewMgr]', '[update]', 'v =>', v)
                switch (className) {
                    case "PayView":
                        if (v.isCreated) {
                            v.update()
                        }
                        break;
                    default:
                        if (v.isCreated && !v.isHidden()) {
                            v.update()
                        }
                        break;
                }
            }
        }

        // 更新余额
        updateBalance() {
            console.log("[BlaCat]", '[ViewMgr]', '[updateBalance]', 'start ...')

            for (let className in this.views) {
                let v = this.views[className];
                if (v.__proto__["updateBalance"]) {
                    v.updateBalance()
                }
            }
        }
    }
}