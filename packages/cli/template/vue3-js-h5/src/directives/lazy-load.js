const defaultImg = `https://img1.baidu.com/it/u=3715477772,2060525007&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=310`

// 引入监听是否进入视口
export default {
  install(app) {
    app.directive('lazy-load', {
      mounted(el, binding) {
        // 设置默认图片
        el.setAttribute('src', defaultImg)
        const options = {
          rootMargin: '0px', // 元素相交前距离多远开始加载
          threshold: 0.5 // >0则元素相交后再加载
        }
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              el.setAttribute('src', binding.value)
              observer.unobserve(el)
            }
          })
        }, options)
        observer.observe(el)
      }
    })
  }
}
