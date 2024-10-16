import axios from "axios";
import {showNotify} from "vant";
import {getToken, setToken} from "@/util/auth.js";

// 统一封装，便于调用
const ins = axios.create({
    baseURL: "/api",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});
ins.interceptors.response.use(
    function (resp) {
        // 如果响应头中有 token，则存储到 localStorage 中，以便下次请求时携带
        // 也会在 token 过期时，存储新的 token
        if (resp.headers.Authorization) {
            setToken(resp.headers.Authorization);
        }
        if (resp.data.code !== 0) {
            showNotify({
                message: resp.data.msg,
                type: "warning",
            });
            return null;
        }

        // 成功则直接返回数据
        return resp.data.data;
    },
    function (error) {
        console.log(error);
        // 错误的响应处理
        showNotify({
            message: `获取数据失败：${error}`,
            type: "danger",
        });
        return null;
    });

ins.interceptors.request.use(
    function (config) {
        // 在 localStorage 中获取 token
        const token = getToken();
        if (token) {
            // 如果存在 token，则在请求头中携带 token
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        showNotify({
            message: `请求失败：${error}`,
            type: "danger",
        })
        return Promise.reject(error);
    });

export default ins;
