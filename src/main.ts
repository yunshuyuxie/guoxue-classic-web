import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import TinyVue from '@opentiny/vue'
import '@opentiny/vue-theme/index.css'

import App from './App.vue'
import router from './router'
import performance from './utils/performance'
import imageErrorHandler from './utils/imageErrorHandler'

// 性能标记
if (import.meta.env.DEV) {
  performance.markPerformance('vue-app-init-start')
  // 启用Web性能监控
  performance.reportWebVitals()
}

// 创建应用实例
const app = createApp(App)

// 注册Pinia
app.use(createPinia())

// 注册路由
app.use(router)

// 注册TinyVue
app.use(TinyVue)

// 注册自定义全局组件
import ImageWithFallback from './components/ImageWithFallback.vue'
app.component('ImageWithFallback', ImageWithFallback)

// 添加性能监控
router.beforeEach((to, from, next) => {
  if (import.meta.env.DEV) {
    performance.markPerformance(`route-change-start-${to.path}`)
  }
  next()
})

router.afterEach((to) => {
  if (import.meta.env.DEV) {
    performance.markPerformance(`route-change-end-${to.path}`)
    performance.measurePerformance(
      `route-change-${to.path}`,
      `route-change-start-${to.path}`,
      `route-change-end-${to.path}`,
    )
  }
})

// 挂载应用
app.mount('#app')

// 应用挂载后初始化全局图片错误处理
imageErrorHandler.initGlobalImageErrorHandler()

// 性能标记
if (import.meta.env.DEV) {
  performance.markPerformance('vue-app-init-end')
  performance.measurePerformance('vue-app-init', 'vue-app-init-start', 'vue-app-init-end')

  // 开发环境监控内存使用
  performance.monitorMemoryUsage()
}
