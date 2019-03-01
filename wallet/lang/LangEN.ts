namespace BlackCat {
    export class LangEN extends LangBase {

        lang = {
            return: "Back",
            copy: "Copy",
            ok: "OK",
            cancel: "Cancel",
            more: "More",
            info: "Information",
            content: "Content",
            retry: "Retry",
            cgas: "CGAS",
            gas: "GAS",
            neo: "NEO",
            cneo: "CNEO",

            main_walletaddr_format_err: "Wallet address format is incorrect!",
            main_ETHWallet_format_err: "ETH Wallet address format is incorrect!",
            main_BTCWallet_format_err: "BTC Wallet address format is incorrect!",
            main_NEOWallet_format_err: "NEO Wallet address format is incorrect!",

            // PersonalCenterView
            personalcenter: "My Info",

            // MyInfoView
            myinfo_security: "Security Center",
            myinfo_set: "Set",
            myinfo_logout: "Logout",
            myinfo_logoutConfirm: "Are you sure to log out?",

            // ModifyNetworkLineView
            modifyNet: "Network line",
            modifyNet_succ: "Network line modified successfully!",
            modifyNet_node_err: "This network line is not available, please choose another line!",

            //SecurityCenterView
            security_title: "Security Center",
            security_walletOut: "Automatically log out",
            security_walletOut_admin: "Never",
            security_walletOut_admin_m: "%minutes% minute(s)",
            security_walletOut_admin_h: "%hours% hour(s)",
            security_walletOut_toast: "When the wallet is not operated for more than a certain period of time, it will be automatically logged out and the password needs to be re-inputted",

            // PayListDetailView
            paylist_txid: "Trading order number:",
            paylist_wallet: "My wallet:",
            paylist_nnc: "Contract address:",
            paylist_sbParamJson: "Contract parameters:",
            paylist_sbPushString: "Contract method:",
            paylist_sbPushString_none: "None",
            paylist_ctm_year: "%year% year(s) ago",
            paylist_ctm_month: "%month% month(s) ago",
            paylist_ctm_day: "%day% day(s) ago",
            paylist_ctm_hour: "%hour% hour(s) ago",
            paylist_ctm_minute: "%minute% minute(s) ago",
            paylist_ctm_recent: "Just now",


            // PayListMoreView
            paylist_noMore: "No more records",
            paylist_getMore: "Click to load more records",
            paylist_noRecord: "No record",


            // PayReceivablesView
            pay_received: "Receive",
            pc_receivables_download: "Download QR Code",
            pc_receivables_address: "Wallet address",
            pc_receivables_copy: "Copy success",

            // PayTransferView
            pay_transfer: "SEND",
            pay_transferType: "Token：",
            pay_transferBalance: "Balance:",
            pay_transferToAddr: "Address",
            pay_transferCount: "Amounts",
            pay_transferToAddrError: "The SEND address is incorrect!",
            pay_transferCountError: "The number of SEND is incorrect!",
            pay_transferDoSucc: "SEND success",
            pay_transferDoFail: "SEND failed!",
            pay_transferDoFailErr: "SEND failed!%err%",
            pay_transferGasNotEnough: "GAS balance is insufficient!",
            pay_transferBCPNotEnough: "BCP balance is insufficient!",
            pay_transferBCTNotEnough: "BCT balance is insufficient!",
            pay_transferNEONotEnough: "NEO balance is insufficient!",
            pay_transferCNEONotEnough: "CNEO balance is insufficient!",
            pay_transferCGASNotEnough: "CGAS balance is insufficient!",
            pay_transferETHNotEnough: "ETH balance is insufficient!",
            pay_transferBTCNotEnough: "BTC balance is insufficient!",

            // PayView
            pay_wallet: "My Wallet",
            pay_refresh: "Refresh",
            pay_wallet_detail: "Details",
            pay_coin_name: "Token",
            pay_coin_old: "CGAS(old)Exchange",
            pay_chain_1: "BlaCat",
            pay_chain_2: "NEO",
            pay_gas: "GAS",
            pay_gas_desc_2: "GAS is a digital currency on NEO chain that can be obtained through exchanges",
            pay_gas_desc_1: "GAS是BlaCat映射",
            pay_cgas: "CGAS",
            pay_cgas_desc: "CGAS is a universal chip that BlaCat offers to players.",
            pay_neo: "NEO",
            pay_neo_desc_2: "NEO is the digital currency in NEO blockchain and can be bought in Exchange",
            pay_neo_desc_1: "NEO是BlaCat映射",
            pay_cneo: "CNEO",
            pay_cneo_desc: "CNEO is the universal token provided by BlaCat to player",
            pay_bct_desc:"The circulation token of the platform will be attached at the legal currency (US dollar) at a fixed exchange rate",
            pay_bcp_desc:"The circulation token of the platform will map a basket of digital currency at a floating exchange rate",
            pay_btc: "BTC",
            pay_btc_desc:"Mapping tokens (NEP5) that can be circulated within the platform",
            pay_eth: "ETH",
            pay_eth_desc:"Mapping tokens (NEP5) that can be circulated within the platform",
            pay_send: "SEND",
            pay_purchase: "Purchase",
            pay_purchase_testnet_cant_buy: "Please switch Mainnet to buy GAS!",
            pay_makeMint: "Exchange",
            pay_recentLists: "Pending",
            pay_more: "Records",
            pay_makeMintGasNotEnough: "GAS balance is insufficient",
            pay_makeMintNeoNotEnough: "NEO balance is insufficient",
            pay_makeMintDoFail: "Recharge CGAS failed!\r\n Recharge contract execution failed!\r\nPlease wait for the last recharge confirmation before proceeding!",
            pay_makeMintDoFail2: "Recharge CGAS failed! \r\nFailed to send recharge request! Please check network and try again later!",
            pay_makeRefundCgasNotEnoughUtxo: "CGAS exchange is busy, please try it again later!",
            pay_makeRefundCneoNotEnoughUtxo: "CNEO exchange is busy, please try it again later!",
            pay_makeRefundCgasNotEnough: "CGAS balance is insufficient",
            pay_makeRefundCneoNotEnough: "CNEO balance is insufficient",
            pay_makeRefundGasFeeNotEnough: "GAS balance is insufficient.",
            pay_makeRefundGasLessThanFee: "The amount of GAS cannot be less than the handling fee.",
            pay_makeRefundDoFail: "The extraction contract execution failed! Please wait for the last withdrawal or redemption transaction to complete!",
            pay_makeRefundDoFail2: "Sending an extraction transaction failed! Please check network and try again later!",
            pay_makeRefundGetScriptFail: "Getting extraction contract failed!",
            pay_makeRefundCgasOldNotEnough: "CGAS(old) balance is insufficient",
            pay_makeRefundCneoOldNotEnough: "CNEO(old) balance is insufficient",
            pay_makeMintGasUtxoCountsLimit: "Assets exceed the maximum, please input your wallet address then transfer %gas% GAS to your own wallet first.",
            pay_makeMintNeoUtxoCountsLimit: "Assets exceed the maximum, please input your wallet address then transfer %neo% NEO to your own wallet first.",
            pay_walletbtn: "Wallet",
            pay_assets: "Assets",
            pay_get: "Get",

            pay_not_enough_money: "Insufficient balance",
            pay_not_enough_utxo: "Please wait for the last transaction to complete before executing!",

            pay_nettype_1: "Mainnet",
            pay_nettype_2: "Testnet",

            payview_process: "<font color='red'>%count%</font> trans in progress",

            // PayWalletDetailView
            pay_walletDetail: "Wallet details",
            pay_walletDetail_addr: "Address:",
            pay_walletDetail_key: "Public Key:",
            pay_walletDetail_hex: "KEY HEX:",
            pay_walletDetail_wif: "KEY WIF:",
            pay_walletDetail_notice: "To avoid property damage, please prevent leakage when you open the key.",
            pay_walletDetail_export: "Export wallet",

            pay_makerawtrans_err: "Transaction failed!",
            pay_makerawtrans_fee_less: "Insufficient internet handling fee!%reason%",
            pay_makerawtrans_fee_less_gaslimit: "gasLimit no less than %gasLimit%",

            // AddressbookView
            addressbook_title: "Mail list",
            addressbook_search: "Search",

            // AddressbookDetailsView
            addressbook_det_title: "Mail list",
            addressbook_det_transfer: "Transfer",
            addressbook_det_address: "Wallet address",
            addressbook_det_download: "Download QR Code",
            addressbook_det_describe: "Describe",
            addressbook_det_empty: "Empty",
            addressbook_det_del: "Delete Contact",
            addressbook_det_del_title: "Delete",
            addressbook_det_del_tips: "Confirm to delete this contact?",
            addressbook_det_del_succ: "Delete success",


            // AddressbookOpView
            addressbook_op_button: "Complete",
            addressbook_op_name: "Contacts",
            addressbook_op_inputName: "Please input Contacts",
            addressbook_op_inputName_err: "Please input Contacts",
            addressbook_op_address: "Wallet address",
            addressbook_op_inputAddress: "Please input wallet address",
            addressbook_op_inputAddress_err: "Please input wallet address",
            addressbook_op_describe: "Describe",
            addressbook_op_inputDescribe: "Please input Describe",
            addressbook_op_inputDescribe_err: "Please input Describe",
            addressbook_op_addSucc: "Contact added success",
            addressbook_op_updateSucc: "Contact modify success",

            // PayExchangeView
            pay_exchange_bct: "Get BCT",

            //PayExchangeView
            pay_exchange_cgas: "Get CGAS",
            pay_exchange_purchase: "Purchase",
            pay_exchange_price: "Latest price",
            pay_exchange_balance: "Balance",
            pay_exchange_balance_not_enough: "balance is insufficient!",
            pay_exchange_range: "24H Range",
            pay_exchange_buy_ok: "Succeeded!",
            pay_exchange_consumption: " consumption：",
            pay_exchange_placeholderconfirm: "Please confirm your purchase",
            pay_exchange_confirmbuy: "Confirm",
            pay_exchange_purchase_process: "Purchase process",
            pay_exchange_processp1: "1.%type% address provided by platform can be found below. Please transfer the corresponding %type1% to the account in Exchange then the system will show your %type2% balance.",

            // PayExchangeRefundView
            pay_exchange_refund_transfer: "Withdraw",
            pay_exchange_refund_all: "All",
            pay_exchange_refund_transCount_cost:"Transfer Cost: 0.0001(NEO)",
            pay_exchange_refund_address:"Address",
            pay_exchange_refund_address_error: "Address is wrong！",
            pay_exchange_refund_amount:"Amount",
            pay_exchange_refund_amount_error: "The withdrawal amount is wrong！",
            pay_exchange_refund_not_enough: "Insufficient balance！",
            pay_exchange_refund_gas_fee_error: "Insufficient GAS for handling fee！",
            pay_exchange_refund_do_succ: "Application succeeded！",
            pay_exchange_refund_do_fail: "Application failed！",
            pay_exchange_refund_range_tips:"Slide to the right to accelerate",
            pay_exchange_refund_fee_tips:"%NetFee% GAS for handling fee",
            

            // PayExchangeBcpDetail
            pay_exchange_bcp: "Get BCP",
            pay_exchange_create_wallet_fail: "Failed to create a trading wallet, please try it later!",

            // PayExchangeDetailView
            pay_exchange_detail_buy_CGAS_fail: "Fail to buy CGAS!",
            pay_exchange_detail_buy_BCP_fail: "Fail to buy BCP!",
            pay_exchange_buyNEO: "Please input the purchase amount",

            pay_exchange_spent_not_enough: "Incorrect amount!",
            pay_exchange_getmore: "Get %type%>>",

            // ViewAlert

            // ViewConfirm

            // ViewToast

            // ViewTransactionConfirm
            pay_makeRecharge: "Recharge",
            pay_trust_tips: "Trust contracts",
            pay_trust_Vice_tips: "Window will not pop up in this trade, please change handling fee in page My information.",

            // ViewTransferConfirm
            pay_transfer_toaddr: "transfer address",
            pay_transfer_count: "Transfer amounts",

            // ViewTransferCount
            pay_transCount_count: "Exchange",
            pay_transCount_inputCount: "Please input amount",
            pay_transCount_err: "Please input correct sums of amounts",
            pay_transCountGAS: "GAS:",
            pay_transCountCGAS: "CGAS:",
            pay_transCountCGASOLD: "CGAS(old):",
            pay_transCountCGAS2GAS: "GAS",
            pay_transCountGAS2CGAS: "CGAS",
            pay_transCountCGASOLD2OLD: "CGAS(old)",

            pay_transCountNEO: "NEO：",
            pay_transCountCNEO: "CNEO：",
            pay_transCountCNEOOLD: "CNEO(old)：",
            pay_transCountCNEO2NEO: "NEO",
            pay_transCountNEO2CNEO: "CNEO",
            pay_transCountCNEOOLD2OLD: "CNEO(old)",

            pay_transCountTips_free: "Free",
            pay_transCountTips_slow: "Slow",
            pay_transCountTips_fast: "Fast",
            pay_transCount_speed: "Trade SPD",
            pay_transCount_cost: "Fee：",
            pay_transCount_tips: "Choose the token you want to exchange",
            pay_transCount_tips_err: "Choose the token you want to exchange",

            // ViewWalletOpen
            pay_walletOpen_password: "password",
            pay_walletOpen_inputPassword: "wallet password",
            pay_walletOpen_inputPassword_err: "Please enter the wallet password",
            pay_walletOpen_file_error: "Wallet file parsing is abnormal, please log in again",
            pay_walletOpen_openFail: "Fail to open wallet!Please try it again!",

            // WalletCreateView
            walletCreate_create: "Create a wallet",
            walletCreate_password: "enter password",
            walletCreate_vpass: "confirm password",
            walletCreate_password_notice: "*Password can not be retrieved. Please keep it carefully.",
            walletCreate_doCreate: "Create",
            walletCreate_check_pass: "Please check the input password",
            walletCreate_check_vpass: "Please check the confirmation password",
            walletCreate_check_exceed: "Please set your password within 32 letters",


            // WalletImportView
            walletImport_invalid_file: "Please select a valid wallet file",
            walletImport_select_file: "Please select the wallet file",
            walletImport_import: "Import wallet",
            walletImport_password: "Please enter the password",
            walletImport_doImport: "Import",
            walletImport_bind_succ: "Import the wallet successfully!",

            // WalletView
            walletView_info: "Do a game different and fun!",
            walletView_create: "Create Wallet",
            walletView_import: "Import Wallet",
            walletCreate_download: "Download Wallet",
            walletCreate_doDownload: "download",

            // main
            main_wait_for_last_tran: "Please confirm or cancel the previous transaction request and then execute",
            main_no_app_wallet: "The app does not have a billing wallet address configured and cannot be recharged.",
            main_need_open_wallet_confirm: "The withdrawal operation needs to open the wallet, is it open immediately? ",
            main_refund_CGAS_second_fail: "Generate conversion request (utxo->gas) failed",
            main_refund_CNEO_second_fail: "Generate conversion request (utxo->neo) failed",
            main_refund_getScript_err: "Failed to get conversion contract!",
            main_refund_sendRequest_err: "Sending a conversion request failed!",
            main_refund_doFail: "Conversion contract execution failed!",
            main_broker_deposit_second_fail: "Recharge failed！",


            errCode_default: "Unknown error! Error code: %errCode%",

            // wallet
            wallet_open_check: "Please check your wallet file or password!",
            wallet_open_check_otcgo: "Please check the Otcgo wallet file!",
            wallet_open_check_otcgo_pwd: "Please check the Otcgo wallet password!",

            // NetMgr
            netmgr_select_api_slow: "Connection to the server is abnormal or slow, please check the network and try it again!",
            netmgr_select_node_slow: "Communication with the nodes on the chain is abnormal or slow, please check the network and try it later!",
            netmgr_select_cli_slow: "Communication with the nodes on the chain is abnormal, please check the network and try it later!",
            netmgr_connecting: "Connecting ...",
            netmgr_connecting_fail: "Connection failed. Please check the network and try it again!",
        }
    }
}