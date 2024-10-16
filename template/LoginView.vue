<script setup>
import NProgress from "nprogress";
import {onMounted} from "vue";
import {wxLogin} from "@/api/oauth.js";
import router from "@/router/index.ts";
import {useUserStore} from "@/stores/User.js";
import config from "@/config";

const user = useUserStore();

onMounted(() => {
  NProgress.start();
  history.pushState(null, null, document.URL);
  window.addEventListener("popstate", function () {
    history.pushState(null, null, document.URL);
  });

  // 生产环境微信登录
  if (import.meta.env.MODE === 'production') {
    const res = window.location.search
        .substring(1)
        .match(/(^|&|\?)code=([^&]*)(&|$)/);
    let code = "";
    if (res) {
      code = decodeURIComponent(res[2]);
    }
    if (!code) {
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appId}
&redirect_uri=${encodeURIComponent(config.redirectUrl)}
&response_type=code
&scope=snsapi_userinfo
#wechat_redirect`;
      NProgress.done();
    } else {
      wxLogin(code)
          .then((res) => {
            user.setAvatar(res.avatar);
          })
          .finally(() => {
            NProgress.done();
            router.replace("/index");
          });
    }
  } else {
    NProgress.done();
    wxLogin("").then((res) => {
      console.log("测试用 登录成功", res);
    });
    router.replace("/index");
  }
});
</script>

<template>
  <div class="login-container">
    <van-nav-bar title="正在努力加载中..."/>
  </div>
</template>

<style lang="less" scoped>
.van-nav-bar {
  text-align: center;
  background-color: #f3f3f4;
  height: 45px;
  line-height: 2.7rem;
}
</style>
