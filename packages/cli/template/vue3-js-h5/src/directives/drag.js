export default {
  install(app) {
    app.directive('drag', {
      mounted(el) {
        let switchPos = {
          x: 0, // 元素左边距
          y: 0, // 元素上边距
          startX: 0, // 点击开始时左边距
          startY: 0, // 点击开始时上边距
          endX: 0, // 点击结束时左边距
          endY: 0 // 点击结束时上边距
        }
        el.addEventListener('touchstart', function (e) {
          // offset是元素左边距，pageX是鼠标位置左边距
          switchPos.x = el.offsetLeft
          switchPos.y = el.offsetTop
          switchPos.startX = e.touches[0].pageX
          switchPos.startY = e.touches[0].pageY
        })
        el.addEventListener('touchend', function () {
          switchPos.x = switchPos.endX
          switchPos.y = switchPos.endY
        })
        el.addEventListener('touchmove', function (e) {
          if (e.touches.length > 0) {
            let changeX = e.touches[0].pageX - switchPos.startX
            let changeY = e.touches[0].pageY - switchPos.startY
            let x = switchPos.x + changeX
            let y = switchPos.y + changeY
            // 左边界
            if (x < 0) {
              x = 0
            }
            // 右边界
            if (x + el.offsetWidth >= window.screen.width) {
              x = window.screen.width - el.offsetWidth
            }
            // 上边界
            if (y < 0) {
              y = 0
            }
            // 下边界
            if (y + el.offsetHeight >= window.screen.height) {
              y = window.screen.height - el.offsetHeight
            }
            el.style.left = x + 'px'
            el.style.top = y + 'px'
            switchPos.endX = x
            switchPos.endY = y
            e.preventDefault()
          }
        })
      }
    })
  }
}
