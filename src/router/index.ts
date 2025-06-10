import { createRouter, createWebHashHistory } from 'vue-router'

// 定义预加载指令
const preloadView = (viewPath: string) => {
  return () => {
    // 使用动态导入并预加载组件
    const importFn = () => import(`../views/${viewPath}.vue`)
    // 标记为预加载
    importFn()
    return importFn()
  }
}

// 定义常规懒加载指令
const lazyLoadView = (viewPath: string) => {
  return () => import(`../views/${viewPath}.vue`)
}

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: preloadView('HomeView'),
      meta: { title: '首页 - 国学经典', requiresAuth: false },
    },
    {
      path: '/books',
      name: 'books',
      component: preloadView('BooksView'),
      meta: { title: '经典书籍 - 国学经典', requiresAuth: false },
    },
    {
      path: '/book/:id',
      name: 'book-detail',
      component: lazyLoadView('BookDetailView'),
      meta: { title: '书籍详情 - 国学经典', requiresAuth: false },
    },
    {
      path: '/book/read/:id',
      name: 'book-read',
      component: lazyLoadView('BookReadView'),
      meta: { title: '阅读经典 - 国学经典', requiresAuth: false },
    },
    {
      path: '/quotes',
      name: 'quotes',
      component: lazyLoadView('QuotesView'),
      meta: { title: '国学名句赏析 - 国学经典', requiresAuth: false },
    },
    {
      path: '/login',
      name: 'login',
      component: preloadView('LoginView'),
      meta: { title: '登录 - 国学经典', requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: preloadView('RegisterView'),
      meta: { title: '注册 - 国学经典', requiresAuth: false },
    },
    {
      path: '/about',
      name: 'about',
      component: lazyLoadView('AboutView'),
      meta: { title: '关于我们 - 国学经典', requiresAuth: false },
    },
    {
      path: '/community',
      name: 'community',
      component: lazyLoadView('CommunityView'),
      meta: { title: '学习社区 - 国学经典', requiresAuth: false },
    },
    {
      path: '/learning-center',
      name: 'learning-center',
      component: lazyLoadView('LearningCenterView'),
      meta: { title: '个人学习中心 - 国学经典', requiresAuth: true },
    },
    {
      path: '/courses',
      name: 'courses',
      component: lazyLoadView('CoursesView'),
      meta: { title: '国学讲堂 - 国学经典', requiresAuth: false },
    },
    // 测验相关路由
    {
      path: '/quiz',
      name: 'quiz',
      component: lazyLoadView('QuizView'),
      meta: { title: '国学知识测验 - 国学经典', requiresAuth: false },
    },
    {
      path: '/quiz/:type',
      name: 'quiz-play',
      component: lazyLoadView('QuizPlayView'),
      meta: { title: '答题中 - 国学经典', requiresAuth: false },
    },
    {
      path: '/quiz/result/:id',
      name: 'quiz-result',
      component: lazyLoadView('QuizResultView'),
      meta: { title: '测验结果 - 国学经典', requiresAuth: false },
    },
    {
      path: '/quiz/leaderboard',
      name: 'quiz-leaderboard',
      component: lazyLoadView('QuizView'),
      props: { activeTab: 'leaderboard' },
      meta: { title: '排行榜 - 国学经典', requiresAuth: false },
    },
    {
      path: '/quiz/history',
      name: 'quiz-history',
      component: lazyLoadView('QuizView'),
      props: { activeTab: 'history' },
      meta: { title: '测验历史 - 国学经典', requiresAuth: true },
    },
    {
      path: '/quiz/review/:id',
      name: 'quiz-review',
      component: lazyLoadView('QuizPlayView'),
      props: { isReviewMode: true },
      meta: { title: '测验回顾 - 国学经典', requiresAuth: true },
    },
    {
      path: '/festivals',
      name: 'festivals',
      component: lazyLoadView('FestivalView'),
      meta: { title: '传统节日 - 国学经典', requiresAuth: false },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: preloadView('ForgotPasswordView'),
      meta: { title: '找回密码 - 国学经典', requiresAuth: false },
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: preloadView('UserOnboardingView'),
      meta: { title: '新用户引导 - 国学经典', requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: preloadView('UserProfileView'),
      meta: { title: '个人资料 - 国学经典', requiresAuth: true },
    },
    {
      path: '/images-test',
      name: 'images-test',
      component: lazyLoadView('ImagesTestView'),
      meta: { title: '图片测试 - 国学经典', requiresAuth: false },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: lazyLoadView('HomeView'),
      meta: { title: '页面未找到 - 国学经典', requiresAuth: false },
    },
  ],
  // 平滑滚动行为
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  },
})

// 性能监控
if (import.meta.env.DEV) {
  router.beforeEach((to, from, next) => {
    console.time(`Route navigation: ${to.path}`)
    next()
  })

  router.afterEach((to) => {
    console.timeEnd(`Route navigation: ${to.path}`)
  })
}

// 全局前置守卫：在路由跳转前触发
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const requiresAuth = to.meta.requiresAuth

  // 如果页面需要登录但用户未登录，重定向到登录页面
  if (requiresAuth && !isLoggedIn) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  }
  // 如果用户已登录但未完成引导流程，且不是前往引导页面，重定向到引导页面
  else if (
    isLoggedIn &&
    !localStorage.getItem('userOnboardingCompleted') &&
    to.name !== 'onboarding' &&
    to.name !== 'login' &&
    to.name !== 'register'
  ) {
    next({ name: 'onboarding' })
  }
  // 其他情况正常导航
  else {
    // 设置页面标题
    if (to.meta.title) {
      document.title = to.meta.title as string
    }
    next()
  }
})

export default router
