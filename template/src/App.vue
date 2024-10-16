<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
import {onMounted} from "vue";
import {getUserInfo} from "@/api/user";

onMounted(() => {
  getUserInfo();
})

</script>

<template>
  <RouterView/>
</template>

<style scoped>
</style>
