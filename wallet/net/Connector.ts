namespace BlackCat {
    export class Connector {

        private hosts: Array<string>;

        private first_host: string;
        private check_params: string;
        private check_type: string;

        private fetch_error: Array<string>;

        constructor(hosts: Array<string>, check_params: string, check_type: string = "") {
            this.hosts = hosts
            this.check_params = check_params
            this.check_type = check_type

            this.fetch_error = []
        }

        getOne(callback) {
            try {
                this.hosts.forEach(
                    host => {
                        let url_head = host.substr(0, 2) === "//" ? Main.urlHead : ""
                        let url = url_head + host + this.check_params

                        console.log("[BlaCat]", '[Connector]', '[getOne]', 'url =>', url)

                        fetch(url).then(
                            async response => {
                                if (response.ok) {
                                    switch (this.check_type) {
                                        case "node":
                                        case "cli":
                                            try {
                                                let json = await response.json()
                                                if (json["result"][0]["blockcount"]) {
                                                    if (!this.first_host) {
                                                        this.first_host = url_head + host
                                                        callback(this.first_host, json)
                                                    }
                                                    return
                                                }
                                            }
                                            catch (e) { }
                                            this.fetch_error.push(host)
                                            return
                                        case "api":
                                        default:
                                            let res = await response.text()
                                            if (!this.first_host) {
                                                this.first_host = url_head + host
                                                callback(this.first_host, res)
                                            }
                                            return
                                    }
                                }
                                else {
                                    this.fetch_error.push(host)
                                }
                            },
                            error => {
                                this.fetch_error.push(host)
                                console.log("[BlaCat]", '[Connector]', '[getOne]', 'fetch err => ', error)
                            }
                        )
                    }
                )
            }
            catch (e) {
                console.log("[BlaCat]", '[Connector]', '[getOne]', 'error => ', e.toString())
            }

            this.check_results(callback)
        }

        private check_results(callback) {
            console.log("[BlaCat]", '[Connector]', '[check_results]', '等待请求结果 ...')
            setTimeout(() => {
                if (!this.first_host) {
                    if (this.fetch_error.length == this.hosts.length) {
                        console.log("[BlaCat]", '[Connector]', '[check_results]', '所有请求失败 => ', this.fetch_error)
                        callback(false, null)
                    }
                    else {
                        this.check_results(callback)
                    }
                }
            }, 500)
        }
    }
}