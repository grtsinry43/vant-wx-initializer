<script setup lang="ts">
import routes from "@/router/routes";
import {useRoute, useRouter} from "vue-router";
import {computed, ref, onMounted} from "vue";

const router = useRouter();
const route = useRoute();
const curIndex = ref(0);

// 检查当前路由是否是指定路由或其子路由
const activeRoute = (path: string) => {
  return route.path === path || route.path.startsWith(path);
};

// 过滤掉 `hideInMenu` 为 true 的路由
const visibleRoutes = computed(() => routes.filter(route => !route.meta.hideInMenu));

// 页面加载时设置当前激活的项目
onMounted(() => {
  const index = visibleRoutes.value.findIndex(route => activeRoute(route.path));
  if (index !== -1) {
    curIndex.value = index;
  }
});
</script>

<template>
  <div class="bottom-bar-container">
    <van-tabbar v-model="curIndex">
      <van-tabbar-item
          v-for="(route, index) in visibleRoutes"
          replace
          :key="index"
          :to="route.path"
          :icon="route.meta.icon">
        <span v-if="route.name">{{ route.name }}</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style scoped>
.bottom-bar-container {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
