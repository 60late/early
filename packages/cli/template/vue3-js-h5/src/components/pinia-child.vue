<template>
  <div class="pinia-child">
    <h4>Pinia 子组件</h4>
    <van-button type="primary" @click="updateCount"> count ++ </van-button>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter'

const counterStore = useCounterStore()
const updateCount = () => counterStore.increment()
</script>

<style lang="less" scoped>
.pinia-child {
  padding: 10px;
  border: 1px solid lightgray;
}
</style>
