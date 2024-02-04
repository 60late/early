<template>
  <van-nav-bar left-text="返回上层" :title="pageTitle" left-arrow @click-left="onClickLeft" />
  <div class="main">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView, useRouter } from 'vue-router'
import { toRefs } from 'vue'
import { usePageInfoStore } from '@/stores/page-info'

const router = useRouter()
const onClickLeft = () => router.go(-1)

const { pageTitle } = toRefs(usePageInfoStore())
console.log('pageTitle1', pageTitle)
</script>

<style lang="less">
#app {
  padding: 10px;
}
</style>
