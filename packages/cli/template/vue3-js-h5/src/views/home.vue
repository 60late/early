<template>
  <div class="home">
    <h4 class="text-center">基础功能演示</h4>
    <van-list>
      <van-cell is-link to="./example/pinia" title="Pinia使用示例" />
      <van-cell is-link to="./example/auth" title="路由拦截器使用示例" />
      <van-cell is-link to="./example/axios" title="Axios使用示例" />
      <van-cell is-link to="./example/directives" title="自定义指令封装" />
      <van-cell is-link to="./example/hook?code=9527&name=luke" title="Hook封装" />
      <van-cell is-link to="./example/component" title="组件封装"></van-cell>
    </van-list>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
.home {
  padding: 10px;
}
</style>
