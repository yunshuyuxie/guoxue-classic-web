<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

// 性能优化：异步加载非关键组件
const QuoteShake = defineAsyncComponent(() => import('./components/QuoteShake.vue'))

// 导入图片错误处理组件
import ImageErrorHandler from './components/ImageErrorHandler.vue'

const activeIndex = ref('1')
const route = useRoute()

// 设备检测
const isMobile = ref(false)
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// 摇一摇功能
const showQuoteModal = ref(false)

// 摇一摇检测相关变量
let lastUpdate = 0
let lastX = 0
let lastY = 0
let lastZ = 0
const SHAKE_THRESHOLD = 15

// 添加摇一摇事件监听
const handleShake = (event: DeviceMotionEvent) => {
  // 性能优化：节流处理，减少计算频率
  const current = Date.now()
  if (current - lastUpdate > 100) {
    const acceleration = event.accelerationIncludingGravity
    if (acceleration) {
      const curX = acceleration.x || 0
      const curY = acceleration.y || 0
      const curZ = acceleration.z || 0

      const diffTime = current - lastUpdate
      const speed = (Math.abs(curX + curY + curZ - lastX - lastY - lastZ) / diffTime) * 10000

      if (speed > SHAKE_THRESHOLD) {
        showRandomQuote()
      }

      lastX = curX
      lastY = curY
      lastZ = curZ
      lastUpdate = current
    }
  }
}

// 显示随机名句
const showRandomQuote = () => {
  showQuoteModal.value = true
}

// 关闭名句弹窗
const closeQuoteModal = () => {
  showQuoteModal.value = false
}

// 性能优化：使用节流函数
function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0
  return function (...args: Parameters<T>) {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

// 节流版窗口大小调整函数
const throttledResize = throttle(checkMobile, 200)

// 标记主要路由
const isPrimaryRoute = () => {
  const primaryRoutes = ['/', '/books', '/login', '/register']
  return primaryRoutes.includes(route.path)
}

onMounted(() => {
  // 初始检测设备类型
  checkMobile()

  // 使用节流版本的resize事件监听
  window.addEventListener('resize', throttledResize)

  // 添加摇一摇事件监听 - 仅在移动设备上启用
  if (window.DeviceMotionEvent && isMobile.value) {
    window.addEventListener('devicemotion', handleShake)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', throttledResize)

  // 移除摇一摇事件监听
  if (window.DeviceMotionEvent) {
    window.removeEventListener('devicemotion', handleShake)
  }
})
</script>

<template>
  <div class="common-layout" :class="{ 'is-mobile': isMobile }">
    <tiny-layout>
      <tiny-header>
        <div class="header-content">
          <div class="logo">
            <h1>国学经典</h1>
          </div>
          <tiny-menu :default-active="activeIndex" class="tiny-menu-demo" mode="horizontal" router>
            <tiny-menu-item index="/">首页</tiny-menu-item>
            <tiny-menu-item index="/books">经典书籍</tiny-menu-item>
            <tiny-menu-item index="/quiz">知识测验</tiny-menu-item>
            <tiny-menu-item index="/courses">国学讲堂</tiny-menu-item>
            <tiny-menu-item index="/community">学习社区</tiny-menu-item>
            <tiny-menu-item index="/learning-center">学习中心</tiny-menu-item>
            <tiny-menu-item index="/about">关于我们</tiny-menu-item>
            <tiny-menu-item index="/images-test">图片测试</tiny-menu-item>
          </tiny-menu>
          <div class="user-actions">
            <tiny-button type="primary" plain size="small" @click="$router.push('/login')"
              >登录</tiny-button
            >
            <tiny-button type="success" plain size="small" @click="$router.push('/register')"
              >注册</tiny-button
            >
          </div>
        </div>
      </tiny-header>
      <tiny-main>
        <!-- 优化：使用KeepAlive缓存常用路由 -->
        <keep-alive>
          <RouterView v-if="isPrimaryRoute()" />
        </keep-alive>
        <RouterView v-if="!isPrimaryRoute()" />
      </tiny-main>
      <tiny-footer>
        <div class="footer-content">
          <div class="footer-logo">
            <h2>国学经典</h2>
            <p>传承国学经典，弘扬中华文化</p>
          </div>
          <div class="footer-links">
            <div class="link-group">
              <h3>关于我们</h3>
              <a href="#">网站介绍</a>
              <a href="#">联系方式</a>
              <a href="#">加入我们</a>
            </div>
            <div class="link-group">
              <h3>学习资源</h3>
              <a href="/books">经典书籍</a>
              <a href="/quotes">名句赏析</a>
              <a href="/courses">国学讲堂</a>
              <a href="/quiz">知识测验</a>
            </div>
            <div class="link-group">
              <h3>用户中心</h3>
              <a href="/learning-center">个人学习</a>
              <a href="/community">学习社区</a>
              <a href="/notes">学习笔记</a>
            </div>
          </div>
        </div>
        <div class="copyright">
          <p>© 2023-2024 国学经典学习网站 - 传承中华文化，弘扬国学精神</p>
        </div>
      </tiny-footer>
    </tiny-layout>

    <!-- 移动端底部导航 -->
    <div class="mobile-nav" v-if="isMobile">
      <router-link to="/" class="nav-item">
        <i class="mobile-nav-icon">🏠</i>
        <span>首页</span>
      </router-link>
      <router-link to="/books" class="nav-item">
        <i class="mobile-nav-icon">📚</i>
        <span>书籍</span>
      </router-link>
      <router-link to="/quiz" class="nav-item">
        <i class="mobile-nav-icon">📝</i>
        <span>测验</span>
      </router-link>
      <router-link to="/courses" class="nav-item">
        <i class="mobile-nav-icon">🎓</i>
        <span>讲堂</span>
      </router-link>
      <router-link to="/learning-center" class="nav-item">
        <i class="mobile-nav-icon">👤</i>
        <span>我的</span>
      </router-link>
    </div>

    <!-- 摇一摇名句弹窗 - 仅在需要时渲染 -->
    <QuoteShake v-if="showQuoteModal" :visible="showQuoteModal" @close="closeQuoteModal" />

    <!-- 图片错误处理工具 -->
    <ImageErrorHandler />
  </div>
</template>

<style scoped>
.common-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.tiny-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  /* 优化渲染性能 */
  will-change: transform;
  transform: translateZ(0);
}

.tiny-header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0;
  height: auto !important;
  border-bottom: 1px solid #e8e8e8;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
  height: 64px;
}

.logo {
  font-size: 16px;
  color: var(--primary-color);
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  font-family: 'STKaiti', 'KaiTi', serif;
  color: var(--primary-color);
}

.user-actions {
  display: flex;
  gap: 10px;
}

.tiny-main {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.tiny-footer {
  background-color: #f7f7f7;
  padding: 40px 20px;
  border-top: 1px solid #e8e8e8;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto 20px;
}

.footer-logo {
  flex: 1;
  min-width: 200px;
  margin-bottom: 20px;
}

.footer-logo h2 {
  margin: 0 0 10px;
  font-size: 1.2rem;
  font-family: 'STKaiti', 'KaiTi', serif;
  color: var(--primary-color);
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  flex: 2;
  gap: 40px;
}

.link-group {
  min-width: 120px;
}

.link-group h3 {
  margin: 0 0 15px;
  font-size: 1rem;
  color: #333;
}

.link-group a {
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.link-group a:hover {
  color: var(--primary-color);
}

.copyright {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
  color: #999;
  font-size: 0.8rem;
}

/* 移动端样式 */
.is-mobile .header-content {
  height: 56px;
}

.is-mobile .tiny-menu-demo {
  display: none;
}

.is-mobile .tiny-main {
  padding: 10px;
}

.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background-color: #fff;
  border-top: 1px solid #e8e8e8;
  z-index: 100;
  /* 性能优化 */
  will-change: transform;
}

.mobile-nav .nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  color: #666;
  text-decoration: none;
  font-size: 0.8rem;
}

.mobile-nav .nav-item.router-link-active {
  color: var(--primary-color);
}

.mobile-nav-icon {
  font-size: 1.2rem;
  margin-bottom: 4px;
}

/* 性能优化：动画和过渡 */
@media (prefers-reduced-motion: no-preference) {
  .router-view-fade-enter-active,
  .router-view-fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .router-view-fade-enter-from,
  .router-view-fade-leave-to {
    opacity: 0;
  }
}

/* 响应式布局优化 */
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
  }

  .footer-links {
    gap: 20px;
  }

  .is-mobile .user-actions {
    display: none;
  }

  .is-mobile .logo {
    flex: 1;
    text-align: center;
  }
}
</style>
