<template>
  <div ref="dragBallRef" id="dragRef" class="fixed w-[50px] h-[50px]" :style="`right: 50px; bottom: 30px`" v-drag>
    <img src="@/assets/logo.svg" class="w-[50px] h-[50px]" />
  </div>
</template>
<script setup></script>
<style lang="less" scoped></style>
