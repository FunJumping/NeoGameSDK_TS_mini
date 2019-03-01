namespace BlackCat {
    export class LangJP extends LangBase {

        lang = {
            return: "戻る",
            copy: "コピー",
            ok: "確認",
            cancel: "キャンセル",
            more: "モット",
            info: "インフォ",
            content: "内容",
            retry: "再び",
            cgas: "CGAS",
            gas: "GAS",
            neo: "NEO",
            cneo: "CNEO",

            main_walletaddr_format_err: "無効なウォレット！",
            main_ETHWallet_format_err: "無効ETHなウォレット！",
            main_BTCWallet_format_err: "無効BTCなウォレット！",
            main_NEOWallet_format_err: "無効NEOなウォレット！",

            // PersonalCenterView
            personalcenter: "インフォセンター",

            // MyInfoView
            myinfo_security: "安全センター",
            myinfo_set: "設定",
            myinfo_logout: "ログアウト",
            myinfo_logoutConfirm: "ログアウト確認",

            // ModifyNetworkLineView
            modifyNet: "ネットライン",
            modifyNet_succ: "設定完了",
            modifyNet_node_err: "ネットラインエラー、他のネットラインを選んでください！",

            //SecurityCenterView
            security_title: "安全センター",
            security_walletOut: "自動ログアウト",
            security_walletOut_admin: "永遠",
            security_walletOut_admin_m: "%minutes% 分",
            security_walletOut_admin_h: "%hours% 時間",
            security_walletOut_toast: "一定時間、何も操作されないときに、ウォレットは自動的にログアウトされ、パスワードを再入力する必要があります",

            // PayListDetailView
            paylist_txid: "注文番号：",
            paylist_wallet: "マイウォレット：",
            paylist_nnc: "契約アドレス：",
            paylist_sbParamJson: "契約パラメータ：",
            paylist_sbPushString: "契約方法：",
            paylist_sbPushString_none: "無し",
            paylist_ctm_year: "%year%年前",
            paylist_ctm_month: "%month%月前",
            paylist_ctm_day: "%day%天前",
            paylist_ctm_hour: "%hour%時前",
            paylist_ctm_minute: "%minute%分前",
            paylist_ctm_recent: "さっき",


            // PayListMoreView
            paylist_noMore: "記録無し",
            paylist_getMore: "読み込む",
            paylist_noRecord: "記録無し",


            // PayReceivablesView
            pay_received: "お預入れ",
            pc_receivables_download: "QRコード",
            pc_receivables_address: "ウォレットアドレス",
            pc_receivables_copy: "コピー完了",

            // PayTransferView
            pay_transfer: "お引出し",
            pay_transferType: "トークン：",
            pay_transferBalance: "残高：",
            pay_transferToAddr: "アドレス",
            pay_transferCount: "金額",
            pay_transferToAddrError: "アドレスエラー",
            pay_transferCountError: "金額エラー",
            pay_transferDoSucc: "完了",
            pay_transferDoFail: "失敗!",
            pay_transferDoFailErr: "失敗!%err%",
            pay_transferGasNotEnough: "GAS残高不足!",
            pay_transferBCPNotEnough: "BCP残高不足!",
            pay_transferBCTNotEnough: "BCT残高不足!",
            pay_transferNEONotEnough: "NEO残高不足!",
            pay_transferCNEONotEnough: "CNEO残高不足!",
            pay_transferCGASNotEnough: "CGAS残高不足!",
            pay_transferETHNotEnough: "ETH残高不足!",
            pay_transferBTCNotEnough: "BTC残高不足!",

            // PayView
            pay_wallet: "マイウォレット",
            pay_refresh: "リフレッシュ",
            pay_wallet_detail: "詳しい",
            pay_coin_name: "トークン",
            pay_coin_old: "CGAS(old)為替",
            pay_chain_1: "BlaCat",
            pay_chain_2: "NEO",
            pay_gas: "GAS",
            pay_gas_desc_2: "GASはNEOブッロクチェーンの仮想通貨です、取引所から手に入れることができます",
            pay_gas_desc_1: "GAS是BlaCat映射",
            pay_cgas: "CGAS",
            pay_cgas_desc: "CGASはBlaCat提供されたトークンです",
            pay_neo: "NEO",
            pay_neo_desc_2: "NEOはNEOブロックチェーンのデジタル通貨であり、取引所で購入することができます",
            pay_neo_desc_1: "NEO是BlaCat映射",
            pay_cneo: "CNEO",
            pay_cneo_desc: "CNEOは、BlaCatがプレーヤーに提供するユニバーサルトークンです",
            pay_bct_desc:"プラットフォーム内のトークンは固定為替レートで合法通貨（USD）に両替されています",
            pay_bcp_desc:"プラットフォーム内のトークンは変動為替レートでバスケットのデジタル通貨をマッピングします",
            pay_btc: "BTC",
            pay_btc_desc:"プラットフォーム内で流通できるトークン（NEP5）",
            pay_eth: "ETH",
            pay_eth_desc:"プラットフォーム内で流通できるトークン（NEP5）",
            pay_send: "お引出し",
            pay_purchase: "買う",
            pay_purchase_testnet_cant_buy: "メインネットにスウィッチしてGASを買ってください！",
            pay_makeMint: "為替",
            pay_recentLists: "取引",
            pay_more: "記録",
            pay_makeMintGasNotEnough: "GAS残高不足",
            pay_makeMintNeoNotEnough: "NEO残高不足",
            pay_makeMintDoFail: "CGAリチャージ失敗！\r\nリチャージ契約エラー！\r\n前のリチャージを確認していて、少々お待ちください！",
            pay_makeMintDoFail2: "CGASリチャージ失敗！\r\nリチャージリクエストエラー！後でもう一度試してください！",
            pay_makeRefundCgasNotEnoughUtxo: "CGAS為替、後でもう一度試してください！",
            pay_makeRefundCneoNotEnoughUtxo: "CNEO為替、後でもう一度試してください！",
            pay_makeRefundCgasNotEnough: "CGAS残高不足",
            pay_makeRefundCneoNotEnough: "CNEO残高不足",
            pay_makeRefundGasFeeNotEnough: "GAS残高不足、手数料の支払いエラー！",
            pay_makeRefundGasLessThanFee: "GASの為替金額より少なくなることはできません！",
            pay_makeRefundDoFail: "引き抜き契約失敗！前のお引出しや為替を確認していて、少々お待ちください！",
            pay_makeRefundDoFail2: "引き抜き契約失敗！ネットをチェックして、もう一度試してください！",
            pay_makeRefundGetScriptFail: "引き抜き契約失敗！",
            pay_makeRefundCgasOldNotEnough: "CGAS(old)残高不足",
            pay_makeRefundCneoOldNotEnough: "CNEO(old)残高不足",
            pay_makeMintGasUtxoCountsLimit: "資産ブロックは規定量を超えて、自らで自分のウォレットに%gas%GASを引き出してください",
            pay_makeMintNeoUtxoCountsLimit: "資産ブロックは規定量を超えて、自らで自分のウォレットに%neo%NEOを引き出してください",
            pay_walletbtn : "ウォレット",
            pay_assets: "仮想資産",
            pay_get: "ゲット",

            pay_not_enough_money: "残高不足",
            pay_not_enough_utxo: "前の商売を成功した後でもう一度試してください！",

            pay_nettype_1: "メインネット",
            pay_nettype_2: "テストネット",

            payview_process: "当前有<font color='red'>%count%</font>交易正在处理中",

            // PayWalletDetailView
            pay_walletDetail: "詳しいウォレット",
            pay_walletDetail_addr: "アドレス：",
            pay_walletDetail_key: "公開鍵：",
            pay_walletDetail_hex: "秘密鍵HEX：",
            pay_walletDetail_wif: "秘密鍵WIF：",
            pay_walletDetail_notice: "秘密鍵を大切に保管しておく必要があります",
            pay_walletDetail_export: "ウォレットをダウンロードする",

            pay_makerawtrans_err: "商売失敗",
            pay_makerawtrans_fee_less: "インターネット料金は不足！%reason%",
            pay_makerawtrans_fee_less_gaslimit: "gasLimitの最低値は %gasLimit%",

            // AddressbookView
            addressbook_title: "連絡先",
            addressbook_search: "捜査",

            // AddressbookDetailsView
            addressbook_det_title: "連絡先",
            addressbook_det_transfer: "お預入れ",
            addressbook_det_address: "ウォレットアドレス",
            addressbook_det_download: "QRコード",
            addressbook_det_describe: "インフォ",
            addressbook_det_empty: "無し",
            addressbook_det_del: "削除する",
            addressbook_det_del_title: "削除する",
            addressbook_det_del_tips: "削除しますか？",
            addressbook_det_del_succ: "完了",


            // AddressbookOpView
            addressbook_op_button: "完了",
            addressbook_op_name: "連絡先",
            addressbook_op_inputName: "連絡先を入力してください",
            addressbook_op_inputName_err: "連絡先を入力してください",
            addressbook_op_address: "ウォレットアドレス",
            addressbook_op_inputAddress: "ウォレットアドレスを入力してください",
            addressbook_op_inputAddress_err: "ウォレットアドレスを入力してください",
            addressbook_op_describe: "インフォ",
            addressbook_op_inputDescribe: "インフォを入力してください",
            addressbook_op_inputDescribe_err: "インフォを入力してください",
            addressbook_op_addSucc: "完了",
            addressbook_op_updateSucc: "完了",

            // PayExchangeView
            pay_exchange_bct: "ゲットBCT",

            //PayExchangeView
            pay_exchange_cgas: "ゲットCGAS",
            pay_exchange_purchase: "買う",
            pay_exchange_price: "今価格",
            pay_exchange_balance: "残高",
            pay_exchange_balance_not_enough: "残高不足！",
            pay_exchange_range: "24H価額",
            pay_exchange_buy_ok: "完了！",
            pay_exchange_consumption: " 消耗：",          
            pay_exchange_placeholderconfirm: "取引数量を確認してください",
            pay_exchange_confirmbuy: "確認",         
            pay_exchange_purchase_process: "取引プロセス",
            pay_exchange_processp1: "1.BlaCatによって提供される%type%ウォレットアドレスは以下にあります。 対応する%type1%を取引所のアカウントに転送してください。その後、システムは自動に%type2%の残高が表示されます。",
           
            // PayExchangeRefundView
            pay_exchange_refund_transfer: "引き出し",
            pay_exchange_refund_all: "すべて",
            pay_exchange_refund_transCount_cost:"手数料：0.0001（BTC）",
            pay_exchange_refund_address:"アドレス",
            pay_exchange_refund_address_error: "アドレスが間違っています！",
            pay_exchange_refund_amount:"引き出し金額",
            pay_exchange_refund_amount_error: "引き出し金額が間違っています！",
            pay_exchange_refund_not_enough: "残高不足！",
            pay_exchange_refund_gas_fee_error: "手数料を支払うのにGASが足りません！",
            pay_exchange_refund_do_succ: "申し込みは成功しました！",
            pay_exchange_refund_do_fail: "申し込みが失敗しました！",
            pay_exchange_refund_range_tips:"右にスライドして加速する",
            pay_exchange_refund_fee_tips:"手数料は%NetFee% GASです",
            

            // PayExchangeBcpDetail
            pay_exchange_bcp: "ゲットBCP",
            pay_exchange_create_wallet_fail: "取引ウォレットを作成できません。しばらくしてからもう一度お試しください！",
            
            // PayExchangeDetailView
            pay_exchange_detail_buy_CGAS_fail: "CGAS購買に失敗した！",
            pay_exchange_detail_buy_BCP_fail: "BCP購買に失敗した！",
            pay_exchange_buyNEO: "購買数量を入力してください",

            pay_exchange_spent_not_enough: "正しい数量を入力してください！",
            pay_exchange_getmore: "%type%をゲット>>",

            // ViewAlert

            // ViewConfirm

            // ViewToast

            // ViewTransactionConfirm
            pay_makeRecharge: "リチャージ",
            pay_trust_tips: "クレジット契約",
            pay_trust_Vice_tips: "この窓は打ち上げることがもうできません。セッティングで手数料を取り替えてください",

            // ViewTransferConfirm
            pay_transfer_toaddr: "アドレス",
            pay_transfer_count: "金額",

            // ViewTransferCount
            pay_transCount_count: "為替",
            pay_transCount_inputCount: "為替金額を入力してください",
            pay_transCount_err: "正しい金額を入力してください",
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
            
            pay_transCountTips_free: "フリー",
            pay_transCountTips_slow: "遅い",
            pay_transCountTips_fast: "早い",
            pay_transCount_speed: "商売\nスピード",
            pay_transCount_cost: "手数料：",
            pay_transCount_tips: "トークンを選んでください",
            pay_transCount_tips_err: "トークンを選んでください",

            // ViewWalletOpen
            pay_walletOpen_password: "パスワード",
            pay_walletOpen_inputPassword: "パスワード",
            pay_walletOpen_inputPassword_err: "パスワードを入力してください",
            pay_walletOpen_file_error: "ウォレットファイルエラー、もう一度ログインしてください",
            pay_walletOpen_openFail: "パスワードエラー！後でもう一度試してください！",

            // WalletCreateView
            walletCreate_create: "ウォレットを作成する",
            walletCreate_password: "パスワード",
            walletCreate_vpass: "確認してください",
            walletCreate_password_notice: "*パスワードを復元できなくて大切に保管してください",
            walletCreate_doCreate: "作成する",
            walletCreate_check_pass: "パスワードをチェックしてください",
            walletCreate_check_vpass: "パスワードをチェックしてください",
            walletCreate_check_exceed: "パスワードは32文字以内で入力して下さい",


            // WalletImportView
            walletImport_invalid_file: "正しいウォレットファイルを選んでください",
            walletImport_select_file: "ウォレットファイル",
            walletImport_import: "ウォレットを加える",
            walletImport_password: "パスワード",
            walletImport_doImport: "縛る",
            walletImport_bind_succ: "完了！",

            // WalletView
            walletView_info: "面白くて特別なゲーム！",
            walletView_create: "ウォレットを作成する",
            walletView_import: "ウォレットを加える",
            walletCreate_download: "Download Wallet",
            walletCreate_doDownload: "download",

            // main
            main_wait_for_last_tran: "前の商売を確認・キャンセルした後でもう一度試してください",
            main_no_app_wallet: "ウォレットアドレスを設置しなくならリチャージ出来ません",
            main_need_open_wallet_confirm: "ウォレットを開けますか？",
            main_refund_CGAS_second_fail: "転換契約リクエスト（utxo->gas）失敗",
            main_refund_CNEO_second_fail: "転換契約リクエスト（utxo->neo）失敗",
            main_refund_getScript_err: "転換契約失敗！",
            main_refund_sendRequest_err: "リクエスト失敗！",
            main_refund_doFail: "転換契約失敗！",
            main_broker_deposit_second_fail: "プリペイドが失敗しました！",


            errCode_default: "エラー！コード： %errCode%",

            // wallet
            wallet_open_check: "ウォレットファイルとパスワードを確認してください！",
            wallet_open_check_otcgo: "SEAウォレットファイルを確認してください！",
            wallet_open_check_otcgo_pwd: "SEAウォレットを確認してください！",

            // NetMgr
            netmgr_select_api_slow: "サーバー通信エラー、チェックしてください！",
            netmgr_select_node_slow: "ノード通信エラー、チェックしてください！",
            netmgr_select_cli_slow: "ノード通信エラー、チェックしてください！",
            netmgr_connecting: "通信中、お待ちしたください",
            netmgr_connecting_fail: "ネットエラー、チェックしてください",
        }
    }
}