/// <reference path="../wallet/tools/neo-ts.d.ts" />
declare const QrCodeWithLogo: any;
declare namespace BlackCat {
    class Main {
        private static isCreated;
        static isStart: boolean;
        static readonly platName: string;
        static platLoginType: number;
        static randNumber: number;
        static tsOffset: number;
        static urlHead: string;
        static resHost: string;
        static appname: string;
        static appicon: string;
        static appcoin: string;
        static applang: string;
        static apprefer: string;
        static app_recharge_addr: string;
        private static app_trust;
        static user: User;
        static wallet: tools.wallet;
        static viewMgr: ViewMgr;
        static langMgr: LangMgr;
        static netMgr: NetMgr;
        static walletLogId: number;
        static appWalletLogId: number;
        static appWalletNotifyId: number;
        static needGetAppNotifys: boolean;
        static appNotifyTxids: any;
        static platWalletLogId: number;
        static platWalletNotifyId: number;
        static needGetPlatNotifys: boolean;
        static platNotifyTxids: any;
        private static callback;
        private static loginFunctionCallback;
        private static isLoginCallback;
        private static s_update;
        private static update_timeout_max;
        private static update_timeout_min;
        private static liveTime;
        private static liveTimeMax;
        constructor();
        static reset(type?: number): void;
        static clearTimeout(): void;
        static getCGASBalanceByAddress(id_CGAS: string, address: string): Promise<number>;
        static getCGAS_OLDBalanceByAddress(id_CGAS: string, address: string): Promise<number>;
        static getCNEOBalanceByAddress(id_CNEO: string, address: string): Promise<number>;
        static getCNEO_OLDBalanceByAddress(id_CNEO: string, address: string): Promise<number>;
        static getNep5BalanceByAddressNeo(id_hash: string, address: string, bits?: number): Promise<number>;
        init(listener: Function, lang: string): void;
        start(callback?: Function): Promise<void>;
        setLang(type: string): void;
        setDefaultNetType(type: number): void;
        lockNet(): void;
        showMain(): void;
        showIcon(): void;
        getBalance(params: any, callback: any): Promise<void>;
        getUserInfo(params: any, callback: any): void;
        getNetType(params: any, callback: any): void;
        getHeight(params: any, callback: any): Promise<void>;
        invokescript(params: any, callback: any): Promise<void>;
        makeRawTransaction(params: any, callback: any): Promise<void>;
        makeTransfer(params: any, callback?: any): Promise<void>;
        makeGasTransferMulti(params: any, callback?: any): Promise<void>;
        confirmAppNotify(params: any, callback: any): Promise<void>;
        static loginCallback(): Promise<void>;
        private static setGameInfo(param);
        isLogined(): boolean;
        static logoutCallback(): Promise<void>;
        static listenerCallback(cmd: any, data: any): Promise<void>;
        static update(): Promise<void>;
        static getRawTransaction(txid: any): Promise<void>;
        static getNotifys(): void;
        private static doPlatNotify(params);
        static continueWithOpenWallet(): Promise<void>;
        private static doPlatNotiyRefund(params);
        private static doPlatNotifyTransferRes(params, txid);
        private static doPlatNotifyRefundRes(params, txid);
        private static confirmPlatNotify(params);
        private static confirmPlatNotifyExt(params, ext);
        static changeNetType(type: number): void;
        static changeChainType(type: number, callback?: any): void;
        static getUrlParam(name: any): string;
        static validateLogin(): Promise<void>;
        static showErrCode(errCode: number, callback?: any): Promise<void>;
        static showErrMsg(errMsgKey: string, callback?: any, content_ext?: any): Promise<void>;
        static showToast(msgKey: string, showTime?: number): Promise<void>;
        static showInfo(msgKey: string, callback?: any, content_ext?: any): Promise<void>;
        static showConFirm(msgKey: string): Promise<void>;
        static showLoading(msgKey: string): Promise<void>;
        static isWalletOpen(): boolean;
        static isLoginInit(): boolean;
        static validateFormat(type: string, inputElement: HTMLInputElement | HTMLTextAreaElement): Promise<string | boolean>;
        static getDate(timeString: string): string;
        static getObjectClass(obj: any): any;
        static getUnTrustNnc(params: any): Array<string>;
        static setLiveTime(): void;
        static setLiveTimeMax(minutes: number): void;
        static getLiveTimeMax(): number;
        static getStringNumber(num: number): string;
        private static setTsOffset(loginParam);
        private static getUrlHead();
        static randomSort(arr: any, newArr: any): any;
        static check(): string;
        static in_array(search: any, array: Array<any>): boolean;
        static getFeeConfig(chain: number): any;
        static hasEnoughFee(params: any, net_fee: any, chain: number): boolean;
    }
}
declare namespace BlackCat {
    class ComponentBase {
        objCreate(tag: string): HTMLElement;
        ObjAppend(o: any, tag: HTMLElement): void;
        objRemove(o: any, tag: HTMLElement): void;
        parentAdd(tag: HTMLElement): void;
        parentRemove(tag: HTMLElement): void;
        bodyAppend(tag: HTMLElement): void;
        bodyRemove(tag: HTMLElement): void;
    }
}
declare namespace BlackCat {
    class NetFeeComponent {
        private chain;
        private netFeeComponet;
        constructor(parentDiv: any, callback: any);
        setFeeDefault(net_fee?: string): void;
        setNetFeeShowRate(rate?: number): void;
        setGasLimitMin(value: number): void;
        createDiv(): void;
        hidden(): void;
        show(): void;
    }
}
declare namespace BlackCat {
    class NetFeeComponentNeo extends ComponentBase {
        private parentDiv;
        private mainDiv;
        private inputcharge;
        private divSpeedtips;
        private divSpeedLength;
        private net_fee;
        private net_fees;
        private net_fee_show_rate;
        private callback;
        constructor(parentDiv: any, callback: any);
        setFeeDefault(): void;
        setNetFeeShowRate(rate?: number): void;
        createDiv(): void;
        hidden(): void;
        show(): void;
        private getNetFeesIdx(net_fee);
        private dofree();
        private dospeed(net_fee?);
        private showNetFee();
    }
}
declare namespace BlackCat {
    class LangBase {
        lang: any;
        get(key: string): any;
    }
}
declare namespace BlackCat {
    class LangCN extends LangBase {
        lang: {
            return: string;
            copy: string;
            ok: string;
            cancel: string;
            more: string;
            info: string;
            content: string;
            retry: string;
            cgas: string;
            gas: string;
            neo: string;
            cneo: string;
            main_walletaddr_format_err: string;
            main_ETHWallet_format_err: string;
            main_BTCWallet_format_err: string;
            main_NEOWallet_format_err: string;
            personalcenter: string;
            myinfo_security: string;
            myinfo_set: string;
            myinfo_logout: string;
            myinfo_logoutConfirm: string;
            modifyNet: string;
            modifyNet_succ: string;
            modifyNet_node_err: string;
            security_title: string;
            security_walletOut: string;
            security_walletOut_admin: string;
            security_walletOut_admin_m: string;
            security_walletOut_admin_h: string;
            security_walletOut_toast: string;
            paylist_txid: string;
            paylist_wallet: string;
            paylist_nnc: string;
            paylist_sbParamJson: string;
            paylist_sbPushString: string;
            paylist_sbPushString_none: string;
            paylist_ctm_year: string;
            paylist_ctm_month: string;
            paylist_ctm_day: string;
            paylist_ctm_hour: string;
            paylist_ctm_minute: string;
            paylist_ctm_recent: string;
            paylist_noMore: string;
            paylist_getMore: string;
            paylist_noRecord: string;
            pay_received: string;
            pc_receivables_download: string;
            pc_receivables_address: string;
            pc_receivables_copy: string;
            pay_transfer: string;
            pay_transferType: string;
            pay_transferBalance: string;
            pay_transferToAddr: string;
            pay_transferCount: string;
            pay_transferToAddrError: string;
            pay_transferCountError: string;
            pay_transferDoSucc: string;
            pay_transferDoFail: string;
            pay_transferDoFailErr: string;
            pay_transferGasNotEnough: string;
            pay_transferBCPNotEnough: string;
            pay_transferBCTNotEnough: string;
            pay_transferNEONotEnough: string;
            pay_transferCNEONotEnough: string;
            pay_transferCGASNotEnough: string;
            pay_transferETHNotEnough: string;
            pay_transferBTCNotEnough: string;
            pay_wallet: string;
            pay_refresh: string;
            pay_wallet_detail: string;
            pay_coin_name: string;
            pay_coin_old: string;
            pay_chain_1: string;
            pay_chain_2: string;
            pay_gas: string;
            pay_gas_desc_2: string;
            pay_gas_desc_1: string;
            pay_cgas: string;
            pay_cgas_desc: string;
            pay_neo: string;
            pay_neo_desc_2: string;
            pay_neo_desc_1: string;
            pay_cneo: string;
            pay_cneo_desc: string;
            pay_bct_desc: string;
            pay_bcp_desc: string;
            pay_btc: string;
            pay_btc_desc: string;
            pay_eth: string;
            pay_eth_desc: string;
            pay_send: string;
            pay_purchase: string;
            pay_purchase_testnet_cant_buy: string;
            pay_makeMint: string;
            pay_recentLists: string;
            pay_more: string;
            pay_makeMintGasNotEnough: string;
            pay_makeMintNeoNotEnough: string;
            pay_makeMintDoFail: string;
            pay_makeMintDoFail2: string;
            pay_makeRefundCgasNotEnoughUtxo: string;
            pay_makeRefundCneoNotEnoughUtxo: string;
            pay_makeRefundCgasNotEnough: string;
            pay_makeRefundCneoNotEnough: string;
            pay_makeRefundGasFeeNotEnough: string;
            pay_makeRefundGasLessThanFee: string;
            pay_makeRefundDoFail: string;
            pay_makeRefundDoFail2: string;
            pay_makeRefundGetScriptFail: string;
            pay_makeRefundCgasOldNotEnough: string;
            pay_makeRefundCneoOldNotEnough: string;
            pay_makeMintGasUtxoCountsLimit: string;
            pay_makeMintNeoUtxoCountsLimit: string;
            pay_walletbtn: string;
            pay_assets: string;
            pay_get: string;
            pay_not_enough_money: string;
            pay_not_enough_utxo: string;
            pay_nettype_1: string;
            pay_nettype_2: string;
            payview_process: string;
            pay_walletDetail: string;
            pay_walletDetail_addr: string;
            pay_walletDetail_key: string;
            pay_walletDetail_hex: string;
            pay_walletDetail_wif: string;
            pay_walletDetail_notice: string;
            pay_walletDetail_export: string;
            pay_makerawtrans_err: string;
            pay_makerawtrans_fee_less: string;
            pay_makerawtrans_fee_less_gaslimit: string;
            addressbook_title: string;
            addressbook_search: string;
            addressbook_det_title: string;
            addressbook_det_transfer: string;
            addressbook_det_address: string;
            addressbook_det_download: string;
            addressbook_det_describe: string;
            addressbook_det_empty: string;
            addressbook_det_del: string;
            addressbook_det_del_title: string;
            addressbook_det_del_tips: string;
            addressbook_det_del_succ: string;
            addressbook_op_button: string;
            addressbook_op_name: string;
            addressbook_op_inputName: string;
            addressbook_op_inputName_err: string;
            addressbook_op_address: string;
            addressbook_op_inputAddress: string;
            addressbook_op_inputAddress_err: string;
            addressbook_op_describe: string;
            addressbook_op_inputDescribe: string;
            addressbook_op_inputDescribe_err: string;
            addressbook_op_addSucc: string;
            addressbook_op_updateSucc: string;
            pay_exchange_bct: string;
            pay_exchange_cgas: string;
            pay_exchange_purchase: string;
            pay_exchange_price: string;
            pay_exchange_balance: string;
            pay_exchange_balance_not_enough: string;
            pay_exchange_range: string;
            pay_exchange_buy_ok: string;
            pay_exchange_consumption: string;
            pay_exchange_placeholderconfirm: string;
            pay_exchange_confirmbuy: string;
            pay_exchange_purchase_process: string;
            pay_exchange_processp1: string;
            pay_exchange_refund_transfer: string;
            pay_exchange_refund_all: string;
            pay_exchange_refund_transCount_cost: string;
            pay_exchange_refund_address: string;
            pay_exchange_refund_address_error: string;
            pay_exchange_refund_amount: string;
            pay_exchange_refund_amount_error: string;
            pay_exchange_refund_not_enough: string;
            pay_exchange_refund_gas_fee_error: string;
            pay_exchange_refund_do_succ: string;
            pay_exchange_refund_do_fail: string;
            pay_exchange_refund_range_tips: string;
            pay_exchange_refund_fee_tips: string;
            pay_exchange_bcp: string;
            pay_exchange_create_wallet_fail: string;
            pay_exchange_detail_buy_CGAS_fail: string;
            pay_exchange_detail_buy_BCP_fail: string;
            pay_exchange_buyNEO: string;
            pay_exchange_spent_not_enough: string;
            pay_exchange_getmore: string;
            pay_makeRecharge: string;
            pay_trust_tips: string;
            pay_trust_Vice_tips: string;
            pay_transfer_toaddr: string;
            pay_transfer_count: string;
            pay_transCount_count: string;
            pay_transCount_inputCount: string;
            pay_transCount_err: string;
            pay_transCountGAS: string;
            pay_transCountCGAS: string;
            pay_transCountCGASOLD: string;
            pay_transCountCGAS2GAS: string;
            pay_transCountGAS2CGAS: string;
            pay_transCountCGASOLD2OLD: string;
            pay_transCountNEO: string;
            pay_transCountCNEO: string;
            pay_transCountCNEOOLD: string;
            pay_transCountCNEO2NEO: string;
            pay_transCountNEO2CNEO: string;
            pay_transCountCNEOOLD2OLD: string;
            pay_transCountTips_free: string;
            pay_transCountTips_slow: string;
            pay_transCountTips_fast: string;
            pay_transCount_speed: string;
            pay_transCount_cost: string;
            pay_transCount_tips: string;
            pay_transCount_tips_err: string;
            pay_walletOpen_password: string;
            pay_walletOpen_inputPassword: string;
            pay_walletOpen_inputPassword_err: string;
            pay_walletOpen_file_error: string;
            pay_walletOpen_openFail: string;
            walletCreate_create: string;
            walletCreate_password: string;
            walletCreate_vpass: string;
            walletCreate_password_notice: string;
            walletCreate_doCreate: string;
            walletCreate_check_pass: string;
            walletCreate_check_vpass: string;
            walletCreate_check_exceed: string;
            walletImport_invalid_file: string;
            walletImport_select_file: string;
            walletImport_import: string;
            walletImport_password: string;
            walletImport_doImport: string;
            walletImport_bind_succ: string;
            walletView_info: string;
            walletView_create: string;
            walletView_import: string;
            walletCreate_download: string;
            walletCreate_doDownload: string;
            main_wait_for_last_tran: string;
            main_no_app_wallet: string;
            main_need_open_wallet_confirm: string;
            main_refund_CGAS_second_fail: string;
            main_refund_CNEO_second_fail: string;
            main_refund_getScript_err: string;
            main_refund_sendRequest_err: string;
            main_refund_doFail: string;
            main_broker_deposit_second_fail: string;
            errCode_default: string;
            wallet_open_check: string;
            wallet_open_check_otcgo: string;
            wallet_open_check_otcgo_pwd: string;
            netmgr_select_api_slow: string;
            netmgr_select_node_slow: string;
            netmgr_select_cli_slow: string;
            netmgr_connecting: string;
            netmgr_connecting_fail: string;
        };
    }
}
declare namespace BlackCat {
    class LangEN extends LangBase {
        lang: {
            return: string;
            copy: string;
            ok: string;
            cancel: string;
            more: string;
            info: string;
            content: string;
            retry: string;
            cgas: string;
            gas: string;
            neo: string;
            cneo: string;
            main_walletaddr_format_err: string;
            main_ETHWallet_format_err: string;
            main_BTCWallet_format_err: string;
            main_NEOWallet_format_err: string;
            personalcenter: string;
            myinfo_security: string;
            myinfo_set: string;
            myinfo_logout: string;
            myinfo_logoutConfirm: string;
            modifyNet: string;
            modifyNet_succ: string;
            modifyNet_node_err: string;
            security_title: string;
            security_walletOut: string;
            security_walletOut_admin: string;
            security_walletOut_admin_m: string;
            security_walletOut_admin_h: string;
            security_walletOut_toast: string;
            paylist_txid: string;
            paylist_wallet: string;
            paylist_nnc: string;
            paylist_sbParamJson: string;
            paylist_sbPushString: string;
            paylist_sbPushString_none: string;
            paylist_ctm_year: string;
            paylist_ctm_month: string;
            paylist_ctm_day: string;
            paylist_ctm_hour: string;
            paylist_ctm_minute: string;
            paylist_ctm_recent: string;
            paylist_noMore: string;
            paylist_getMore: string;
            paylist_noRecord: string;
            pay_received: string;
            pc_receivables_download: string;
            pc_receivables_address: string;
            pc_receivables_copy: string;
            pay_transfer: string;
            pay_transferType: string;
            pay_transferBalance: string;
            pay_transferToAddr: string;
            pay_transferCount: string;
            pay_transferToAddrError: string;
            pay_transferCountError: string;
            pay_transferDoSucc: string;
            pay_transferDoFail: string;
            pay_transferDoFailErr: string;
            pay_transferGasNotEnough: string;
            pay_transferBCPNotEnough: string;
            pay_transferBCTNotEnough: string;
            pay_transferNEONotEnough: string;
            pay_transferCNEONotEnough: string;
            pay_transferCGASNotEnough: string;
            pay_transferETHNotEnough: string;
            pay_transferBTCNotEnough: string;
            pay_wallet: string;
            pay_refresh: string;
            pay_wallet_detail: string;
            pay_coin_name: string;
            pay_coin_old: string;
            pay_chain_1: string;
            pay_chain_2: string;
            pay_gas: string;
            pay_gas_desc_2: string;
            pay_gas_desc_1: string;
            pay_cgas: string;
            pay_cgas_desc: string;
            pay_neo: string;
            pay_neo_desc_2: string;
            pay_neo_desc_1: string;
            pay_cneo: string;
            pay_cneo_desc: string;
            pay_bct_desc: string;
            pay_bcp_desc: string;
            pay_btc: string;
            pay_btc_desc: string;
            pay_eth: string;
            pay_eth_desc: string;
            pay_send: string;
            pay_purchase: string;
            pay_purchase_testnet_cant_buy: string;
            pay_makeMint: string;
            pay_recentLists: string;
            pay_more: string;
            pay_makeMintGasNotEnough: string;
            pay_makeMintNeoNotEnough: string;
            pay_makeMintDoFail: string;
            pay_makeMintDoFail2: string;
            pay_makeRefundCgasNotEnoughUtxo: string;
            pay_makeRefundCneoNotEnoughUtxo: string;
            pay_makeRefundCgasNotEnough: string;
            pay_makeRefundCneoNotEnough: string;
            pay_makeRefundGasFeeNotEnough: string;
            pay_makeRefundGasLessThanFee: string;
            pay_makeRefundDoFail: string;
            pay_makeRefundDoFail2: string;
            pay_makeRefundGetScriptFail: string;
            pay_makeRefundCgasOldNotEnough: string;
            pay_makeRefundCneoOldNotEnough: string;
            pay_makeMintGasUtxoCountsLimit: string;
            pay_makeMintNeoUtxoCountsLimit: string;
            pay_walletbtn: string;
            pay_assets: string;
            pay_get: string;
            pay_not_enough_money: string;
            pay_not_enough_utxo: string;
            pay_nettype_1: string;
            pay_nettype_2: string;
            payview_process: string;
            pay_walletDetail: string;
            pay_walletDetail_addr: string;
            pay_walletDetail_key: string;
            pay_walletDetail_hex: string;
            pay_walletDetail_wif: string;
            pay_walletDetail_notice: string;
            pay_walletDetail_export: string;
            pay_makerawtrans_err: string;
            pay_makerawtrans_fee_less: string;
            pay_makerawtrans_fee_less_gaslimit: string;
            addressbook_title: string;
            addressbook_search: string;
            addressbook_det_title: string;
            addressbook_det_transfer: string;
            addressbook_det_address: string;
            addressbook_det_download: string;
            addressbook_det_describe: string;
            addressbook_det_empty: string;
            addressbook_det_del: string;
            addressbook_det_del_title: string;
            addressbook_det_del_tips: string;
            addressbook_det_del_succ: string;
            addressbook_op_button: string;
            addressbook_op_name: string;
            addressbook_op_inputName: string;
            addressbook_op_inputName_err: string;
            addressbook_op_address: string;
            addressbook_op_inputAddress: string;
            addressbook_op_inputAddress_err: string;
            addressbook_op_describe: string;
            addressbook_op_inputDescribe: string;
            addressbook_op_inputDescribe_err: string;
            addressbook_op_addSucc: string;
            addressbook_op_updateSucc: string;
            pay_exchange_bct: string;
            pay_exchange_cgas: string;
            pay_exchange_purchase: string;
            pay_exchange_price: string;
            pay_exchange_balance: string;
            pay_exchange_balance_not_enough: string;
            pay_exchange_range: string;
            pay_exchange_buy_ok: string;
            pay_exchange_consumption: string;
            pay_exchange_placeholderconfirm: string;
            pay_exchange_confirmbuy: string;
            pay_exchange_purchase_process: string;
            pay_exchange_processp1: string;
            pay_exchange_refund_transfer: string;
            pay_exchange_refund_all: string;
            pay_exchange_refund_transCount_cost: string;
            pay_exchange_refund_address: string;
            pay_exchange_refund_address_error: string;
            pay_exchange_refund_amount: string;
            pay_exchange_refund_amount_error: string;
            pay_exchange_refund_not_enough: string;
            pay_exchange_refund_gas_fee_error: string;
            pay_exchange_refund_do_succ: string;
            pay_exchange_refund_do_fail: string;
            pay_exchange_refund_range_tips: string;
            pay_exchange_refund_fee_tips: string;
            pay_exchange_bcp: string;
            pay_exchange_create_wallet_fail: string;
            pay_exchange_detail_buy_CGAS_fail: string;
            pay_exchange_detail_buy_BCP_fail: string;
            pay_exchange_buyNEO: string;
            pay_exchange_spent_not_enough: string;
            pay_exchange_getmore: string;
            pay_makeRecharge: string;
            pay_trust_tips: string;
            pay_trust_Vice_tips: string;
            pay_transfer_toaddr: string;
            pay_transfer_count: string;
            pay_transCount_count: string;
            pay_transCount_inputCount: string;
            pay_transCount_err: string;
            pay_transCountGAS: string;
            pay_transCountCGAS: string;
            pay_transCountCGASOLD: string;
            pay_transCountCGAS2GAS: string;
            pay_transCountGAS2CGAS: string;
            pay_transCountCGASOLD2OLD: string;
            pay_transCountNEO: string;
            pay_transCountCNEO: string;
            pay_transCountCNEOOLD: string;
            pay_transCountCNEO2NEO: string;
            pay_transCountNEO2CNEO: string;
            pay_transCountCNEOOLD2OLD: string;
            pay_transCountTips_free: string;
            pay_transCountTips_slow: string;
            pay_transCountTips_fast: string;
            pay_transCount_speed: string;
            pay_transCount_cost: string;
            pay_transCount_tips: string;
            pay_transCount_tips_err: string;
            pay_walletOpen_password: string;
            pay_walletOpen_inputPassword: string;
            pay_walletOpen_inputPassword_err: string;
            pay_walletOpen_file_error: string;
            pay_walletOpen_openFail: string;
            walletCreate_create: string;
            walletCreate_password: string;
            walletCreate_vpass: string;
            walletCreate_password_notice: string;
            walletCreate_doCreate: string;
            walletCreate_check_pass: string;
            walletCreate_check_vpass: string;
            walletCreate_check_exceed: string;
            walletImport_invalid_file: string;
            walletImport_select_file: string;
            walletImport_import: string;
            walletImport_password: string;
            walletImport_doImport: string;
            walletImport_bind_succ: string;
            walletView_info: string;
            walletView_create: string;
            walletView_import: string;
            walletCreate_download: string;
            walletCreate_doDownload: string;
            main_wait_for_last_tran: string;
            main_no_app_wallet: string;
            main_need_open_wallet_confirm: string;
            main_refund_CGAS_second_fail: string;
            main_refund_CNEO_second_fail: string;
            main_refund_getScript_err: string;
            main_refund_sendRequest_err: string;
            main_refund_doFail: string;
            main_broker_deposit_second_fail: string;
            errCode_default: string;
            wallet_open_check: string;
            wallet_open_check_otcgo: string;
            wallet_open_check_otcgo_pwd: string;
            netmgr_select_api_slow: string;
            netmgr_select_node_slow: string;
            netmgr_select_cli_slow: string;
            netmgr_connecting: string;
            netmgr_connecting_fail: string;
        };
    }
}
declare namespace BlackCat {
    class LangJP extends LangBase {
        lang: {
            return: string;
            copy: string;
            ok: string;
            cancel: string;
            more: string;
            info: string;
            content: string;
            retry: string;
            cgas: string;
            gas: string;
            neo: string;
            cneo: string;
            main_walletaddr_format_err: string;
            main_ETHWallet_format_err: string;
            main_BTCWallet_format_err: string;
            main_NEOWallet_format_err: string;
            personalcenter: string;
            myinfo_security: string;
            myinfo_set: string;
            myinfo_logout: string;
            myinfo_logoutConfirm: string;
            modifyNet: string;
            modifyNet_succ: string;
            modifyNet_node_err: string;
            security_title: string;
            security_walletOut: string;
            security_walletOut_admin: string;
            security_walletOut_admin_m: string;
            security_walletOut_admin_h: string;
            security_walletOut_toast: string;
            paylist_txid: string;
            paylist_wallet: string;
            paylist_nnc: string;
            paylist_sbParamJson: string;
            paylist_sbPushString: string;
            paylist_sbPushString_none: string;
            paylist_ctm_year: string;
            paylist_ctm_month: string;
            paylist_ctm_day: string;
            paylist_ctm_hour: string;
            paylist_ctm_minute: string;
            paylist_ctm_recent: string;
            paylist_noMore: string;
            paylist_getMore: string;
            paylist_noRecord: string;
            pay_received: string;
            pc_receivables_download: string;
            pc_receivables_address: string;
            pc_receivables_copy: string;
            pay_transfer: string;
            pay_transferType: string;
            pay_transferBalance: string;
            pay_transferToAddr: string;
            pay_transferCount: string;
            pay_transferToAddrError: string;
            pay_transferCountError: string;
            pay_transferDoSucc: string;
            pay_transferDoFail: string;
            pay_transferDoFailErr: string;
            pay_transferGasNotEnough: string;
            pay_transferBCPNotEnough: string;
            pay_transferBCTNotEnough: string;
            pay_transferNEONotEnough: string;
            pay_transferCNEONotEnough: string;
            pay_transferCGASNotEnough: string;
            pay_transferETHNotEnough: string;
            pay_transferBTCNotEnough: string;
            pay_wallet: string;
            pay_refresh: string;
            pay_wallet_detail: string;
            pay_coin_name: string;
            pay_coin_old: string;
            pay_chain_1: string;
            pay_chain_2: string;
            pay_gas: string;
            pay_gas_desc_2: string;
            pay_gas_desc_1: string;
            pay_cgas: string;
            pay_cgas_desc: string;
            pay_neo: string;
            pay_neo_desc_2: string;
            pay_neo_desc_1: string;
            pay_cneo: string;
            pay_cneo_desc: string;
            pay_bct_desc: string;
            pay_bcp_desc: string;
            pay_btc: string;
            pay_btc_desc: string;
            pay_eth: string;
            pay_eth_desc: string;
            pay_send: string;
            pay_purchase: string;
            pay_purchase_testnet_cant_buy: string;
            pay_makeMint: string;
            pay_recentLists: string;
            pay_more: string;
            pay_makeMintGasNotEnough: string;
            pay_makeMintNeoNotEnough: string;
            pay_makeMintDoFail: string;
            pay_makeMintDoFail2: string;
            pay_makeRefundCgasNotEnoughUtxo: string;
            pay_makeRefundCneoNotEnoughUtxo: string;
            pay_makeRefundCgasNotEnough: string;
            pay_makeRefundCneoNotEnough: string;
            pay_makeRefundGasFeeNotEnough: string;
            pay_makeRefundGasLessThanFee: string;
            pay_makeRefundDoFail: string;
            pay_makeRefundDoFail2: string;
            pay_makeRefundGetScriptFail: string;
            pay_makeRefundCgasOldNotEnough: string;
            pay_makeRefundCneoOldNotEnough: string;
            pay_makeMintGasUtxoCountsLimit: string;
            pay_makeMintNeoUtxoCountsLimit: string;
            pay_walletbtn: string;
            pay_assets: string;
            pay_get: string;
            pay_not_enough_money: string;
            pay_not_enough_utxo: string;
            pay_nettype_1: string;
            pay_nettype_2: string;
            payview_process: string;
            pay_walletDetail: string;
            pay_walletDetail_addr: string;
            pay_walletDetail_key: string;
            pay_walletDetail_hex: string;
            pay_walletDetail_wif: string;
            pay_walletDetail_notice: string;
            pay_walletDetail_export: string;
            pay_makerawtrans_err: string;
            pay_makerawtrans_fee_less: string;
            pay_makerawtrans_fee_less_gaslimit: string;
            addressbook_title: string;
            addressbook_search: string;
            addressbook_det_title: string;
            addressbook_det_transfer: string;
            addressbook_det_address: string;
            addressbook_det_download: string;
            addressbook_det_describe: string;
            addressbook_det_empty: string;
            addressbook_det_del: string;
            addressbook_det_del_title: string;
            addressbook_det_del_tips: string;
            addressbook_det_del_succ: string;
            addressbook_op_button: string;
            addressbook_op_name: string;
            addressbook_op_inputName: string;
            addressbook_op_inputName_err: string;
            addressbook_op_address: string;
            addressbook_op_inputAddress: string;
            addressbook_op_inputAddress_err: string;
            addressbook_op_describe: string;
            addressbook_op_inputDescribe: string;
            addressbook_op_inputDescribe_err: string;
            addressbook_op_addSucc: string;
            addressbook_op_updateSucc: string;
            pay_exchange_bct: string;
            pay_exchange_cgas: string;
            pay_exchange_purchase: string;
            pay_exchange_price: string;
            pay_exchange_balance: string;
            pay_exchange_balance_not_enough: string;
            pay_exchange_range: string;
            pay_exchange_buy_ok: string;
            pay_exchange_consumption: string;
            pay_exchange_placeholderconfirm: string;
            pay_exchange_confirmbuy: string;
            pay_exchange_purchase_process: string;
            pay_exchange_processp1: string;
            pay_exchange_refund_transfer: string;
            pay_exchange_refund_all: string;
            pay_exchange_refund_transCount_cost: string;
            pay_exchange_refund_address: string;
            pay_exchange_refund_address_error: string;
            pay_exchange_refund_amount: string;
            pay_exchange_refund_amount_error: string;
            pay_exchange_refund_not_enough: string;
            pay_exchange_refund_gas_fee_error: string;
            pay_exchange_refund_do_succ: string;
            pay_exchange_refund_do_fail: string;
            pay_exchange_refund_range_tips: string;
            pay_exchange_refund_fee_tips: string;
            pay_exchange_bcp: string;
            pay_exchange_create_wallet_fail: string;
            pay_exchange_detail_buy_CGAS_fail: string;
            pay_exchange_detail_buy_BCP_fail: string;
            pay_exchange_buyNEO: string;
            pay_exchange_spent_not_enough: string;
            pay_exchange_getmore: string;
            pay_makeRecharge: string;
            pay_trust_tips: string;
            pay_trust_Vice_tips: string;
            pay_transfer_toaddr: string;
            pay_transfer_count: string;
            pay_transCount_count: string;
            pay_transCount_inputCount: string;
            pay_transCount_err: string;
            pay_transCountGAS: string;
            pay_transCountCGAS: string;
            pay_transCountCGASOLD: string;
            pay_transCountCGAS2GAS: string;
            pay_transCountGAS2CGAS: string;
            pay_transCountCGASOLD2OLD: string;
            pay_transCountNEO: string;
            pay_transCountCNEO: string;
            pay_transCountCNEOOLD: string;
            pay_transCountCNEO2NEO: string;
            pay_transCountNEO2CNEO: string;
            pay_transCountCNEOOLD2OLD: string;
            pay_transCountTips_free: string;
            pay_transCountTips_slow: string;
            pay_transCountTips_fast: string;
            pay_transCount_speed: string;
            pay_transCount_cost: string;
            pay_transCount_tips: string;
            pay_transCount_tips_err: string;
            pay_walletOpen_password: string;
            pay_walletOpen_inputPassword: string;
            pay_walletOpen_inputPassword_err: string;
            pay_walletOpen_file_error: string;
            pay_walletOpen_openFail: string;
            walletCreate_create: string;
            walletCreate_password: string;
            walletCreate_vpass: string;
            walletCreate_password_notice: string;
            walletCreate_doCreate: string;
            walletCreate_check_pass: string;
            walletCreate_check_vpass: string;
            walletCreate_check_exceed: string;
            walletImport_invalid_file: string;
            walletImport_select_file: string;
            walletImport_import: string;
            walletImport_password: string;
            walletImport_doImport: string;
            walletImport_bind_succ: string;
            walletView_info: string;
            walletView_create: string;
            walletView_import: string;
            walletCreate_download: string;
            walletCreate_doDownload: string;
            main_wait_for_last_tran: string;
            main_no_app_wallet: string;
            main_need_open_wallet_confirm: string;
            main_refund_CGAS_second_fail: string;
            main_refund_CNEO_second_fail: string;
            main_refund_getScript_err: string;
            main_refund_sendRequest_err: string;
            main_refund_doFail: string;
            main_broker_deposit_second_fail: string;
            errCode_default: string;
            wallet_open_check: string;
            wallet_open_check_otcgo: string;
            wallet_open_check_otcgo_pwd: string;
            netmgr_select_api_slow: string;
            netmgr_select_node_slow: string;
            netmgr_select_cli_slow: string;
            netmgr_connecting: string;
            netmgr_connecting_fail: string;
        };
    }
}
declare namespace BlackCat {
    class LangMgr {
        type: string;
        private lang;
        constructor(type?: string);
        setType(type: string): boolean;
        get(key: string, ext?: any): string;
    }
}
declare namespace BlackCat {
    class AppNotify {
        static confirm(params: any, callback?: any): Promise<void>;
    }
}
declare namespace BlackCat {
    class RawTransaction {
        private static transactionCallback;
        static make(params: any, callback: any): Promise<void>;
        private static _make(params, trust, net_fee, callback?);
    }
}
declare namespace BlackCat {
    class Transfer {
        private static transferCallback;
        static make(params: any, callback?: any): Promise<void>;
    }
}
declare namespace BlackCat {
    class TransferMultiGas {
        private static transferMultiCallback;
        static make(params: any, callback?: any): Promise<void>;
    }
}
declare namespace BlackCat {
    class User {
        info: UserInfo;
        cacheKey: string;
        private _updateUserInfo(userinfo);
        getInfo(): void;
        setInfo(key: any, value: any): void;
        isLogined(): Promise<boolean>;
        getWalletFile(): Promise<any>;
        logout(): void;
        getWalletFileCache(): Promise<string>;
        validateLogin(): Promise<number>;
    }
}
declare namespace BlackCat {
    class WalletListLogs {
        static logs: any[];
        static get_key(): string;
        static get_array_key(txid: any): number;
        static get(txid?: string): any;
        static add(info: walletLists): void;
        static del(txid: string): void;
        static update(txid: string, info: any): void;
    }
}
declare namespace BlackCat {
    class Connector {
        private hosts;
        private first_host;
        private check_params;
        private check_type;
        private fetch_error;
        constructor(hosts: Array<string>, check_params: string, check_type?: string);
        getOne(callback: any): void;
        private check_results(callback);
    }
}
declare namespace BlackCat {
    class NetMgr {
        private default_chain;
        private default_net;
        private chains;
        private support_chains;
        private chain;
        private lock_chain;
        private net;
        private lock_net;
        constructor();
        setDefaultNet(net: number): void;
        setDefaultChain(chain: number): void;
        lockChain(): void;
        lockNet(): void;
        getCurrNet(): number;
        getCurrChain(): number;
        private setChainInstance(chain);
        changeNet(callback: any, net?: number): void;
        changeChain(callback: any, chain?: number): void;
        getChainCoins(chain?: number): Array<string>;
        getChainCoinsOld(chain?: number): Array<string>;
        getSupportChains(): Array<number>;
        getOtherNets(): Array<number>;
        getCurrNodeInfo(type: string): any;
        getNodeLists(type: string): any;
        setNode(type: any, url: any): void;
        getWWW(): any;
        getCoinTool(): any;
        getNextBlockTs(last_ts: number): any;
    }
}
declare namespace BlackCat {
    class NetMgrNeo {
        private net_types;
        private nodes;
        private clis;
        private chain_coins;
        private chain_coins_old;
        private curr_nodes;
        private curr_nodes_tmp;
        private curr_clis;
        private curr_net;
        private CoinTool;
        private WWW;
        private blockTs;
        private blockTsMin;
        constructor();
        getWWW(): any;
        getCoinTool(): any;
        getNextBlockTs(last_ts: number): number;
        private _init_test();
        private _init_main();
        private getHosts(hosts);
        private selectNode(callback, type, force?);
        private _selectNode(callback, type, force);
        private selectCli(callback, type, force?);
        private _selectCli(callback, type);
        private change2test(callback);
        private change2Main(callback);
        getOtherNets(): Array<number>;
        changeNet(callback: any, net?: number): void;
        changeChain(callback: any, net: number): void;
        getChainCoins(): string[];
        getChainCoinsOld(): string[];
        getCurrNodeInfo(type: string): any;
        getNodeLists(type: string): any;
        setNode(type: any, url: any): void;
    }
}
declare namespace BlackCat {
    class ViewBase {
        div: HTMLDivElement;
        isCreated: boolean;
        static refer: string;
        static callback: Function;
        static callback_cancel: Function;
        static callback_params: any;
        private s_timeout_remove;
        constructor();
        create(): void;
        toRefer(): void;
        reset(): void;
        key_esc(): void;
        key_enter(): void;
        start(): void;
        remove(timeout?: number, fadeClass?: string): void;
        private _remove();
        return(timeout?: number): void;
        hidden(): void;
        show(): void;
        isHidden(): boolean;
        update(): void;
        objCreate(tag: string): HTMLElement;
        ObjAppend(o: any, tag: HTMLElement): void;
        objRemove(o: any, tag: HTMLElement): void;
        parentAdd(tag: HTMLElement): void;
        parentRemove(tag: HTMLElement): void;
        bodyAppend(tag: HTMLElement): void;
        bodyRemove(tag: HTMLElement): void;
    }
}
declare namespace BlackCat {
    class AutoLogoutWalletView extends ViewBase {
        private logoutTime;
        create(): void;
        toRefer(): void;
    }
}
declare namespace BlackCat {
    class IconView extends ViewBase {
        private doDragMove;
        private processDiv;
        private stateDiv;
        start(): void;
        show(): void;
        reset(): void;
        update(): void;
        create(): void;
        remove(): void;
        showState(): void;
        removeState(): void;
        hiddenState(): void;
        showFail(): void;
        showSucc(): void;
        flushProcess(count: any): void;
        private dragTouch(ev);
        private drag();
        private onResize();
    }
}
declare namespace BlackCat {
    class MainView extends ViewBase {
        private divMask;
        private s_timeout_hidden;
        start(): void;
        create(): void;
        createMask(): void;
        changNetType(): void;
        remove(): void;
        hidden(): void;
        show(): void;
    }
}
declare namespace BlackCat {
    class ModifyNetworkLineView extends ViewBase {
        static defaultType: string;
        private divTypes;
        private netType_nodes;
        private netType_clis;
        private divLists;
        create(): void;
        toRefer(): void;
        private showNodeInfo(type, clear?);
        private doChange(type, nodelist, height);
        private getNodeName(nodeInfo);
        private getHeight(type, nodelist, element, li, currNodeInfo);
    }
}
declare namespace BlackCat {
    class PayListDetailView extends ViewBase {
        static list: walletLists;
        constructor();
        create(): void;
        toRefer(): void;
        private getCnts();
        private getTxid();
        private getWallet();
        private getParams();
    }
}
declare namespace BlackCat {
    class PayListMoreView extends ViewBase {
        private page;
        private num;
        private isLast;
        private listsDiv;
        private getMoreDiv;
        constructor();
        create(): void;
        toRefer(): void;
        reset(): void;
        private doGetWalletLists();
    }
}
declare namespace BlackCat {
    class PayListProcessView extends ViewBase {
        static lists: any;
        private listsDiv;
        create(): void;
        toRefer(): void;
        updateLists(): void;
    }
}
declare namespace BlackCat {
    class PayReceivablesView extends ViewBase {
        private divAddress;
        create(): void;
        toRefer(): void;
        private base64ToBlob(code);
    }
}
declare namespace BlackCat {
    class PayTransferView extends ViewBase {
        inputTransferCount: HTMLInputElement;
        private inputTransferAddr;
        private divTransferAddr;
        private labelName;
        private divHaveAmounts;
        private divHaveBalanceAmounts;
        private spanBalance;
        private selectType;
        private netFeeCom;
        private Balances;
        static log_type_detail: {
            gas: string;
            neo: string;
            cgas: string;
            cneo: string;
        };
        static get_log_type_detail_by_asset(asset: string): string;
        private toaddress;
        private transferType;
        static address: string;
        static contact: contact;
        static transferType_default: string;
        inputCount: HTMLInputElement;
        net_fee: any;
        reset(): void;
        start(): void;
        create(): void;
        toRefer(): void;
        key_esc(): void;
        private getAddress();
        private doinputchange();
        gatSelect(): void;
        private doTransfer();
        private netFeeChange(net_fee);
        updateBalance(): void;
        private getBalanceTypes();
    }
}
declare namespace BlackCat {
    class PayView extends ViewBase {
        private chains;
        wallet_addr: string;
        wallet_addr_other: any;
        gas: number;
        cgas: number;
        neo: number;
        cneo: number;
        height_clis: number;
        private divHeight_clis;
        height_nodes: number;
        private divHeight_nodes;
        listPageNum: number;
        private spanRecord;
        private walletListsHash;
        private divLists;
        private divNetSelect;
        private WalletListsNeedConfirm;
        private s_doGetWalletLists;
        private wallet_btn;
        private assets_btn;
        private game_assets_element;
        private game_assets;
        private game_assets_ts;
        private game_assets_update;
        private allnep5_balance;
        private pendingListsElement;
        reset(): void;
        start(): void;
        create(): void;
        update(): void;
        key_esc(): void;
        private clearTimeout();
        doGetBalances(): Promise<void>;
        _doGetBalances_neo(): Promise<void>;
        private getNep5BalanceOld(coin);
        private getNep5Balance(coin);
        private doMakeRefundOld(id_old, type?);
        private doExchangeGAS();
        private doExchangeCNEO();
        private doExchangeCGAS();
        private doExchangeToken(coinType?, transType?);
        private doExchangeNEO();
        private divLists_recreate();
        doGetWalletLists(force?: number): Promise<void>;
        private getCoinIcon(v, coin_type);
        getListImg(v: any): any;
        getListGameIcon(v: any): any;
        private getAppName(v);
        getListName(v: any): any;
        getListCtm(v: any): string;
        getListCtmMsg(v: any): string;
        getListParamMethods(v: any): string;
        getListCnts(v: any): HTMLElement;
        getListCntsClass(v: any): "" | "pc_income" | "pc_expenditure";
        getListState(v: any): HTMLElement;
        getListBlockindex(v: any): any;
        private wallet_detail();
        private makeMintTokenTransaction(coinType?);
        private makeRefundTransaction(id_ASSET?, coinType?);
        private doMakeReceivables();
        private doMakeTransfer();
        flushListCtm(): void;
        private getNetTypeName();
        private showChangeNetType();
        private getDivNetSelectType(type);
        checkTransCount(count: string): boolean;
        getHeight(type: string, chain?: number): Promise<void>;
        updateHeight(type: any, height: any): void;
        parseTypeDetailType10(type_detail: string): {
            type: string;
            type_src: string;
        };
    }
}
declare namespace BlackCat {
    class PayWalletDetailView extends ViewBase {
        private wallet_addr;
        private public_key;
        private private_wif;
        private private_hex;
        private walletExport;
        reset(): void;
        create(): void;
        toRefer(): void;
        private getWalletInfo();
        private exportWallet();
    }
}
declare namespace BlackCat {
    class PersonalCenterView extends ViewBase {
        private myNet_nodes;
        private myNet_clis;
        private divHeight_nodes;
        private divHeight_clis;
        create(): void;
        toRefer(): void;
        private doLogout();
        private makeLogout();
        private getNodeHeight(type);
        updateNodeInfo(): void;
    }
}
declare namespace BlackCat {
    class SecurityCenterView extends ViewBase {
        spanSignOut: HTMLElement;
        create(): void;
        toRefer(): void;
        getWalletOutTimeMaxMsg(liveTimeMax: number): string;
        updateWalletOutTimeMaxMsg(): void;
    }
}
declare namespace BlackCat {
    class ViewAlert extends ViewBase {
        static content: string;
        static content_ext: any;
        create(): void;
        key_esc(): void;
        key_enter(): void;
        toRefer(): void;
        private doConfirm();
    }
}
declare namespace BlackCat {
    class ViewConfirm extends ViewBase {
        static content: string;
        create(): void;
        toRefer(): void;
        key_esc(): void;
        private doConfirm();
        private doCancel();
    }
}
declare namespace BlackCat {
    class ViewConnecting extends ViewBase {
        static content: string;
        static callback_retry: Function;
        private showType;
        private showReturn;
        create(): void;
        key_esc(): void;
        showConnecting(): void;
        showRetry(showReturn: boolean): void;
    }
}
declare namespace BlackCat {
    class ViewLoading extends ViewBase {
        static content: string;
        create(): void;
        key_esc(): void;
    }
}
declare namespace BlackCat {
    class ViewMgr {
        views: any;
        iconView: IconView;
        mainView: MainView;
        viewWalletOpen: ViewWalletOpen;
        viewTransferCount: ViewTransferCount;
        viewTransactionConfirm: ViewTransactionConfirm;
        viewTransferConfirm: ViewTransferConfirm;
        viewAlert: ViewAlert;
        viewConfirm: ViewConfirm;
        viewToast: ViewToast;
        viewLoading: ViewLoading;
        walletView: WalletView;
        walletCreateView: WalletCreateView;
        walletCreateDownloadView: WalletCreateDownloadView;
        walletImportView: WalletImportView;
        payView: PayView;
        payListDetailView: PayListDetailView;
        payListProcessView: PayListProcessView;
        payListMoreView: PayListMoreView;
        personalCenterView: PersonalCenterView;
        modifyNetworkLineView: ModifyNetworkLineView;
        securityCenterView: SecurityCenterView;
        autoLogoutWalletView: AutoLogoutWalletView;
        payWalletDetailView: PayWalletDetailView;
        payReceivablesView: PayReceivablesView;
        payTransferView: PayTransferView;
        viewConnecting: ViewConnecting;
        constructor();
        change(type: string): void;
        removeAll(): void;
        update(): void;
        updateBalance(): void;
    }
}
declare namespace BlackCat {
    class ViewToast extends ViewBase {
        static showTime: number;
        static content: string;
        create(): void;
        show(): void;
        key_esc(): void;
    }
}
declare namespace BlackCat {
    class ViewTransactionConfirm extends ViewBase {
        static list: walletLists;
        private divConfirmSelect;
        private trust;
        private netFeeCom;
        private net_fee;
        constructor();
        start(): void;
        create(): void;
        toRefer(): void;
        key_esc(): void;
        private getCnts();
        private getWallet();
        private getParams();
    }
}
declare namespace BlackCat {
    class ViewTransferConfirm extends ViewBase {
        static list: walletLists;
        private divConfirmSelect;
        private netFeeCom;
        private net_fee;
        constructor();
        start(): void;
        create(): void;
        toRefer(): void;
        key_esc(): void;
        private getCnts();
        private getWallet();
        private getParams();
    }
}
declare namespace BlackCat {
    class ViewTransferCount extends ViewBase {
        static coinType: string;
        static transType: string;
        static transNncOld: string;
        private selectTransfertype;
        private divtransfername;
        private labeltransfername1;
        private labeltransfername2;
        private divHaveAmounts;
        private divHaveUtxoAmounts;
        private spanHaveUtxoAmounts;
        private divHaveNep5Amounts;
        private spanHaveNep5Amounts;
        private netFeeCom;
        private coinTypeLang;
        private coinBalanceLang;
        private coinBalance;
        inputCount: HTMLInputElement;
        net_fee: string;
        start(): void;
        create(): void;
        toRefer(): void;
        key_esc(): void;
        private doinputchange();
        private doConfirm();
        private netFeeChange(net_fee);
        updateBalance(): void;
        private getSelectOptions(transType?);
        private getCoinBalance();
        private getCoinBalanceLang();
        private getCoinTypeLang();
        private dotransfertype();
        private configNetFee();
        private checkBalance();
    }
}
declare namespace BlackCat {
    class ViewWalletOpen extends ViewBase {
        static callback_callback: Function;
        private static tasks;
        private inputPassword;
        start(): void;
        create(): void;
        toRefer(): void;
        key_enter(): void;
        key_esc(): void;
        private doConfirm();
        private doCancel();
        doReadWalletFile(): Promise<void>;
        private doOpenWallet();
        static addTask(type: string, params: any): void;
        static removeTask(type: string): void;
        private doOpenTasks();
    }
}
declare namespace BlackCat {
    class WalletCreateDownloadView extends ViewBase {
        static filestr: string;
        static filepass: string;
        static addr: string;
        private walletExport;
        create(): void;
        key_esc(): void;
        private exportWallet();
        private doDownload();
    }
}
declare namespace BlackCat {
    class WalletCreateView extends ViewBase {
        private inputPwd;
        private inputVwd;
        private wallet;
        constructor();
        create(): void;
        show(): void;
        key_esc(): void;
        private createVerifyPwd();
        private createVerifyVwd();
        private doCreate();
    }
}
declare namespace BlackCat.tools {
    class LoginInfo {
        pubkey: Uint8Array;
        prikey: Uint8Array;
        address: string;
        static ArrayToString(array: LoginInfo[]): string;
        static StringToArray(str: string): LoginInfo[];
        static getCurrentLogin(): LoginInfo;
        static getCurrentAddress(): string;
        static setCurrentAddress(str: string): void;
    }
    class BalanceInfo {
        balance: number;
        asset: string;
        name: {
            lang: string;
            name: string;
        }[];
        names: string;
        type: string;
        static jsonToArray(json: {}[]): BalanceInfo[];
        static getBalancesByArr(balances: any, nep5balances: any, height: number): BalanceInfo[];
        static setBalanceSotre(balance: BalanceInfo, height: number): void;
    }
    class Nep5Balance {
        assetid: string;
        symbol: string;
        balance: number;
    }
    class Result {
        err: boolean;
        info: any;
    }
    enum AssetEnum {
        NEO = "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
        GAS = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7",
    }
    class NeoAsset {
        neo: number;
        gas: number;
        claim: string;
    }
    class OldUTXO {
        height: number;
        txid: string;
        n: number;
        asset: string;
        constructor(txid: string, n: number, asset?: string);
        static oldutxosPush(olds: OldUTXO[]): void;
        static setOldutxos(olds: OldUTXO[]): void;
        static getOldutxos(): OldUTXO[];
        compareUtxo(utxo: UTXO): boolean;
    }
    class UTXO {
        addr: string;
        txid: string;
        n: number;
        asset: string;
        count: Neo.Fixed8;
        static ArrayToString(utxos: UTXO[]): Array<any>;
        static StringToArray(obj: Array<any>): UTXO[];
        static setAssets(assets: {
            [id: string]: UTXO[];
        }): void;
        static getAssets(): any;
    }
    class Consts {
        static baseContract: string;
        static registerContract: string;
    }
    class DomainInfo {
        owner: Uint8Array;
        register: Uint8Array;
        resolver: Uint8Array;
        ttl: string;
    }
    class RootDomainInfo extends DomainInfo {
        rootname: string;
        roothash: Uint8Array;
        constructor();
    }
    class Transactionforaddr {
        addr: string;
        blockindex: number;
        blocktime: {
            $date: number;
        };
        txid: string;
    }
    interface Transaction {
        txid: string;
        type: string;
        vin: {
            txid: string;
            vout: number;
        }[];
        vout: {
            n: number;
            asset: string;
            value: string;
            address: string;
        }[];
    }
    class History {
        n: number;
        asset: string;
        value: string;
        address: string;
        assetname: string;
        txtype: string;
        time: string;
        txid: string;
        static setHistoryStore(history: History, height: number): void;
        static getHistoryStore(): Array<any>;
        static delHistoryStoreByHeight(height: number): void;
    }
    class Claim {
        addr: string;
        asset: string;
        claimed: boolean;
        createHeight: number;
        n: number;
        txid: string;
        useHeight: number;
        used: string;
        value: number;
        constructor(json: {});
        static strToClaimArray(arr: {}[]): Claim[];
    }
    class Domainmsg {
        domainname: string;
        resolver: string;
        mapping: string;
        time: string;
        isExpiration: boolean;
        await_resolver: boolean;
        await_mapping: boolean;
        await_register: boolean;
    }
    class DomainStatus {
        domainname: string;
        resolver: string;
        mapping: string;
        await_mapping: boolean;
        await_register: boolean;
        await_resolver: boolean;
        static setStatus(domain: DomainStatus): void;
        static getStatus(): {};
    }
    class WalletOtcgo {
        address: string;
        publicKey: string;
        privatekey: string;
        publicKeyCompressed: string;
        privateKeyEncrypted: string;
        pubkey: Uint8Array;
        prikey: Uint8Array;
        fromJsonStr(str: string): void;
        otcgoDecrypt(pwd: string): void;
        doSign(prvkey: any, msg: any): any;
        doVerify(pubkey: any, msg: any, sigval: any): any;
        doValidatePwd(): any;
    }
    class MyAuction {
        auctionSpentTime: string;
        auctionState: string;
        blockindex: string;
        domain: string;
        maxBuyer: string;
        maxPrice: string;
        owner: string;
        startAuctionTime: number;
    }
}
declare namespace BlackCat {
    class WalletImportView extends ViewBase {
        private inputFile;
        private inputFileText;
        private inputPwd;
        private filename;
        private filepass;
        private reader;
        constructor();
        create(): void;
        key_esc(): void;
        private doBindWallet();
        private bindWallet(walletStr);
    }
}
declare namespace BlackCat {
    class WalletView extends ViewBase {
        create(): void;
        key_esc(): void;
    }
}
declare namespace BlackCat {
    class ApiTool {
        static api_version: string;
        static base_url: string;
        static isLogined(): Promise<boolean>;
        static addUserWalletLogs(txid: string, cnts: string, type: string, params: string, net_fee?: string, type_detail?: string, sdk?: string): void;
        static getWalletListss(page: number, num: number, pedding: number): any;
        static walletNotify(txid: string): Promise<void>;
        static getAppWalletNotifys(): Promise<any>;
        static getPlatWalletNotifys(uid: string, token: string): Promise<void>;
        static walletNotifyExt(txid: string, ext: string): Promise<void>;
    }
}
declare namespace BlackCat.tools {
    class CoinToolNeo {
        static readonly id_GAS: string;
        static readonly id_NEO: string;
        static id_CGAS: string;
        static id_CGAS_OLD: Array<string>;
        static id_CNEO: string;
        static id_CNEO_OLD: Array<string>;
        static id_BCT: string;
        static id_BCP: string;
        static id_BCT_DESTROY: string;
        static id_BTC: string;
        static id_BTC_DESTROY: string;
        static id_ETH: string;
        static id_ETH_DESTROY: string;
        static id_CNEO_DESTROY: string;
        static id_bancor: string;
        static BUY_VIP_ADDR: string;
        static id_broker: string;
        static assetID2name: {
            [id: string]: string;
        };
        static name2assetID: {
            [id: string]: string;
        };
        static initAllAsset(): Promise<void>;
        static getassets(): Promise<{
            [id: string]: UTXO[];
        }>;
        static makeTran(utxos: {
            [id: string]: UTXO[];
        }, targetaddr: string, assetid: string, sendcount: Neo.Fixed8, net_fee?: Neo.Fixed8, left_fee?: number, split?: boolean): Result;
        static makeTranMulti(utxos: {
            [id: string]: UTXO[];
        }, targets: Array<{
            toaddr: string;
            count: string;
        }>, assetid: string, net_fee?: Neo.Fixed8): Result;
        static rawTransaction(targetaddr: string, asset: string, count: string, net_fee?: Neo.Fixed8): Promise<Result>;
        static rawTransactionMulti(targets: Array<any>, asset: string, net_fee?: Neo.Fixed8): Promise<Result>;
        static contractInvokeTrans_attributes(script: Uint8Array, net_fee?: string, not_send?: boolean): Promise<Result>;
        static contractInvokeTrans(script: Uint8Array): Promise<Result>;
        static nep5Transaction(address: string, tatgeraddr: any, asset: string, amount: string, net_fee?: string, not_send?: boolean): Promise<Result>;
        static getNep5Assets(id_hash: string): Promise<{
            [id: string]: UTXO[];
        }>;
        static getCgasAssets(id_CGAS: string, amount: number): Promise<{
            [id: string]: UTXO[];
        }>;
    }
}
declare namespace BlackCat {
    class floatNum {
        static strip(num: number, precision?: number): number;
        static digitLength(num: number): number;
        static float2Fixed(num: number): number;
        static checkBoundary(num: number): void;
        static times(num1: number, num2: number, ...others: number[]): number;
        static plus(num1: number, num2: number, ...others: number[]): number;
        static minus(num1: number, num2: number, ...others: number[]): number;
        static divide(num1: number, num2: number, ...others: number[]): number;
        static round(num: number, ratio: number): number;
        static addZero(num: number, ratio: number): string;
    }
}
declare namespace BlackCat.tools {
    class neotools {
        constructor();
        static verifyAddress(addr: string): boolean;
        static verifyPublicKey(publicKey: string): boolean;
        static wifDecode(wif: string): Result;
        static nep2FromWif(wif: string, password: string): Result;
        static nep2ToWif(nep2: string, password: string): Promise<Result>;
        static nep6Load(wallet: ThinNeo.nep6wallet, password: string): Promise<LoginInfo[]>;
        static getPriKeyfromAccount(scrypt: ThinNeo.nep6ScryptParameters, password: string, account: ThinNeo.nep6account): Promise<Result>;
    }
}
declare namespace BlackCat.tools {
    class NNSTool {
        static root_test: RootDomainInfo;
        static initRootDomain(): Promise<void>;
        static queryDomainInfo(doamin: string): Promise<DomainInfo>;
        static registerDomain(doamin: string): Promise<Result>;
        static getRootName(): Promise<string>;
        static getRootNameHash(): Promise<Uint8Array>;
        static getOwnerInfo(domain: Uint8Array, scriptaddress: Uint8Array): Promise<DomainInfo>;
        static getNameHash(domain: string): Promise<Uint8Array>;
        static setResolve(nnshash: Uint8Array, resolverhash: Uint8Array): Promise<Result>;
        static setResolveData(nnshash: Uint8Array, str: string, resolve: string): Promise<void>;
        static resolveData(domain: string): Promise<string>;
        static resolveFull(protocol: string, nameArray: string[]): Promise<void>;
        static getSubOwner(nnshash: Uint8Array, subdomain: string, scriptaddress: Uint8Array): Promise<string>;
        static nameHash(domain: string): Uint8Array;
        static nameHashSub(roothash: Uint8Array, subdomain: string): Uint8Array;
        static nameHashArray(domainarray: string[]): Uint8Array;
        static verifyDomain(domain: any): boolean;
        static verifyAddr(addr: any): boolean;
        static domainStatus: DomainStatus;
        static setDomainStatus(): void;
        static initStatus(): void;
    }
}
declare namespace BlackCat {
    class UserInfo {
        wallet: string;
        service_charge: string;
    }
    class TransInfo {
        assetid: string;
        targetaddr: string;
        amount: string;
    }
    class RawTransInfo {
        sbParamJson: any[];
        sbPushString: string;
        nnc: string;
    }
    class RefundTransInfo {
        count: number;
    }
    class MintTokenTransInfo {
        count: number;
        extString: string;
    }
    class getMintTokenTransInfo {
        txid: string;
    }
    class invokescriptInfo {
        sbParamJson: any[];
        sbPushString: string;
        nnc: string;
        extString: string;
    }
    class walletLists {
        id: string;
        g_id: string;
        state_gameplay: string;
        state_gameplay_detail: string;
        vdata: string;
        nnc: string;
        icon: string;
        name: string;
        ext: string;
        ctm: string;
        type: string;
        type_detail: string;
        state: string;
        txid: string;
        wallet: string;
        cnts: string;
        params: string;
        client_notify: string;
        net_fee: string;
        blockindex: string;
    }
    class contact {
        id: string;
        ctm: string;
        uid: string;
        address_name: string;
        address_wallet: string;
        address_desc: string;
    }
}
declare namespace BlackCat {
    class SDK {
        private static is_init;
        private static main;
        static init(listener: any, lang?: string): void;
        static setLang(type: string): void;
        static showMain(): void;
        static showIcon(): void;
        static login(callback?: any): void;
        static invokescript(params: any, callback?: any): Promise<void>;
        static makeRawTransaction(params: any, callback?: any): Promise<void>;
        static confirmAppNotify(params: any, callback?: any): Promise<void>;
        static getBalance(callback?: any): Promise<void>;
        static getHeight(callback?: any): Promise<void>;
        static getUserInfo(callback?: any): void;
        static makeTransfer(params: any, callback?: any): Promise<void>;
        static makeGasTransferMulti(params: any, callback?: any): Promise<void>;
        static getNetType(callback?: any): void;
        static setDefaultNetType(type: any): void;
        static lockNet(): void;
    }
    class Result {
        err: boolean;
        info: any;
    }
}
declare namespace BlackCat {
    class sdkCallback {
        static getBalance: string;
        static getHeight: string;
        static getUserInfo: string;
        static getNetType: string;
        static makeRaw: string;
        static invoke: string;
        static makeGasTransferMulti: string;
        static confirmAppNotify: string;
        static error(error: any, type: string, params: any, callback?: any): void;
        static succ(info: any, type: string, params: any, callback?: any): void;
        static res(res: Result, type: string, params: any, callback?: any): void;
        private static callback(res, type, callback_data, callback);
    }
}
declare namespace BlackCat.tools {
    class StorageTool {
        static getLoginArr(): LoginInfo[];
        static setLoginArr(value: LoginInfo[]): void;
        static setStorage(key: string, value: string): void;
        static getStorage(key: string): string;
        static delStorage(key: string): void;
        static heightRefresh(): Promise<void>;
        static utxosRefresh(): Promise<void>;
    }
    class StaticStore {
        static choiceAsset: string;
        static setAsset(asset: string): void;
    }
}
declare namespace BlackCat.tools {
    class DateTool {
        static dateFtt(fmt: any, date: any): any;
    }
}
declare namespace BlackCat.tools {
    class wallet {
        private wallet;
        private otcgo;
        private isotc;
        filestr: string;
        wallet_addr: string;
        constructor();
        setWalletStr(filestr: any): Promise<boolean>;
        readWalletFile(type?: number): Promise<boolean>;
        open(filepass: string): Promise<boolean>;
        isOpen(): boolean;
        invokescript(params: any): Promise<any>;
        _invokescriptNeo(params: any): Promise<Result>;
        makeRawTransaction(params: any, trust: string, net_fee: any, upload_log?: boolean): Promise<Result>;
        _makeRawTransactionNeo(params: any, trust: string, net_fee: string, upload_log?: boolean): Promise<Result>;
        closeWallet(): void;
    }
}
declare namespace BlackCat.tools {
    class WWWNeo {
        static api_nodes: string;
        static api_clis: string;
        static api_cgas: string;
        static api_cneo: string;
        static makeRpcUrl(url: string, method: string, ..._params: any[]): string;
        static makeRpcPostBody(method: string, ..._params: any[]): {};
        static api_getHeight_nodes(nodes_url?: string): Promise<number>;
        static api_getAllAssets(): Promise<any>;
        static api_getAllNep5AssetBalanceOfAddress(address: string): Promise<any>;
        static api_getUTXO(address: string): Promise<any>;
        static api_getAvailableUTXOS(address: string, amount: number): Promise<any>;
        static api_getBalance(address: string): Promise<any>;
        static api_getNep5Asset(asset: string): Promise<any>;
        static api_getrawtransaction(txid: string): Promise<any>;
        static api_getcontractstate(scriptaddr: string): Promise<any>;
        static api_postRawTransaction(data: Uint8Array): Promise<boolean>;
        static api_getInvokescript(scripthash: Uint8Array): Promise<any>;
        static api_getHeight_clis(clis_url?: string): Promise<number>;
        static cli_postRawTransaction(data: Uint8Array): Promise<boolean>;
        static cli_getInvokescript(scripthash: Uint8Array): Promise<any>;
    }
}
