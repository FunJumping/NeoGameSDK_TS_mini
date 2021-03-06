

// /// <reference path="./importpack.ts" />

namespace BlackCat.tools {
    export class CoinToolNeo {
        static readonly id_GAS: string = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
        static readonly id_NEO: string = "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
        
        static id_CGAS: string = "";
        static id_CGAS_OLD: Array<string> = [];

        static id_CNEO: string = ""
        static id_CNEO_OLD: Array<string> = [];

        static id_BCT: string = "";
        static id_BCP: string = "";
        
        // BCT
        static id_BCT_DESTROY: string = ""
        // BTC-nep5
        static id_BTC: string = "";
        static id_BTC_DESTROY: string = "";
        // ETH-nep5
        static id_ETH: string = "";
        static id_ETH_DESTROY: string = "";
        // CNEO
        static id_CNEO_DESTROY: string = ""

        // bancor合约地址
        static id_bancor: string = ""

        // 购买会员转账地址
        static BUY_VIP_ADDR: string = ""

        // broker合约地址
        static id_broker: string = ""


        static assetID2name: { [id: string]: string } = {};
        static name2assetID: { [id: string]: string } = {};
        static async initAllAsset() {
            var allassets = await tools.WWWNeo.api_getAllAssets();
            for (var a in allassets) {
                var asset = allassets[a];
                var names = asset.name;
                var id = asset.id;
                var name: string = "";
                if (id == CoinToolNeo.id_GAS) {
                    name = "GAS";
                }
                else if (id == CoinToolNeo.id_NEO) {
                    name = "NEO";
                }
                else {
                    for (var i in names) {
                        name = names[i].name;
                        if (names[i].lang == "en")
                            break;
                    }
                }
                CoinToolNeo.assetID2name[id] = name;
                CoinToolNeo.name2assetID[name] = id;
            }
        }

        /**
         * 获得utxos
         */
        static async getassets(): Promise<{ [id: string]: UTXO[] }> {
            //获得高度
            var height = await tools.WWWNeo.api_getHeight_nodes();
            var utxos = await tools.WWWNeo.api_getUTXO(tools.StorageTool.getStorage("current-address"));   //获得utxo
            var olds = OldUTXO.getOldutxos();       //获得以标记的utxo(交易过的utxo 存储在本地的标记)

            var olds2 = new Array<OldUTXO>();       //
            for (let n = 0; n < olds.length; n++) {
                const old = olds[n];
                let findutxo = false;
                for (let i = 0; i < utxos.length; i++) {
                    let utxo = utxos[i];

                    // console.log('utxo=> ', utxo, ', old => ', old)

                    if (utxo.txid == old.txid && old.n == utxo.n && height - old.height <= 2) {
                        findutxo = true;
                        utxos.splice(i, 1);
                    }
                }
                if (findutxo) {
                    olds2.push(old);
                }
            }
            OldUTXO.setOldutxos(olds2);
            var assets = {};        //对utxo进行归类，并且将count由string转换成 Neo.Fixed8
            for (var i in utxos) {
                var item = utxos[i];
                var asset = item.asset;
                if (assets[asset] == undefined || assets[asset] == null) {
                    assets[asset] = [];
                }
                let utxo = new UTXO();
                utxo.addr = item.addr;
                utxo.asset = item.asset;
                utxo.n = item.n;
                utxo.txid = item.txid;
                utxo.count = Neo.Fixed8.parse(item.value);
                assets[asset].push(utxo);
            }
            // }
            return assets;
        }

        /**
         * @method 创建交易对象 ThinNeo.Transaction
         * @param utxos utxo列表
         * @param targetaddr 对方地址
         * @param assetid 资产id
         * @param sendcount 金额
         * @param net_fee 网络手续费，默认Neo.Fixed8.Zero
         * @param left_fee 余额作为网络手续费，默认0，需要找零；
         * @param split 是否需要拆分utxo，默认false，不拆分；为了取整，一般拆分10份
         */
        static makeTran(utxos: { [id: string]: UTXO[] }, targetaddr: string, assetid: string, sendcount: Neo.Fixed8, net_fee: Neo.Fixed8 = Neo.Fixed8.Zero, left_fee: number = 0, split: boolean = false): Result {
            //if (sendcount.compareTo(Neo.Fixed8.Zero) <= 0)
            //    throw new Error("can not send zero.");

            var split_num = 10; // 拆分10份
            var split_min = 1; // 找零大于split_min，再进行拆分

            var res = new Result();
            var us = utxos[assetid];
            if (us == undefined) {
                // res.err = true;
                // res.info = "no enough money.";
                throw new Error("pay_not_enough_utxo");
            }

            var tran = new ThinNeo.Transaction();
            tran.type = ThinNeo.TransactionType.ContractTransaction;
            tran.version = 0;//0 or 1
            tran.extdata = null;

            tran.attributes = [];

            tran.inputs = [];
            var scraddr: string = "";
            utxos[assetid].sort((a, b) => {
                return a.count.compareTo(b.count);
            });
            var count: Neo.Fixed8 = Neo.Fixed8.Zero;
            var clonearr = [].concat(us);       //用于返回剩余可用的utxo
            var old: OldUTXO[] = []
            var sendcounts = sendcount.add(net_fee); // 加入手续费


            for (var i = 0; i < us.length; i++) {
                var input = new ThinNeo.TransactionInput();
                input.hash = us[i].txid.hexToBytes().reverse();
                input.index = us[i].n;
                input["_addr"] = us[i].addr;//利用js的隨意性，臨時傳個值
                tran.inputs.push(input);        //将utxo塞入input
                count = count.add(us[i].count);//添加至count中
                scraddr = us[i].addr;
                clonearr.shift();               //删除已塞入的utxo
                old.push(new OldUTXO(us[i].txid, us[i].n, assetid));

                if (split) {
                    // 需要拆分
                    if (us.length >= split_num) {
                        // utxo数量已经很多了，不用再拆
                        if (count.compareTo(sendcount) > 0) {
                            // gas数量足够了
                            break;
                        }
                    }
                }
                else {
                    // 不拆分，只要gas数量足够就中断
                    if (count.compareTo(sendcount) > 0) {
                        break;
                    }
                }
                if (us.length >= split_num && count.compareTo(sendcounts) > 0) // 如果utxo数量大于拆分最小数量，判断输入是否足够
                {
                    break;      //如果足够则跳出循环
                }
            }

            if (count.compareTo(sendcounts) >= 0)//输入大于等于输出
            {
                tran.outputs = [];
                //输出
                if (sendcount.compareTo(Neo.Fixed8.Zero) > 0) {
                    var output = new ThinNeo.TransactionOutput();
                    output.assetId = assetid.hexToBytes().reverse();
                    output.value = sendcount;
                    output.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(targetaddr);
                    tran.outputs.push(output);
                }

                //找零
                if (left_fee == 0) {
                    var change = count.subtract(sendcounts);
                    if (change.compareTo(Neo.Fixed8.Zero) > 0) {
                        // 找零>split_min并且utxo数量<split_num
                        if (split && change.compareTo(Neo.Fixed8.fromNumber(split_min)) > 0 && us.length < split_num) {
                            // 拆分utxo
                            var change_num: number = change.getData().toNumber() / 100000000
                            // 取整
                            var change_int = Math.trunc(change_num)
                            // 取1份
                            var change_1 = change_int / split_num
                            // 塞入找零
                            for (let i = 0; i<split_num; i++) {
                                var outputchange = new ThinNeo.TransactionOutput();
                                outputchange.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(scraddr);
                                outputchange.value = Neo.Fixed8.fromNumber(change_1);
                                outputchange.assetId = assetid.hexToBytes().reverse();
                                tran.outputs.push(outputchange);
                            }
                            // 塞入小数零钱
                            var litt = change.subtract(Neo.Fixed8.fromNumber(change_int))
                            if (litt.compareTo(Neo.Fixed8.Zero) > 0) {
                                var outputchange = new ThinNeo.TransactionOutput();
                                outputchange.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(scraddr);
                                outputchange.value = litt
                                outputchange.assetId = assetid.hexToBytes().reverse();
                                tran.outputs.push(outputchange);
                            }

                            console.log("[BlaCat]", "[cointool]", "[makeTran]", "拆分utxo, change_1 =>", change_1, "litt =>", litt.getData().toNumber())
                        }
                        else {
                            // 不拆分utxo
                            var outputchange = new ThinNeo.TransactionOutput();
                            outputchange.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(scraddr);
                            outputchange.value = change;
                            outputchange.assetId = assetid.hexToBytes().reverse();
                            tran.outputs.push(outputchange);
                        }
                    }
                }
                
                res.err = false;
                res.info = { "tran": tran, "oldarr": old };

            }
            else {
                throw new Error("pay_not_enough_money");
            }
            return res;
        }

        /**
         * @method 创建批量交易对象 ThinNeo.Transaction
         * @param utxos utxo列表
         * @param targets 信息数组
         * @param assetid 资产id
         * @param net_fee 手续费
         */
        static makeTranMulti(utxos: { [id: string]: UTXO[] }, targets: Array<{ toaddr: string, count: string }>, assetid: string, net_fee: Neo.Fixed8 = Neo.Fixed8.Zero): Result {
            // 计算总count
            var _count: number = 0;
            for (let i = 0; i < targets.length; i++) {
                _count += Number(targets[i].count)
            }
            if (_count <= 0) {
                throw new Error("can_not_send_zero");
            }
            var sendcount = Neo.Fixed8.fromNumber(_count)

            var res = new Result();
            var us = utxos[assetid];
            if (us == undefined) {
                // res.err = true;
                // res.info = "no enough money.";
                throw new Error("pay_not_enough_utxo");
            }

            var tran = new ThinNeo.Transaction();
            tran.type = ThinNeo.TransactionType.ContractTransaction;
            tran.version = 0;//0 or 1
            tran.extdata = null;

            tran.attributes = [];

            tran.inputs = [];
            var scraddr: string = "";
            utxos[assetid].sort((a, b) => {
                return a.count.compareTo(b.count);
            });
            var count: Neo.Fixed8 = Neo.Fixed8.Zero;
            var clonearr = [].concat(us);       //用于返回剩余可用的utxo
            var old: OldUTXO[] = []
            var sendcounts = sendcount.add(net_fee); // 加入手续费

            for (var i = 0; i < us.length; i++) {
                var input = new ThinNeo.TransactionInput();
                input.hash = us[i].txid.hexToBytes().reverse();
                input.index = us[i].n;
                input["_addr"] = us[i].addr;//利用js的隨意性，臨時傳個值
                tran.inputs.push(input);        //将utxo塞入input
                count = count.add(us[i].count);//添加至count中
                scraddr = us[i].addr;
                clonearr.shift();               //删除已塞入的utxo
                old.push(new OldUTXO(us[i].txid, us[i].n, assetid));
                if (count.compareTo(sendcounts) > 0) //判断输入是否足够
                {
                    break;      //如果足够则跳出循环
                }
            }


            if (count.compareTo(sendcounts) >= 0)//输入大于等于输出
            {
                tran.outputs = [];
                //输出
                if (sendcount.compareTo(Neo.Fixed8.Zero) > 0) {
                    for (let k = 0; k < targets.length; k++) {
                        var output = new ThinNeo.TransactionOutput();
                        output.assetId = assetid.hexToBytes().reverse();
                        output.value = Neo.Fixed8.parse(targets[k].count + "") // sendcount;
                        output.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(targets[k].toaddr);
                        tran.outputs.push(output);
                    }
                }

                //找零
                var change = count.subtract(sendcounts);
                if (change.compareTo(Neo.Fixed8.Zero) > 0) {
                    var outputchange = new ThinNeo.TransactionOutput();
                    outputchange.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(scraddr);
                    outputchange.value = change;
                    outputchange.assetId = assetid.hexToBytes().reverse();
                    tran.outputs.push(outputchange);

                }
                res.err = false;
                res.info = { "tran": tran, "oldarr": old };
            }
            else {
                throw new Error("pay_not_enough_money");
            }
            return res;
        }

        /**
         * utxo转账方法
         * @param targetaddr 转入的地址
         * @param asset 资产
         * @param count 金额
         * @param net_fee 手续费
         */
        static async rawTransaction(targetaddr: string, asset: string, count: string, net_fee: Neo.Fixed8 = Neo.Fixed8.Zero): Promise<Result> {

            var arr = tools.StorageTool.getLoginArr();
            var add = tools.StorageTool.getStorage("current-address")
            //var n = arr.findIndex(login => login.address == add);
            try {
                var n: number = arr.findIndex(login => login.address == add);
            }
            catch (e) {
                var n: number;
                for (let i = 0; i < arr.length; i++) {
                    if (add == arr[i].address) {
                        n = i;
                        break;
                    }
                }
            }
            var _count = Neo.Fixed8.parse(count + "");
            var utxos = await CoinToolNeo.getassets();

            if (asset == tools.CoinToolNeo.id_GAS) {
                // GAS
                try {
                    var tranres = CoinToolNeo.makeTran(utxos, targetaddr, asset, _count, net_fee, 0);  //获得tran和改变后的utxo
                    var tran: ThinNeo.Transaction = tranres.info['tran'];
    
                    if (tran.witnesses == null)
                        tran.witnesses = [];
                    let txid = "0x" + tran.GetHash().clone().reverse().toHexString();
                    var msg = tran.GetMessage().clone();
                    var pubkey = arr[n].pubkey.clone();
                    var prekey = arr[n].prikey.clone();
                    var addr = arr[n].address;
                    var signdata = ThinNeo.Helper.Sign(msg, prekey);
                    tran.AddWitness(signdata, pubkey, addr);
    
                    var data: Uint8Array = tran.GetRawData();
    
                    var res: Result = new Result();
                    var height = await tools.WWWNeo.api_getHeight_nodes();
                    var result = await tools.WWWNeo.api_postRawTransaction(data);
                    if (result["sendrawtransactionresult"]) {
                        res.err = !result;
                        res.info = txid;
                        let olds = tranres.info['oldarr'] as OldUTXO[];
                        olds.map(old => old.height = height);
                        OldUTXO.oldutxosPush(olds);
                    }
                    else {
                        res.err = true;
                        res.info = "no txid"
                    }
                    return res;
                } catch (error) {
                    throw error;
                }
            }
            else {
                // NEO
                try {
                    var tranres = CoinToolNeo.makeTran(utxos, targetaddr, asset, _count, Neo.Fixed8.Zero, 0);  //获得tran和改变后的utxo
                    
                    // 手续费
                    if (net_fee.compareTo(Neo.Fixed8.Zero) > 0) {
                        // 有手续费
                        var user_makeTranRes: Result = tools.CoinToolNeo.makeTran(
                            utxos,
                            add,
                            tools.CoinToolNeo.id_GAS,
                            Neo.Fixed8.Zero,
                            net_fee,
                        );
                        // inputs、outputs、oldarr塞入
                        var user_tran = user_makeTranRes.info.tran
                        for (let i = 0; i < user_tran.inputs.length; i++) {
                            tranres.info.tran.inputs.push(user_tran.inputs[i])
                        }
                        for (let i = 0; i < user_tran.outputs.length; i++) {
                            tranres.info.tran.outputs.push(user_tran.outputs[i])
                        }
                        var user_oldarr = user_makeTranRes.info.oldarr
                        for (let i = 0; i < user_oldarr.length; i++) {
                            tranres.info.oldarr.push(user_oldarr[i])
                        }
                    }

                    var tran: ThinNeo.Transaction = tranres.info['tran'];
    
                    if (tran.witnesses == null)
                        tran.witnesses = [];
                    let txid = "0x" + tran.GetHash().clone().reverse().toHexString();
                    var msg = tran.GetMessage().clone();
                    var pubkey = arr[n].pubkey.clone();
                    var prekey = arr[n].prikey.clone();
                    var addr = arr[n].address;
                    var signdata = ThinNeo.Helper.Sign(msg, prekey);
                    tran.AddWitness(signdata, pubkey, addr);
    
                    var data: Uint8Array = tran.GetRawData();
    
                    var res: Result = new Result();
                    var height = await tools.WWWNeo.api_getHeight_nodes();
                    var result = await tools.WWWNeo.api_postRawTransaction(data);
                    if (result["sendrawtransactionresult"]) {
                        res.err = !result;
                        res.info = txid;
                        let olds = tranres.info['oldarr'] as OldUTXO[];
                        olds.map(old => old.height = height);
                        OldUTXO.oldutxosPush(olds);
                    }
                    else {
                        res.err = true;
                        res.info = "no txid"
                    }
                    return res;
                } catch (error) {
                    throw error;
                }
            }
            
        }

        /**
         * utxo转账方法
         * @param targets 批量转账信息数组
         * @param asset 资产
         * @param net_fee 手续费
         */
        static async rawTransactionMulti(targets: Array<any>, asset: string, net_fee: Neo.Fixed8 = Neo.Fixed8.Zero): Promise<Result> {

            var arr = tools.StorageTool.getLoginArr();
            var add = tools.StorageTool.getStorage("current-address")
            //var n = arr.findIndex(login => login.address == add);
            try {
                var n: number = arr.findIndex(login => login.address == add);
            }
            catch (e) {
                var n: number;
                for (let i = 0; i < arr.length; i++) {
                    if (add == arr[i].address) {
                        n = i;
                        break;
                    }
                }
            }

            var utxos = await CoinToolNeo.getassets();
            try {
                var tranres = CoinToolNeo.makeTranMulti(utxos, targets, asset, net_fee);  //获得tran和改变后的utxo
                var tran: ThinNeo.Transaction = tranres.info['tran'];

                if (tran.witnesses == null)
                    tran.witnesses = [];
                let txid = "0x" + tran.GetHash().clone().reverse().toHexString();
                var msg = tran.GetMessage().clone();
                var pubkey = arr[n].pubkey.clone();
                var prekey = arr[n].prikey.clone();
                var addr = arr[n].address;
                var signdata = ThinNeo.Helper.Sign(msg, prekey);
                tran.AddWitness(signdata, pubkey, addr);

                var data: Uint8Array = tran.GetRawData();

                var res: Result = new Result();
                var height = await tools.WWWNeo.api_getHeight_nodes();
                var result = await tools.WWWNeo.api_postRawTransaction(data);
                if (result["sendrawtransactionresult"]) {
                    res.err = !result;
                    res.info = txid;
                    let olds = tranres.info['oldarr'] as OldUTXO[];
                    olds.map(old => old.height = height);
                    OldUTXO.oldutxosPush(olds);
                }
                else {
                    res.err = true;
                    res.info = "no txid"
                }
                return res;
            } catch (error) {
                throw error;
            }
        }


        /**
         * invokeTrans 方式调用合约塞入attributes
         * @param script 合约的script
         */
        static async contractInvokeTrans_attributes(script: Uint8Array, net_fee: string = "0", not_send: boolean = false) {
            let current: LoginInfo = LoginInfo.getCurrentLogin();
            var addr = current.address;

            var tran: ThinNeo.Transaction;

            // 有网络手续费
            if (Number(net_fee) > 0) {

                // makeTranRes.info.tran.extdata.gas = Neo.Fixed8.fromNumber(Number(net_fee));
                try {
                    // 获取用户utxo
                    var user_utxos_assets = await tools.CoinToolNeo.getassets();
                    console.log("[BlaCat]", '[cointool]', '[contractInvokeTrans_attributes]', 'user_utxos_assets => ', user_utxos_assets)

                    var user_makeTranRes: Result = tools.CoinToolNeo.makeTran(
                        user_utxos_assets,
                        Main.user.info.wallet,
                        tools.CoinToolNeo.id_GAS,
                        Neo.Fixed8.Zero,
                        Neo.Fixed8.fromNumber(Number(net_fee)),
                    );

                    // inputs、outputs、oldarr塞入
                    var tran = user_makeTranRes.info.tran as ThinNeo.Transaction
                    var oldarr = user_makeTranRes.info.oldarr
                    console.log("[BlaCat]", '[cointool]', '[contractInvokeTrans_attributes]', 'user_makeTranRes => ', user_makeTranRes)
                }
                catch (e) {
                    var res: Result = new Result();
                    res.err = true
                    res.info = e.toString()
                    return res;
                }
            }
            else {
                tran = new ThinNeo.Transaction();
                //合约类型
                tran.inputs = [];
                tran.outputs = [];
            }


            tran.type = ThinNeo.TransactionType.InvocationTransaction;
            tran.extdata = new ThinNeo.InvokeTransData();
            //塞入脚本
            (tran.extdata as ThinNeo.InvokeTransData).script = script;
            tran.attributes = new Array<ThinNeo.Attribute>(1);
            tran.attributes[0] = new ThinNeo.Attribute();
            tran.attributes[0].usage = ThinNeo.TransactionAttributeUsage.Script;
            tran.attributes[0].data = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(addr);

            if (tran.witnesses == null)
                tran.witnesses = [];
            var msg = tran.GetMessage().clone();
            var pubkey = current.pubkey.clone();
            var prekey = current.prikey.clone();
            var signdata = ThinNeo.Helper.Sign(msg, prekey);
            tran.AddWitness(signdata, pubkey, addr);
            var data: Uint8Array = tran.GetRawData();

            let txid = "0x" + tran.GetHash().clone().reverse().toHexString();

            var res: Result = new Result();

            if (not_send) {
                // 不发送请求，后续自行发送，给出txid等信息
                res.err = false
                res.info = txid
                res['data'] = data

                // 记录使用的utxo，后面不再使用，需要记录高度
                if (Number(net_fee) > 0 && oldarr) {
                    var height = await tools.WWWNeo.api_getHeight_nodes();
                    oldarr.map(old => old.height = height);
                    res['oldarr'] = oldarr
                }
                return res
            }

            var result = await tools.WWWNeo.api_postRawTransaction(data);
            if (result["sendrawtransactionresult"]) {
                if (!result["txid"]) {
                    result["txid"] = txid
                }
                // 记录使用的utxo，后面不再使用，需要记录高度
                if (Number(net_fee) > 0 && oldarr) {
                    var height = await tools.WWWNeo.api_getHeight_nodes();
                    oldarr.map(old => old.height = height);
                    tools.OldUTXO.oldutxosPush(oldarr);
                }
            }
            res.err = !result["sendrawtransactionresult"];
            res.info = result["txid"];
            return res;
        }

        /**
         * invokeTrans 方式调用合约塞入attributes
         * @param script 合约的script
         */
        static async contractInvokeTrans(script: Uint8Array) {
            let current: LoginInfo = LoginInfo.getCurrentLogin();
            var addr = current.address;
            let assetid = CoinToolNeo.id_GAS;
            //let _count = Neo.Fixed8.Zero;   //十个gas内都不要钱滴
            var utxos = await CoinToolNeo.getassets();
            let tranmsg = CoinToolNeo.makeTran(utxos, current.address, assetid, Neo.Fixed8.Zero);
            let tran: ThinNeo.Transaction = tranmsg.info['tran'];
            tran.type = ThinNeo.TransactionType.InvocationTransaction;
            tran.extdata = new ThinNeo.InvokeTransData();
            //塞入脚本
            (tran.extdata as ThinNeo.InvokeTransData).script = script;
            // (tran.extdata as ThinNeo.InvokeTransData).gas = Neo.Fixed8.fromNumber(1.0);

            if (tran.witnesses == null)
                tran.witnesses = [];
            var msg = tran.GetMessage().clone();
            var pubkey = current.pubkey.clone();
            var prekey = current.prikey.clone();
            var signdata = ThinNeo.Helper.Sign(msg, prekey);
            tran.AddWitness(signdata, pubkey, addr);
            var data: Uint8Array = tran.GetRawData();
            console.log(data);
            var res: Result = new Result();
            var result = await tools.WWWNeo.api_postRawTransaction(data);
            res.err = !result;
            res.info = "成功";
            return res;
        }

        /**
         * nep5转账
         * @param address 自己的地址
         * @param tatgeraddr 转账的地址
         * @param asset nep5资产id
         * @param amount 转账数额
         * @param net_fee 手续费
         * @param not_send false（默认）发送请求到链上，true：不发送请求
         */
        static async nep5Transaction(address: string, tatgeraddr, asset: string, amount: string, net_fee:string = "0", not_send: boolean = false) {
            let res = await tools.WWWNeo.api_getNep5Asset(asset);
            var decimals = res["decimals"] as number;
            var numarr = amount.split(".");
            decimals -= (numarr.length == 1 ? 0 : numarr[1].length);

            var v = 1;
            for (var i = 0; i < decimals; i++)
                v *= 10;
            var bnum = new Neo.BigInteger(amount.replace(".", ""));
            var intv = bnum.multiply(v).toString();

            var sb = new ThinNeo.ScriptBuilder();
            var scriptaddress = asset.hexToBytes().reverse();
            //生成随机数
            var random_int: Neo.BigInteger;
            try {
                var random_uint8 = Neo.Cryptography.RandomNumberGenerator.getRandomValues<Uint8Array>(new Uint8Array(32));
                random_int = Neo.BigInteger.fromUint8Array(random_uint8);
            }
            catch (e) {
                var math_rand = parseInt((Math.random() * 10000000).toString());
                console.log("[BlaCat]", '[cointool]', '[nep5Transaction]', 'random_int from js random => ', math_rand)
                random_int = new Neo.BigInteger(math_rand);
            }

            //塞入随机数
            sb.EmitPushNumber(random_int);
            sb.Emit(ThinNeo.OpCode.DROP);
            //塞值
            sb.EmitParamJson(["(address)" + address, "(address)" + tatgeraddr, "(integer)" + intv]);//第二个参数是个数组
            sb.EmitPushString("transfer");
            sb.EmitAppCall(scriptaddress);
            var result = await CoinToolNeo.contractInvokeTrans_attributes(sb.ToArray(), net_fee, not_send)
            return result;
        }

        /**
         * 获取合约utxo资产
         * 
         * @param id_hash 合约hash
         */
        static async getNep5Assets(id_hash: string): Promise<{ [id: string]: UTXO[] }> {
            //获得高度
            var height = await tools.WWWNeo.api_getHeight_nodes();
            var scriptHash = ThinNeo.Helper.GetAddressFromScriptHash(id_hash.hexToBytes().reverse())
            var utxos = await tools.WWWNeo.api_getUTXO(scriptHash);   //获得utxo

            var olds = OldUTXO.getOldutxos();       //获得以标记的utxo(交易过的utxo 存储在本地的标记)
            var olds2 = new Array<OldUTXO>();       //
            for (let n = 0; n < olds.length; n++) {
                const old = olds[n];
                let findutxo = false;
                for (let i = 0; i < utxos.length; i++) {
                    let utxo = utxos[i];
                    if (utxo.txid == old.txid && old.n == utxo.n && height - old.height <= 2 && utxo.asset == old.asset) {
                        findutxo = true;
                        utxos.splice(i, 1);
                    }
                }
                if (findutxo) {
                    olds2.push(old);
                }
            }
            OldUTXO.setOldutxos(olds2);
            var assets = {};        //对utxo进行归类，并且将count由string转换成 Neo.Fixed8
            for (var i in utxos) {
                var item = utxos[i];
                var asset = item.asset;
                if (assets[asset] == undefined || assets[asset] == null) {
                    assets[asset] = [];
                }
                let utxo = new UTXO();
                utxo.addr = item.addr;
                utxo.asset = item.asset;
                utxo.n = item.n;
                utxo.txid = item.txid;
                utxo.count = Neo.Fixed8.parse(item.value);
                assets[asset].push(utxo);
            }

            return assets;
        }

        /**
         * 协调获取CGAS的UTXO
         */
        static async getCgasAssets(id_CGAS: string = this.id_CGAS, amount: number): Promise<{ [id: string]: UTXO[] }> {
            var scriptHash = ThinNeo.Helper.GetAddressFromScriptHash(id_CGAS.hexToBytes().reverse())
            var utxos = await tools.WWWNeo.api_getAvailableUTXOS(scriptHash, amount);   //获得utxo

            var assets = {};        //对utxo进行归类，并且将count由string转换成 Neo.Fixed8
            for (var i in utxos) {
                var item = utxos[i];
                var asset = CoinToolNeo.id_GAS;
                if (assets[asset] == undefined || assets[asset] == null) {
                    assets[asset] = [];
                }
                let utxo = new UTXO();
                utxo.addr = scriptHash;
                utxo.asset = item.asset;
                utxo.n = item.n;
                utxo.txid = item.txid;
                utxo.count = Neo.Fixed8.parse(item.value);
                assets[asset].push(utxo);
            }

            return assets;
        }
    }
}