namespace BlackCat {
    export class LangCN extends LangBase {

        lang = {
            return: "返回",
            copy: "复制",
            ok: "确定",
            cancel: "取消",
            more: "更多",
            info: "提示",
            content: "内容",
            retry: "重试",
            cgas: "CGAS",
            gas: "GAS",
            neo: "NEO",
            cneo: "CNEO",

            main_walletaddr_format_err: "钱包地址格式不正确！",
            main_ETHWallet_format_err: "ETH钱包地址格式错误！",
            main_BTCWallet_format_err: "BTC钱包地址格式错误！",
            main_NEOWallet_format_err: "NEO钱包地址格式错误！",

            // PersonalCenterView
            personalcenter: "个人中心",

            // MyInfoView
            myinfo_security: "安全中心",
            myinfo_set: "设置",
            myinfo_logout: "退出账号",
            myinfo_logoutConfirm: "确定要退出登录么",

            // ModifyNetworkLineView
            modifyNet: "网络线路",
            modifyNet_succ: "网络线路修改成功",
            modifyNet_node_err: "该网络线路不可用，请选择其他线路！",

            //SecurityCenterView
            security_title: "安全中心",
            security_walletOut: "自动登出钱包",
            security_walletOut_admin: "永不",
            security_walletOut_admin_m: "%minutes% 分钟",
            security_walletOut_admin_h: "%hours% 小时",
            security_walletOut_toast: "当超过一定时间未操作钱包，将会自动登出，需要重新输入密码",

            // PayListDetailView
            paylist_txid: "交易单号：",
            paylist_wallet: "我的钱包：",
            paylist_nnc: "合约地址：",
            paylist_sbParamJson: "合约参数：",
            paylist_sbPushString: "合约方法：",
            paylist_sbPushString_none: "无",
            paylist_ctm_year: "%year%年前",
            paylist_ctm_month: "%month%月前",
            paylist_ctm_day: "%day%天前",
            paylist_ctm_hour: "%hour%小时前",
            paylist_ctm_minute: "%minute%分钟前",
            paylist_ctm_recent: "刚刚",


            // PayListMoreView
            paylist_noMore: "没有记录了",
            paylist_getMore: "点击加载更多记录",
            paylist_noRecord: "没有记录信息",


            // PayReceivablesView
            pay_received: "收款",
            pc_receivables_download: "下载二维码",
            pc_receivables_address: "钱包地址",
            pc_receivables_copy: "复制成功",

            // PayTransferView
            pay_transfer: "转账",
            pay_transferType: "代币：",
            pay_transferBalance: "余额：",
            pay_transferToAddr: "转账地址",
            pay_transferCount: "转账金额",
            pay_transferToAddrError: "转账地址错误",
            pay_transferCountError: "转账金额错误",
            pay_transferDoSucc: "转账操作成功",
            pay_transferDoFail: "转账失败！",
            pay_transferDoFailErr: "转账失败！%err%",
            pay_transferGasNotEnough: "GAS余额不足！",
            pay_transferBCPNotEnough: "BCP余额不足！",
            pay_transferBCTNotEnough: "BCT余额不足！",
            pay_transferNEONotEnough: "NEO余额不足！",
            pay_transferCNEONotEnough: "CNEO余额不足！",
            pay_transferCGASNotEnough: "CGAS余额不足！",
            pay_transferETHNotEnough: "ETH余额不足！",
            pay_transferBTCNotEnough: "BTC余额不足！",

            // PayView
            pay_wallet: "我的钱包",
            pay_refresh: "刷新",
            pay_wallet_detail: "详情",
            pay_coin_name: "代币",
            pay_coin_old: "CGAS(old)兑换",
            pay_chain_1: "BlaCat",
            pay_chain_2: "NEO",
            pay_gas: "GAS",
            pay_gas_desc_2: "GAS是NEO链上的数字货币，可以通过交易所获取",
            pay_gas_desc_1: "GAS是BlaCat映射",
            pay_cgas: "CGAS",
            pay_cgas_desc: "CGAS是BlaCat提供给玩家消费用的通用筹码",
            pay_neo: "NEO",
            pay_neo_desc_2: "NEO是NEO链上的数字货币，可以通过交易所获取",
            pay_neo_desc_1: "NEO是BlaCat映射",
            pay_cneo: "CNEO",
            pay_cneo_desc: "CNEO是BlaCat提供给玩家消费用的通用筹码",
            pay_bct_desc:"平台的流通代币，按固定汇率挂接法币（美元）",
            pay_bcp_desc:"平台的流通代币，按浮动汇率映射一篮子数字币",
            pay_btc: "BTC",
            pay_btc_desc:"可在平台内流通的映射代币（NEP5）",
            pay_eth: "ETH",
            pay_eth_desc:"可在平台内流通的映射代币（NEP5）",
            pay_send: "转账",
            pay_purchase: "购买",
            pay_purchase_testnet_cant_buy: "请切换到主网购买GAS！",
            pay_makeMint: "兑换",
            pay_recentLists: "交易中",
            pay_more: "记录",
            pay_makeMintGasNotEnough: "GAS余额不足",
            pay_makeMintNeoNotEnough: "NEO余额不足",
            pay_makeMintDoFail: "充值CGAS失败！\r\n充值合约执行失败！\r\n请等待上次充值确认后再操作！",
            pay_makeMintDoFail2: "充值CGAS失败！\r\n发送充值请求失败！请检查网络，稍候重试！",
            pay_makeRefundCgasNotEnoughUtxo: "CGAS兑换繁忙，请稍后重试！",
            pay_makeRefundCneoNotEnoughUtxo: "CNEO兑换繁忙，请稍后重试！",
            pay_makeRefundCgasNotEnough: "CGAS余额不足",
            pay_makeRefundCneoNotEnough: "CNEO余额不足",
            pay_makeRefundGasFeeNotEnough: "GAS余额不足，无法支付手续费！",
            pay_makeRefundGasLessThanFee: "兑换GAS的金额不能小于手续费！",
            pay_makeRefundDoFail: "提取合约执行失败！请等待上个提现或兑换交易完成再操作！",
            pay_makeRefundDoFail2: "发送提取交易失败！请检查网络，稍候重试！",
            pay_makeRefundGetScriptFail: "获取提取合约失败！",
            pay_makeRefundCgasOldNotEnough: "CGAS(old)余额不足",
            pay_makeRefundCneoOldNotEnough: "CNEO(old)余额不足",
            pay_makeMintGasUtxoCountsLimit: "资产块超出规定数量，需要自己给自己钱包转入%gas%数量的GAS才能继续操作。",
            pay_makeMintNeoUtxoCountsLimit: "资产块超出规定数量，需要自己给自己钱包转入%neo%数量的NEO才能继续操作。",
            pay_walletbtn : "钱包",
            pay_assets: "虚拟资产",
            pay_get: "获取",

            pay_not_enough_money: "余额不足",
            pay_not_enough_utxo: "请等待上次交易完成再执行！",

            pay_nettype_1: "主网",
            pay_nettype_2: "测试网",

            payview_process: "当前有<font color='red'>%count%</font>交易正在处理中",

            // PayWalletDetailView
            pay_walletDetail: "钱包详情",
            pay_walletDetail_addr: "地址：",
            pay_walletDetail_key: "公钥：",
            pay_walletDetail_hex: "密钥HEX：",
            pay_walletDetail_wif: "密钥WIF：",
            pay_walletDetail_notice: "为避免财产损失，展开密钥时请防止泄露。",
            pay_walletDetail_export: "导出钱包",

            pay_makerawtrans_err: "交易发起失败",
            pay_makerawtrans_fee_less: "网络费不足！%reason%",
            pay_makerawtrans_fee_less_gaslimit: "gasLimit值不能低于%gasLimit%",

            // AddressbookView
            addressbook_title: "通讯录",
            addressbook_search: "搜索",

            // AddressbookDetailsView
            addressbook_det_title: "通讯录",
            addressbook_det_transfer: "转账",
            addressbook_det_address: "钱包地址",
            addressbook_det_download: "下载二维码",
            addressbook_det_describe: "描述",
            addressbook_det_empty: "空",
            addressbook_det_del: "删除联系人",
            addressbook_det_del_title: "删除",
            addressbook_det_del_tips: "您确认删除联系人？",
            addressbook_det_del_succ: "删除成功",


            // AddressbookOpView
            addressbook_op_button: "完成",
            addressbook_op_name: "联系人",
            addressbook_op_inputName: "输入联系人",
            addressbook_op_inputName_err: "请输入联系人",
            addressbook_op_address: "钱包地址",
            addressbook_op_inputAddress: "输入钱包地址",
            addressbook_op_inputAddress_err: "请输入钱包地址",
            addressbook_op_describe: "描述",
            addressbook_op_inputDescribe: "输入描述",
            addressbook_op_inputDescribe_err: "请输入描述",
            addressbook_op_addSucc: "联系人添加成功",
            addressbook_op_updateSucc: "联系人修改成功",

            // PayExchangeView
            pay_exchange_bct: "获取BCT",

            //PayExchangeView
            pay_exchange_cgas: "购买CGAS",
            pay_exchange_purchase: "购买",
            pay_exchange_price: "最新价",
            pay_exchange_balance: "余额",
            pay_exchange_balance_not_enough: "余额不足！",
            pay_exchange_range: "24H涨跌",
            pay_exchange_buy_ok: "提交成功！",
            pay_exchange_consumption: "消耗：",
            pay_exchange_placeholderconfirm: "输入购买数量",
            pay_exchange_confirmbuy: "确认购买",     
            pay_exchange_purchase_process: "购买流程",
            pay_exchange_processp1: "1.以下是平台提供%type%钱包地址，请去各大交易所转入所需要的%type1%数量，转账成功后上方会显示您的%type2%余额",

            // PayExchangeRefundView
            pay_exchange_refund_transfer: "提款",
            pay_exchange_refund_all: "全部",
            pay_exchange_refund_transCount_cost:"手续费：0.0001(BTC)",
            pay_exchange_refund_address:"收款地址",
            pay_exchange_refund_address_error: "收款地址错误！",
            pay_exchange_refund_amount:"提款金额",
            pay_exchange_refund_amount_error: "提款金额错误！",
            pay_exchange_refund_not_enough: "余额不足！",
            pay_exchange_refund_gas_fee_error: "GAS不足，无法支付手续费！",
            pay_exchange_refund_do_succ: "提款申请提交成功！",
            pay_exchange_refund_do_fail: "提款申请提交失败！",
            pay_exchange_refund_range_tips:"向右滑动加速",  
            pay_exchange_refund_fee_tips:"收取%NetFee%gas网络费",

            
            // PayExchangeBcpDetail
            pay_exchange_bcp: "获取BCP",
            pay_exchange_create_wallet_fail: "创建交易钱包失败，请稍候重试！",

            // PayExchangeDetailView
            pay_exchange_detail_buy_CGAS_fail: "购买CGAS失败！",
            pay_exchange_detail_buy_BCP_fail: "购买BCP失败！",
            pay_exchange_buyNEO: "输入支付数量",

            pay_exchange_spent_not_enough: "数量太小，请调整数量！",
            pay_exchange_getmore: "获取%type%>>",

            // ViewAlert

            // ViewConfirm

            // ViewToast

            // ViewTransactionConfirm
            pay_makeRecharge: "充值",
            pay_trust_tips: "信任合约",
            pay_trust_Vice_tips: "本合约交易不再弹出此窗口,如需更改手续费请前往设置界面",

            // ViewTransferConfirm
            pay_transfer_toaddr: "转账地址",
            pay_transfer_count: "转账金额",

            // ViewTransferCount
            pay_transCount_count: "兑换",
            pay_transCount_inputCount: "请输入需要兑换的金额",
            pay_transCount_err: "请输入正确的金额",
            pay_transCountGAS: "GAS：",
            pay_transCountCGAS: "CGAS：",
            pay_transCountCGASOLD: "CGAS(old)：",
            pay_transCountCGAS2GAS: "GAS",
            pay_transCountGAS2CGAS: "CGAS",
            pay_transCountCGASOLD2OLD: "CGAS(old)",

            pay_transCountNEO: "NEO：",
            pay_transCountCNEO: "CNEO：",
            pay_transCountCNEOOLD: "CNEO(old)：",
            pay_transCountCNEO2NEO: "NEO",
            pay_transCountNEO2CNEO: "CNEO",
            pay_transCountCNEOOLD2OLD: "CNEO(old)",

            pay_transCountTips_free: "免费",
            pay_transCountTips_slow: "慢",
            pay_transCountTips_fast: "快",
            pay_transCount_speed: "交易速度",
            pay_transCount_cost: "手续费：",
            pay_transCount_tips: "选择您要兑换的代币",
            pay_transCount_tips_err: "选择您要兑换的代币",

            // ViewWalletOpen
            pay_walletOpen_password: "密码",
            pay_walletOpen_inputPassword: "请输入钱包密码",
            pay_walletOpen_inputPassword_err: "请输入钱包密码",
            pay_walletOpen_file_error: "钱包文件解析异常，请重新登录",
            pay_walletOpen_openFail: "打开钱包失败！请确认密码后重试！",

            // WalletCreateView
            walletCreate_create: "创建钱包",
            walletCreate_password: "输入密码",
            walletCreate_vpass: "确认密码",
            walletCreate_password_notice: "*密码若丢失将无法找回，请谨慎保管",
            walletCreate_doCreate: "创建",
            walletCreate_check_pass: "请检查输入密码",
            walletCreate_check_vpass: "请检查确认密码",
            walletCreate_check_exceed: "设置密码不能超过32个字符",


            // WalletImportView
            walletImport_invalid_file: "请选择有效的钱包文件",
            walletImport_select_file: "请选择钱包文件",
            walletImport_import: "导入钱包",
            walletImport_password: "请输入密码",
            walletImport_doImport: "导入钱包",
            walletImport_bind_succ: "导入钱包成功！",

            // WalletView
            walletView_info: "做不一样，但好玩的游戏！",
            walletView_create: "创建钱包",
            walletView_import: "导入钱包",
            walletCreate_download: "下载钱包",
            walletCreate_doDownload: "下载",

            // main
            main_wait_for_last_tran: "请先确认或者取消上个交易请求再执行",
            main_no_app_wallet: "应用没有配置收款钱包地址，无法充值",
            main_need_open_wallet_confirm: "提现操作需要打开钱包，是否立即打开？",
            main_refund_CGAS_second_fail: "生成转换请求（utxo->gas）失败",
            main_refund_CNEO_second_fail: "生成转换请求（utxo->neo）失败",
            main_refund_getScript_err: "获取转换合约失败！",
            main_refund_sendRequest_err: "发送转换请求失败！",
            main_refund_doFail: "转换合约执行失败！",
            main_broker_deposit_second_fail: "交易所充值失败！",


            errCode_default: "未知错误！错误码： %errCode%",

            // wallet
            wallet_open_check: "请核对钱包文件或密码！",
            wallet_open_check_otcgo: "请核对蓝鲸淘钱包文件！",
            wallet_open_check_otcgo_pwd: "请核对蓝鲸淘钱包密码！",

            // NetMgr
            netmgr_select_api_slow: "与服务器连接异常或缓慢，请检查网络后重试！",
            netmgr_select_node_slow: "与链上节点通讯异常或缓慢，请检查网络后重试！",
            netmgr_select_cli_slow: "与链上节点通讯异常，请检查网络后重试！",
            netmgr_connecting: "连接中，请稍候...",
            netmgr_connecting_fail: "连接失败，请检查网络后重试。",
        }
    }
}