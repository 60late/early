export default {
  install(app) {
    app.directive('permission', {
      // 初次挂载时触发
      mounted(el, binding) {
        el.style.display = binding.value ? '' : 'none'
      },
      // 在元素更新时触发
      updated(el, binding) {
        el.style.display = binding.value ? '' : 'none'
      }
    })
  }
}
