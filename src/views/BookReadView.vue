<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 定义类型
interface Chapter {
  id: number
  title: string
  content: string
  translation: string
  notes: string
}

interface Book {
  id: number
  title: string
  author: string
  dynasty: string
  historicalSignificance: string
  cover: string
  description: string
  chapters: Chapter[]
}

const route = useRoute()
const router = useRouter()
const bookId = computed(() => Number(route.params.id))
const chapterId = computed(() => {
  const id = route.query.chapter ? Number(route.query.chapter) : 1
  return id
})

// 设备检测
const isMobile = ref(false)
const showToolbar = ref(true)

// 书籍数据
const book = ref<Book>({
  id: 0,
  title: '',
  author: '',
  dynasty: '',
  historicalSignificance: '',
  cover: '',
  description: '',
  chapters: [],
})

// 阅读配置
const fontSize = ref(16)
const isDarkMode = ref(false)
const isSidebarOpen = ref(true)
const activeTab = ref('chapters') // 'chapters' | 'notes' | 'bookmarks'
const showNotes = ref(true)
const showTranslation = ref(true)

// 加载状态
const loading = ref(true)

// 书签和笔记
const bookmarks = ref<number[]>([])
const notes = ref<{ id: number; chapterId: number; content: string; selection: string }[]>([])

// 阅读进度
const readingProgress = ref(0)

// 阅读模式
const readingMode = ref('scroll') // 'scroll' 或 'page'

// 离线阅读相关
const isOfflineAvailable = ref(false)
const isCaching = ref(false)

// 触摸相关
let touchStartX = 0
let touchEndX = 0
const minSwipeDistance = 50

// 查找当前章节
const currentChapter = computed(() => {
  return (
    book.value.chapters.find((chapter) => chapter.id === chapterId.value) || book.value.chapters[0]
  )
})

// 模拟数据
const mockLunyu: Book = {
  id: 1,
  title: '论语',
  author: '孔子及其弟子',
  dynasty: '先秦',
  historicalSignificance:
    '《论语》是儒家学派的经典著作之一，由孔子的弟子及其再传弟子编撰而成，记录了孔子及其弟子的言行，集中体现了孔子的思想，是儒家思想的重要经典，对中国传统文化产生了深远影响。',
  cover: 'images/books/lunyu.png',
  description:
    '《论语》记录了孔子及其弟子的言行，是儒家思想的重要经典，对中国传统文化产生了深远影响。',
  chapters: [
    {
      id: 1,
      title: '学而第一',
      content: '子曰："学而时习之，不亦说乎？有朋自远方来，不亦乐乎？人不知而不愠，不亦君子乎？"',
      translation:
        '孔子说："学习知识并且不断复习，不也是很愉快的事情吗？有朋友从远方来访，不也是很令人高兴的事情吗？别人不了解我，我却不恼怒，不也是有修养的人吗？"',
      notes:
        '这是《论语》开篇的第一章，表达了孔子对学习的态度。"说"通"悦"，意为高兴、愉快。"有朋自远方来"强调了友谊的重要性。"人不知而不愠"表现了孔子的宽容胸襟和内心的平静。',
    },
    {
      id: 2,
      title: '为政第二',
      content: '子曰："为政以德，譬如北辰，居其所而众星共之。"',
      translation:
        '孔子说："以德行来治理政事，就如同北极星那样，自己处在那个位置上不动，而群星都环绕着它。"',
      notes:
        '这段话阐述了孔子的德治思想，认为统治者应以道德来治理国家，而不是仅靠刑罚。北辰即北极星，古代被视为天空中心，众星围绕，比喻君主处于中心位置，用德行感化众人。',
    },
    {
      id: 3,
      title: '八佾第三',
      content: '孔子谓季氏："八佾舞于庭，是可忍也，孰不可忍也？"',
      translation:
        '孔子评论季氏说："季氏在家庭里使用八排舞者表演舞蹈，这样的僭越如果可以容忍，那么什么事情不可以容忍呢？"',
      notes:
        '八佾舞是天子的乐舞规格，每队八人，八队共六十四人。季氏是鲁国大夫，僭越使用了天子的礼仪规格，孔子对此表示批评，体现了孔子对礼制的重视。',
    },
    {
      id: 4,
      title: '里仁第四',
      content: '子曰："里仁为美。择不处仁，焉得知？"',
      translation:
        '孔子说："选择仁德的环境来居住才是美好的。如果选择不住在仁德的环境里，怎么能算有智慧呢？"',
      notes:
        '这段话强调了环境对人的影响，以及选择良好环境的重要性。"里"指居住的地方，引申为环境。"仁"是孔子思想的核心概念，包含仁爱、善良等美德。',
    },
    {
      id: 5,
      title: '公冶长第五',
      content: '子谓公冶长："可妻也，虽在缧绁之中，非其罪也。"以其子妻之。',
      translation:
        '孔子评论公冶长说："他是可以把女儿嫁给他的人，即使他被关在监狱里，那也不是因为他犯了罪。"于是把自己的女儿嫁给了他的儿子。',
      notes:
        '公冶长是鲁国人，孔子的学生。"缧绁"指捆绑囚犯的绳索，引申为监狱。这句话体现了孔子注重人的品德而非外在处境的思想。',
    },
  ],
}

// 检查是否支持Service Worker
const checkServiceWorkerSupport = () => {
  return 'serviceWorker' in navigator
}

// 检查书籍是否已缓存
const checkBookCached = async (bookId: number) => {
  if (!checkServiceWorkerSupport()) return false

  try {
    const cache = await caches.open('books-cache')
    const keys = await cache.keys()
    return keys.some((key) => key.url.includes(`book-${bookId}`))
  } catch (error) {
    console.error('检查缓存失败:', error)
    return false
  }
}

// 缓存书籍内容
const cacheBookForOffline = async () => {
  if (!checkServiceWorkerSupport()) {
    alert('您的浏览器不支持离线阅读功能')
    return
  }

  try {
    isCaching.value = true

    // 创建要缓存的资源列表
    const resources = [
      `/api/books/${bookId.value}`,
      book.value.cover,
      // 可以添加更多资源，如样式表、字体等
    ]

    // 缓存书籍数据
    const cache = await caches.open('books-cache')

    // 存储书籍数据
    const bookData = JSON.stringify(book.value)
    const bookBlob = new Blob([bookData], { type: 'application/json' })
    const bookResponse = new Response(bookBlob)
    await cache.put(`/book-${bookId.value}`, bookResponse)

    // 缓存其他资源
    await Promise.all(
      resources.map((url) => fetch(url).then((response) => cache.put(url, response))),
    )

    isOfflineAvailable.value = true
    alert('书籍已缓存，可以离线阅读')
  } catch (error) {
    console.error('缓存书籍失败:', error)
    alert('缓存书籍失败，请重试')
  } finally {
    isCaching.value = false
  }
}

// 删除离线缓存
const removeOfflineCache = async () => {
  if (!checkServiceWorkerSupport()) return

  try {
    const cache = await caches.open('books-cache')
    await cache.delete(`/book-${bookId.value}`)
    isOfflineAvailable.value = false
    alert('离线缓存已删除')
  } catch (error) {
    console.error('删除缓存失败:', error)
    alert('删除缓存失败，请重试')
  }
}

// 从缓存中获取书籍
const getBookFromCache = async () => {
  if (!checkServiceWorkerSupport()) return null

  try {
    const cache = await caches.open('books-cache')
    const response = await cache.match(`/book-${bookId.value}`)

    if (!response) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('从缓存获取数据失败:', error)
    return null
  }
}

// 获取书籍数据（优先从网络获取，网络失败时尝试从缓存获取）
const fetchBook = async () => {
  loading.value = true

  try {
    // 先检查是否有缓存
    const isCached = await checkBookCached(bookId.value)
    isOfflineAvailable.value = isCached

    // 模拟网络请求
    // 实际应用中应该从API获取数据
    setTimeout(async () => {
      // 模拟网络请求失败的情况
      const isNetworkFail = false // 设为true可以测试离线模式

      if (!isNetworkFail) {
        // 正常加载模拟数据
        if (bookId.value === 1) {
          book.value = mockLunyu
        } else {
          // 如果没有找到书籍，返回书籍列表
          router.push('/books')
        }
      } else if (isCached) {
        // 网络请求失败但有缓存，从缓存加载
        const cachedBook = await getBookFromCache()
        if (cachedBook) {
          book.value = cachedBook
          alert('已切换到离线模式')
        } else {
          // 如果没有找到书籍，返回书籍列表
          router.push('/books')
        }
      } else {
        // 既没有网络也没有缓存
        alert('无法连接到网络且无离线缓存')
        router.push('/books')
      }

      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取书籍数据失败:', error)
    loading.value = false
    router.push('/books')
  }
}

// 切换阅读模式
const toggleReadingMode = () => {
  readingMode.value = readingMode.value === 'scroll' ? 'page' : 'scroll'
}

// 上一章
const prevChapter = () => {
  const chapters = book.value.chapters
  const currentIndex = chapters.findIndex((chapter) => chapter.id === chapterId.value)

  if (currentIndex > 0) {
    goToChapter(chapters[currentIndex - 1].id)
  }
}

// 下一章
const nextChapter = () => {
  const chapters = book.value.chapters
  const currentIndex = chapters.findIndex((chapter) => chapter.id === chapterId.value)

  if (currentIndex < chapters.length - 1) {
    goToChapter(chapters[currentIndex + 1].id)
  }
}

// 触摸事件处理
const handleTouchStart = (e: TouchEvent) => {
  touchStartX = e.changedTouches[0].screenX
}

const handleTouchEnd = (e: TouchEvent) => {
  touchEndX = e.changedTouches[0].screenX
  handleSwipe()
}

const handleSwipe = () => {
  // 仅在页面模式下启用左右滑动翻页
  if (readingMode.value !== 'page') return

  const swipeDistance = touchEndX - touchStartX

  if (swipeDistance > minSwipeDistance) {
    // 右滑，上一章
    prevChapter()
  } else if (swipeDistance < -minSwipeDistance) {
    // 左滑，下一章
    nextChapter()
  }
}

// 计算阅读进度
const updateReadingProgress = () => {
  if (readingMode.value === 'scroll') {
    const scrollPosition = window.scrollY
    const totalHeight = document.body.scrollHeight - window.innerHeight
    readingProgress.value = Math.round((scrollPosition / totalHeight) * 100)
  }
}

// 设备检测
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// 切换章节
const goToChapter = (id: number) => {
  router.push({
    path: `/book/read/${bookId.value}`,
    query: { chapter: id.toString() },
  })
}

// 调整字体大小
const changeFontSize = (delta: number) => {
  const newSize = fontSize.value + delta
  if (newSize >= 12 && newSize <= 24) {
    fontSize.value = newSize
  }
}

// 切换夜间模式
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
}

// 切换侧边栏
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// 添加书签
const toggleBookmark = (chapterId: number) => {
  const index = bookmarks.value.indexOf(chapterId)
  if (index > -1) {
    bookmarks.value.splice(index, 1)
  } else {
    bookmarks.value.push(chapterId)
  }
}

// 是否已添加书签
const isBookmarked = computed(() => {
  return bookmarks.value.includes(chapterId.value)
})

// 朗读功能
const isReading = ref(false)
const toggleReading = () => {
  isReading.value = !isReading.value
  if (isReading.value) {
    // 实际应用中应接入语音API
    console.log('开始朗读:', currentChapter.value?.content)
  } else {
    console.log('停止朗读')
  }
}

// 返回详情页
const goToBookDetail = () => {
  router.push(`/book/${bookId.value}`)
}

// 添加页面生命周期钩子
onMounted(async () => {
  // 获取书籍数据
  fetchBook()

  // 检查缓存状态
  const isCached = await checkBookCached(bookId.value)
  isOfflineAvailable.value = isCached

  // 添加滚动事件监听
  window.addEventListener('scroll', updateReadingProgress)

  // 检测设备类型
  checkMobile()
  window.addEventListener('resize', checkMobile)

  // 初始化阅读模式（根据设备自动选择）
  if (window.innerWidth < 768) {
    readingMode.value = 'page' // 移动端默认使用翻页模式
  }
})

onUnmounted(() => {
  // 清理事件监听
  window.removeEventListener('scroll', updateReadingProgress)
  window.removeEventListener('resize', checkMobile)
})

// 监听章节变化
watch(chapterId, () => {
  // 章节变化时，滚动到顶部
  window.scrollTo(0, 0)
  readingProgress.value = 0
})
</script>

<template>
  <div
    class="book-read-view"
    :class="{
      'dark-mode': isDarkMode,
      'mobile-view': isMobile,
      'page-mode': readingMode === 'page',
    }"
  >
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 顶部工具栏 -->
    <div class="top-toolbar" :class="{ 'toolbar-hidden': !showToolbar }">
      <button class="back-button" @click="goToBookDetail">
        <span class="icon-back"></span>
      </button>
      <h1 class="book-title">{{ book.title }}</h1>
      <div class="toolbar-actions">
        <button class="action-button" @click="toggleBookmark(chapterId)">
          <span
            class="icon"
            :class="{ 'icon-bookmark-filled': isBookmarked, 'icon-bookmark': !isBookmarked }"
          ></span>
        </button>
        <button class="action-button" @click="toggleSidebar">
          <span
            class="icon"
            :class="{ 'icon-menu': !isSidebarOpen, 'icon-close': isSidebarOpen }"
          ></span>
        </button>
      </div>
    </div>

    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ 'sidebar-open': isSidebarOpen }">
      <div class="sidebar-header">
        <h2>{{ book.title }}</h2>
        <button class="close-button" @click="toggleSidebar">
          <span class="icon-close"></span>
        </button>
      </div>

      <div class="sidebar-tabs">
        <button
          class="tab-button"
          :class="{ active: activeTab === 'chapters' }"
          @click="activeTab = 'chapters'"
        >
          目录
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'notes' }"
          @click="activeTab = 'notes'"
        >
          笔记
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'bookmarks' }"
          @click="activeTab = 'bookmarks'"
        >
          书签
        </button>
      </div>

      <div class="sidebar-content">
        <!-- 目录 -->
        <div v-if="activeTab === 'chapters'" class="chapters-list">
          <div
            v-for="chapter in book.chapters"
            :key="chapter.id"
            class="chapter-item"
            :class="{ active: chapter.id === chapterId }"
            @click="goToChapter(chapter.id)"
          >
            <span class="chapter-number">{{ chapter.id }}</span>
            <span class="chapter-title">{{ chapter.title }}</span>
          </div>
        </div>

        <!-- 笔记列表 -->
        <div v-if="activeTab === 'notes'" class="notes-list">
          <div v-if="notes.length === 0" class="empty-list">
            <p>暂无笔记</p>
          </div>
          <div v-else v-for="note in notes" :key="note.id" class="note-item">
            <div class="note-header">
              <span class="note-chapter">{{
                book.chapters.find((c) => c.id === note.chapterId)?.title
              }}</span>
              <button class="delete-button">删除</button>
            </div>
            <div class="note-selection">{{ note.selection }}</div>
            <div class="note-content">{{ note.content }}</div>
          </div>
        </div>

        <!-- 书签列表 -->
        <div v-if="activeTab === 'bookmarks'" class="bookmarks-list">
          <div v-if="bookmarks.length === 0" class="empty-list">
            <p>暂无书签</p>
          </div>
          <div
            v-else
            v-for="id in bookmarks"
            :key="id"
            class="bookmark-item"
            :class="{ active: id === chapterId }"
            @click="goToChapter(id)"
          >
            <span class="bookmark-icon"></span>
            <span class="bookmark-title">{{ book.chapters.find((c) => c.id === id)?.title }}</span>
          </div>
        </div>
      </div>

      <!-- 离线阅读选项 -->
      <div class="offline-options">
        <div class="offline-status">
          <span class="status-icon" :class="{ 'status-available': isOfflineAvailable }"></span>
          <span>{{ isOfflineAvailable ? '已缓存，可离线阅读' : '未缓存' }}</span>
        </div>
        <button
          v-if="!isOfflineAvailable"
          class="offline-button"
          @click="cacheBookForOffline"
          :disabled="isCaching"
        >
          {{ isCaching ? '缓存中...' : '下载离线阅读' }}
        </button>
        <button v-else class="offline-button" @click="removeOfflineCache">删除离线缓存</button>
      </div>
    </div>

    <!-- 阅读内容 -->
    <div
      class="reading-content"
      :class="{ 'sidebar-open': isSidebarOpen }"
      :style="{ fontSize: `${fontSize}px` }"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <div class="chapter-container">
        <div class="chapter-header">
          <h2 class="chapter-title">{{ currentChapter?.title }}</h2>
        </div>

        <div class="chapter-content">
          <p v-if="currentChapter?.content" class="original-text">{{ currentChapter.content }}</p>
          <p v-if="showTranslation && currentChapter?.translation" class="translation-text">
            <span class="translation-label">译文：</span>{{ currentChapter.translation }}
          </p>
          <div v-if="showNotes && currentChapter?.notes" class="notes-text">
            <span class="notes-label">注释：</span>
            <p>{{ currentChapter.notes }}</p>
          </div>
        </div>
      </div>

      <div class="chapter-navigation">
        <button class="prev-chapter" @click="prevChapter" :disabled="chapterId === 1">
          上一章
        </button>
        <div class="chapter-progress">{{ chapterId }}/{{ book.chapters.length }}</div>
        <button
          class="next-chapter"
          @click="nextChapter"
          :disabled="chapterId === book.chapters.length"
        >
          下一章
        </button>
      </div>
    </div>

    <!-- 底部工具栏 -->
    <div class="bottom-toolbar" :class="{ 'toolbar-hidden': !showToolbar }">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${readingProgress}%` }"></div>
      </div>
      <div class="toolbar-buttons">
        <button class="toolbar-button" @click="toggleReadingMode">
          <span
            class="icon"
            :class="{
              'icon-scroll': readingMode === 'page',
              'icon-page': readingMode === 'scroll',
            }"
          ></span>
          <span class="button-label">{{ readingMode === 'scroll' ? '滚动' : '翻页' }}</span>
        </button>
        <button class="toolbar-button" @click="toggleDarkMode">
          <span class="icon" :class="{ 'icon-moon': !isDarkMode, 'icon-sun': isDarkMode }"></span>
          <span class="button-label">{{ isDarkMode ? '日间' : '夜间' }}</span>
        </button>
        <button class="toolbar-button" @click="changeFontSize(-1)">
          <span class="icon icon-font-decrease">A-</span>
        </button>
        <button class="toolbar-button" @click="changeFontSize(1)">
          <span class="icon icon-font-increase">A+</span>
        </button>
        <button class="toolbar-button" @click="toggleReading">
          <span
            class="icon"
            :class="{ 'icon-volume': !isReading, 'icon-volume-mute': isReading }"
          ></span>
          <span class="button-label">朗读</span>
        </button>
      </div>
    </div>

    <!-- 移动端翻页提示 -->
    <div v-if="readingMode === 'page'" class="page-hint">
      <div class="hint-left">← 上一章</div>
      <div class="hint-right">下一章 →</div>
    </div>
  </div>
</template>

<style scoped>
.book-read-view {
  position: relative;
  min-height: 100vh;
  background-color: #f8f5f0;
  color: #333;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.dark-mode {
  background-color: #252525;
  color: #e0e0e0;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dark-mode .loading-overlay {
  background-color: rgba(37, 37, 37, 0.9);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #842029;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 顶部工具栏 */
.top-toolbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
  transition: transform 0.3s;
}

.dark-mode .top-toolbar {
  background-color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.toolbar-hidden {
  transform: translateY(-100%);
}

.back-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #842029;
}

.dark-mode .back-button {
  color: #e0e0e0;
}

.book-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toolbar-actions {
  display: flex;
  gap: 15px;
}

.action-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.dark-mode .action-button {
  color: #ccc;
}

/* 侧边栏 */
.sidebar {
  position: fixed;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100vh;
  background-color: #fff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 200;
  transition: right 0.3s;
  display: flex;
  flex-direction: column;
}

.sidebar-open {
  right: 0;
}

.dark-mode .sidebar {
  background-color: #333;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.dark-mode .sidebar-header {
  border-bottom-color: #444;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.dark-mode .close-button {
  color: #ccc;
}

.sidebar-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}

.dark-mode .sidebar-tabs {
  border-bottom-color: #444;
}

.tab-button {
  flex: 1;
  padding: 15px 0;
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  color: #666;
  border-bottom: 2px solid transparent;
}

.tab-button.active {
  color: #842029;
  border-bottom-color: #842029;
}

.dark-mode .tab-button {
  color: #ccc;
}

.dark-mode .tab-button.active {
  color: #ff9b9f;
  border-bottom-color: #ff9b9f;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.chapters-list,
.notes-list,
.bookmarks-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chapter-item,
.bookmark-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.chapter-item:hover,
.bookmark-item:hover {
  background-color: #f5f5f5;
}

.dark-mode .chapter-item:hover,
.dark-mode .bookmark-item:hover {
  background-color: #3a3a3a;
}

.chapter-item.active,
.bookmark-item.active {
  background-color: #f0e6dc;
  color: #842029;
}

.dark-mode .chapter-item.active,
.dark-mode .bookmark-item.active {
  background-color: #503e3a;
  color: #ff9b9f;
}

.chapter-number {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background-color: #842029;
  color: white;
  border-radius: 50%;
  margin-right: 10px;
  font-size: 12px;
}

.chapter-title {
  flex: 1;
}

.empty-list {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: #999;
}

.note-item {
  padding: 15px;
  border-radius: 4px;
  background-color: #f9f9f9;
  margin-bottom: 10px;
}

.dark-mode .note-item {
  background-color: #3a3a3a;
}

.note-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.note-chapter {
  font-weight: bold;
  color: #842029;
}

.dark-mode .note-chapter {
  color: #ff9b9f;
}

.delete-button {
  background: none;
  border: none;
  color: #666;
  font-size: 12px;
  cursor: pointer;
}

.note-selection {
  padding: 10px;
  background-color: #f0e6dc;
  border-radius: 4px;
  margin-bottom: 10px;
  font-style: italic;
}

.dark-mode .note-selection {
  background-color: #503e3a;
}

.note-content {
  color: #666;
}

.bookmark-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: #842029;
  clip-path: polygon(50% 0%, 100% 25%, 100% 100%, 50% 75%, 0% 100%, 0% 25%);
  margin-right: 10px;
}

.dark-mode .bookmark-icon {
  background-color: #ff9b9f;
}

/* 离线阅读选项 */
.offline-options {
  padding: 20px;
  border-top: 1px solid #eee;
}

.dark-mode .offline-options {
  border-top-color: #444;
}

.offline-status {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #666;
}

.status-icon {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ccc;
  margin-right: 8px;
}

.status-available {
  background-color: #4caf50;
}

.offline-button {
  width: 100%;
  padding: 10px 0;
  background-color: #842029;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.offline-button:hover {
  background-color: #6b1717;
}

.offline-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 阅读内容 */
.reading-content {
  padding: 80px 20px 100px;
  max-width: 800px;
  margin: 0 auto;
  transition: margin-right 0.3s;
}

.reading-content.sidebar-open {
  margin-right: 300px;
}

.chapter-container {
  margin-bottom: 30px;
}

.chapter-header {
  margin-bottom: 20px;
  text-align: center;
}

.chapter-header .chapter-title {
  font-size: 24px;
  font-weight: bold;
  color: #842029;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.dark-mode .chapter-header .chapter-title {
  color: #ff9b9f;
}

.chapter-content {
  line-height: 1.8;
}

.original-text {
  margin-bottom: 20px;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.translation-text {
  margin-bottom: 20px;
  color: #666;
}

.dark-mode .translation-text {
  color: #aaa;
}

.translation-label,
.notes-label {
  font-weight: bold;
  color: #842029;
}

.dark-mode .translation-label,
.dark-mode .notes-label {
  color: #ff9b9f;
}

.notes-text {
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
  color: #666;
  font-size: 0.9em;
}

.dark-mode .notes-text {
  background-color: #3a3a3a;
  color: #aaa;
}

.chapter-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.dark-mode .chapter-navigation {
  border-top-color: #444;
}

.prev-chapter,
.next-chapter {
  padding: 10px 15px;
  background-color: #842029;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.prev-chapter:hover,
.next-chapter:hover {
  background-color: #6b1717;
}

.prev-chapter:disabled,
.next-chapter:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.chapter-progress {
  font-size: 14px;
  color: #666;
}

.dark-mode .chapter-progress {
  color: #aaa;
}

/* 底部工具栏 */
.bottom-toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
  transition: transform 0.3s;
}

.dark-mode .bottom-toolbar {
  background-color: #333;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.3);
}

.toolbar-hidden {
  transform: translateY(100%);
}

.progress-bar {
  height: 4px;
  background-color: #eee;
  position: relative;
}

.dark-mode .progress-bar {
  background-color: #444;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #842029;
  transition: width 0.3s;
}

.dark-mode .progress-fill {
  background-color: #ff9b9f;
}

.toolbar-buttons {
  display: flex;
  justify-content: space-around;
  padding: 15px 0;
}

.toolbar-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
}

.dark-mode .toolbar-button {
  color: #ccc;
}

.icon {
  font-size: 20px;
  margin-bottom: 5px;
}

.button-label {
  font-size: 12px;
}

/* 移动端样式 */
.mobile-view .reading-content {
  padding: 70px 15px 80px;
}

.mobile-view .sidebar {
  width: 260px;
}

.mobile-view .reading-content.sidebar-open {
  margin-right: 0;
}

.mobile-view .chapter-header .chapter-title {
  font-size: 20px;
}

.mobile-view .top-toolbar {
  height: 50px;
}

.mobile-view .book-title {
  font-size: 16px;
}

/* 翻页模式样式 */
.page-mode .reading-content {
  min-height: calc(100vh - 130px);
  display: flex;
  flex-direction: column;
}

.page-mode .chapter-container {
  flex: 1;
}

.page-hint {
  display: none;
  position: fixed;
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
  pointer-events: none;
}

.mobile-view.page-mode .page-hint {
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
}

.hint-left,
.hint-right {
  background-color: rgba(0, 0, 0, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 10px;
  border-radius: 4px;
}

.dark-mode .hint-left,
.dark-mode .hint-right {
  background-color: rgba(255, 255, 255, 0.1);
  color: rgba(0, 0, 0, 0.7);
}

/* 图标样式 */
.icon-back::before {
  content: '←';
}

.icon-menu::before {
  content: '☰';
}

.icon-close::before {
  content: '×';
}

.icon-bookmark::before {
  content: '☆';
}

.icon-bookmark-filled::before {
  content: '★';
}

.icon-scroll::before {
  content: '↕';
}

.icon-page::before {
  content: '↔';
}

.icon-moon::before {
  content: '☾';
}

.icon-sun::before {
  content: '☀';
}

.icon-volume::before {
  content: '🔊';
}

.icon-volume-mute::before {
  content: '��';
}

/* 响应式设计 */
@media (max-width: 768px) {
  .reading-content {
    padding-left: 15px;
    padding-right: 15px;
  }

  .sidebar {
    width: 80%;
    right: -80%;
  }

  .reading-content.sidebar-open {
    margin-right: 0;
  }

  .toolbar-buttons {
    padding: 10px 0;
  }

  .button-label {
    font-size: 10px;
  }

  .chapter-navigation {
    flex-direction: column;
    gap: 10px;
  }

  .prev-chapter,
  .next-chapter {
    width: 100%;
  }
}
</style>
