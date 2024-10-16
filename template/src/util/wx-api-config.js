import wx from 'weixin-js-sdk';
import {flushWxConfig, getWxConfig} from "@/api/wxConfig.js";
import router from "@/router/index.js";
import {showDialog, showNotify} from "vant";

router.afterEach(async (to, from, next) => {
    console.log("微信 JS-SDK 配置开始...")

    // let signLink = '';
    // // IOS有且只有第一次进入页面才触发配置
    // let ua = navigator.userAgent.toLowerCase();
    // if (/iphone|ipad|ipod/.test(ua) && from.path === '/') {
    //     signLink = localStorage.getItem('firstHref');
    //     // alert(signLink);
    // } else {
    //     signLink = location.href.split('#')[0]
    // }

    // 微信API全局配置
    getWxConfig(location.href.split('#')[0]).then(res => {
        console.log(res)
        const {appId, timestamp, nonceStr, signature} = res;
        wx.config({
            debug: import.meta.env.MODE !== 'production',
            appId,
            timestamp,
            nonceStr,
            signature,
            jsApiList: ["getLocation", "updateAppMessageShareData"]
        });
    });

    wx.ready(function () {
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，
        // config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，
        // 则须把相关接口放在ready函数中调用来确保正确执行。
        // 对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        console.log("微信 JS-SDK 配置成功！");
        // 只有生产环境下并且配置成功，并且url不是/login时，才跳转到登录页面
        // if (process.env.NODE_ENV === 'production' && location.pathname !== '/login') {
        //     router.push("/login");
        // }
    });

    wx.error(function (err) {
        console.log("微信 JS-SDK 配置失败：", err);
        showNotify(JSON.stringify(err));
        // 仅在生产环境下出现错误时，调用flushWxConfig强制刷新
        if (import.meta.env.MODE === 'production') {
            // flushWxConfig(location.href.split('#')[0]).then(res => {
            //     console.log("微信 JS-SDK 配置已强制刷新：", res);
            //     // 刷新之后，刷新页面以便重新加载配置
            //     location.reload();
            // });
        }
    });

});


