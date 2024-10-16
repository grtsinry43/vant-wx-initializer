import ins from "@/api/request.js";

// 这个页面的 api 需要替换成实际的接口

export function getWxConfig(url) {
    return ins.get("/wxconfig/get", {
        params: {
            url
        }
    })
}

/**
 * 强制刷新，注意仅在特殊情况下使用
 * @param url
 */
export function flushWxConfig(url) {
    return ins.get("/wxconfig/flush", {
        params: {
            url
        }
    })
}
