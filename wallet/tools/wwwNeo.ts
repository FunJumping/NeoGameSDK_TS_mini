namespace BlackCat.tools {
    export class WWWNeo {
        
        static api_nodes: string

        static api_clis: string;

        static api_cgas: string;
        static api_cneo: string;

        static makeRpcUrl(url: string, method: string, ..._params: any[]) {
            var urlout = url + "?jsonrpc=2.0&id=1&method=" + method + "&params=[";
            for (var i = 0; i < _params.length; i++) {
                urlout += JSON.stringify(_params[i]);
                if (i != _params.length - 1)
                    urlout += ",";
            }
            urlout += "]";
            return urlout;
        }
        static makeRpcPostBody(method: string, ..._params: any[]): {} {
            var body = {};
            body["jsonrpc"] = "2.0";
            body["id"] = 1;
            body["method"] = method;
            var params = [];
            for (var i = 0; i < _params.length; i++) {
                params.push(_params[i]);
            }
            body["params"] = params;
            return body;
        }


        // nelnode接口

        static async api_getHeight_nodes(nodes_url: string = this.api_nodes) {
            var str = this.makeRpcUrl(nodes_url, "getblockcount");
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            var height = parseInt(r[0]["blockcount"] as string) - 1;
            return height;
        }
        static async api_getAllAssets() {
            var str = this.makeRpcUrl(this.api_nodes, "getallasset");
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;
        }
        static async api_getAllNep5AssetBalanceOfAddress(address: string) {
            var postdata = this.makeRpcPostBody("getallnep5assetofaddress", address, 1);
            var result = await fetch(this.api_nodes, { "method": "post", "body": JSON.stringify(postdata) });
            var json = await result.json();
            var r = json["result"];
            return r;
        }
        static async api_getUTXO(address: string) {
            var str = this.makeRpcUrl(this.api_nodes, "getutxo", address);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;
        }
        static async api_getAvailableUTXOS(address: string, amount: number) {
            var postdata = this.makeRpcPostBody("getavailableutxos", address, amount);
            var result = await fetch(this.api_cgas, { "method": "post", "body": JSON.stringify(postdata) });
            var json = await result.json();
            var r = json["result"];
            return r;
        }
        static async api_getBalance(address: string) {
            var str = this.makeRpcUrl(this.api_nodes, "getbalance", address);
            var value = await fetch(str, { "method": "get" });
            var json = await value.json();
            var r = json["result"];
            return r;
        }
        static async api_getNep5Asset(asset: string) {
            var postdata = this.makeRpcPostBody("getnep5asset", asset);
            var result = await fetch(this.api_nodes, { "method": "post", "body": JSON.stringify(postdata) });
            var json = await result.json();
            var r = json["result"][0];
            return r;
        }
        static async api_getrawtransaction(txid: string) {
            var str = this.makeRpcUrl(this.api_nodes, "getrawtransaction", txid);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            if (!json["result"])
                return null;
            var r = json["result"][0]
            return r;
        }
        static async api_getcontractstate(scriptaddr: string) {
            var str = this.makeRpcUrl(this.api_nodes, "getcontractstate", scriptaddr);
            var value = await fetch(str, { "method": "get" });
            var json = await value.json();
            var r = json["result"][0];
            return r;
        }
        static async api_postRawTransaction(data: Uint8Array): Promise<boolean> {
            var postdata = this.makeRpcPostBody("sendrawtransaction", data.toHexString());
            var result = await fetch(this.api_nodes, { "method": "post", "body": JSON.stringify(postdata) });
            var json = await result.json();
            var r = json["result"][0] as boolean;
            return r;
        }
        static async api_getInvokescript(scripthash: Uint8Array): Promise<any> {
            var str = this.makeRpcUrl(this.api_nodes, "invokescript", scripthash.toHexString());
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            if (json["result"] == null)
                return null;
            var r = json["result"][0]
            return r;
        }




        // neo-cli接口
        static async  api_getHeight_clis(clis_url: string = this.api_clis) {
            if (!clis_url) {
                return null
            }
            var str = this.makeRpcUrl(clis_url, "getblockcount");

            str += "&uid=" + Main.randNumber

            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            var height = parseInt(r[0]["blockcount"] as string) - 1;
            return height;
        }
        static async cli_postRawTransaction(data: Uint8Array): Promise<boolean> {
            var cli = 0;
            if (this.api_clis && this.api_clis != "") {
                cli = 1;
            }

            var api_url = this.api_nodes;
            if (cli == 1) {
                api_url = this.api_clis
            }
            var postdata = this.makeRpcPostBody("sendrawtransaction", data.toHexString());
            if (cli == 1) postdata["uid"] = Main.randNumber
            var result = await fetch(api_url, { "method": "post", "body": JSON.stringify(postdata) });
            var json = await result.json();
            var r = json["result"][0] as boolean;
            return r;
        }
        static async cli_getInvokescript(scripthash: Uint8Array): Promise<any> {
            var cli = 0;
            if (this.api_clis && this.api_clis != "") {
                cli = 1;
            }

            var api_url = this.api_nodes;
            if (cli == 1) {
                api_url = this.api_clis
            }
            var str = this.makeRpcUrl(api_url, "invokescript", scripthash.toHexString());
            if (cli == 1) {
                str += "&uid=" + Main.randNumber
            }
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            if (json["result"] == null)
                return null;
            var r = json["result"][0]
            return r;
        }

    }
}