<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 定义类型
interface Chapter {
  title: string
  content: string
}

interface Book {
  id: number
  title: string
  author: string
  dynasty: string
  school: string
  type: string
  cover: string
  description: string
  content: string[]
  chapters: Chapter[]
}

const route = useRoute()
const router = useRouter()
const bookId = computed(() => Number(route.params.id))

// 书籍详情数据
const book = ref<Book>({
  id: 0,
  title: '',
  author: '',
  dynasty: '',
  school: '',
  type: '',
  cover: '',
  description: '',
  content: [],
  chapters: [],
})

// 加载状态
const loading = ref(true)

// 章节选择
const activeChapter = ref(0)

// 模拟数据库
const booksDatabase: Book[] = [
  {
    id: 1,
    title: '论语',
    author: '孔子及其弟子',
    dynasty: '先秦',
    school: '儒家',
    type: '经部',
    cover: '/images/books/lunyu.png',
    description:
      '《论语》记录了孔子及其弟子的言行，是儒家思想的重要经典，对中国传统文化产生了深远影响。',
    content: [
      '子曰："学而时习之，不亦说乎？有朋自远方来，不亦乐乎？人不知而不愠，不亦君子乎？"',
      '子曰："温故而知新，可以为师矣。"',
      '子曰："吾十有五而志于学，三十而立，四十而不惑，五十而知天命，六十而耳顺，七十而从心所欲，不逾矩。"',
      '子曰："知之者不如好之者，好之者不如乐之者。"',
      '子曰："学而不思则罔，思而不学则殆。"',
    ],
    chapters: [
      {
        title: '学而篇',
        content: '子曰："学而时习之，不亦说乎？有朋自远方来，不亦乐乎？人不知而不愠，不亦君子乎？"',
      },
      { title: '为政篇', content: '子曰："为政以德，譬如北辰，居其所而众星共之。"' },
      { title: '八佾篇', content: '孔子谓季氏："八佾舞于庭，是可忍也，孰不可忍也？"' },
      { title: '里仁篇', content: '子曰："里仁为美。择不处仁，焉得知？"' },
      { title: '公冶长篇', content: '子谓公冶长："可妻也，虽在缧绁之中，非其罪也。"以其子妻之。' },
    ],
  },
  {
    id: 2,
    title: '大学',
    author: '曾子',
    dynasty: '先秦',
    school: '儒家',
    type: '经部',
    cover: '/images/books/daxue.png',
    description:
      '《大学》阐述"修身齐家治国平天下"的治学次第，是儒家思想的重要代表作，也是四书之一。',
    content: [
      '大学之道，在明明德，在亲民，在止于至善。',
      '知止而后有定，定而后能静，静而后能安，安而后能虑，虑而后能得。',
      '物有本末，事有终始，知所先后，则近道矣。',
      '古之欲明明德于天下者，先治其国；欲治其国者，先齐其家；欲齐其家者，先修其身；欲修其身者，先正其心；欲正其心者，先诚其意；欲诚其意者，先致其知；致知在格物。',
    ],
    chapters: [
      { title: '第一章', content: '大学之道，在明明德，在亲民，在止于至善。' },
      {
        title: '第二章',
        content: '知止而后有定，定而后能静，静而后能安，安而后能虑，虑而后能得。',
      },
      { title: '第三章', content: '物有本末，事有终始，知所先后，则近道矣。' },
      {
        title: '第四章',
        content:
          '古之欲明明德于天下者，先治其国；欲治其国者，先齐其家；欲齐其家者，先修其身；欲修其身者，先正其心；欲正其心者，先诚其意；欲诚其意者，先致其知；致知在格物。',
      },
    ],
  },
]

// 获取书籍数据
const fetchBook = () => {
  loading.value = true
  // 模拟API请求
  setTimeout(() => {
    const foundBook = booksDatabase.find((b) => b.id === bookId.value)
    if (foundBook) {
      book.value = foundBook
    } else {
      // 如果未找到书籍，返回列表页
      router.push('/books')
    }
    loading.value = false
  }, 500)
}

// 收藏书籍
const collectBook = () => {
  // 实现收藏功能
  console.log('收藏书籍:', book.value.title)
}

// 返回列表
const goBack = () => {
  router.push('/books')
}

// 添加跳转到阅读页面的方法
const goToReadPage = () => {
  router.push(`/book/read/${bookId.value}`)
}

// 页面加载时获取数据
onMounted(() => {
  fetchBook()
})
</script>

<template>
  <div class="book-detail-container">
    <!-- 加载中 -->
    <div class="loading" v-if="loading">
      <tiny-spinner type="primary"></tiny-spinner>
      <p>正在加载书籍信息...</p>
    </div>

    <template v-else>
      <!-- 返回按钮 -->
      <div class="back-link">
        <tiny-button type="text" @click="goBack">
          <tiny-icon name="arrow-left"></tiny-icon> 返回书籍列表
        </tiny-button>
      </div>

      <!-- 书籍基本信息 -->
      <div class="book-info-section">
        <div class="book-cover">
          <img :src="book.cover" :alt="book.title" />
        </div>
        <div class="book-details">
          <h1 class="book-title">{{ book.title }}</h1>
          <div class="book-meta">
            <div class="meta-item">
              <span class="label">作者：</span>
              <span class="value">{{ book.author }}</span>
            </div>
            <div class="meta-item">
              <span class="label">朝代：</span>
              <span class="value">{{ book.dynasty }}</span>
            </div>
            <div class="meta-item">
              <span class="label">流派：</span>
              <span class="value">{{ book.school }}</span>
            </div>
            <div class="meta-item">
              <span class="label">分类：</span>
              <span class="value">{{ book.type }}</span>
            </div>
          </div>
          <div class="book-actions">
            <tiny-button type="primary" @click="goToReadPage">
              <tiny-icon name="reading"></tiny-icon> 开始阅读
            </tiny-button>
            <tiny-button type="success" @click="collectBook">
              <tiny-icon name="star"></tiny-icon> 收藏
            </tiny-button>
            <tiny-button type="info"> <tiny-icon name="share"></tiny-icon> 分享 </tiny-button>
          </div>
          <div class="book-description">
            <h3>内容简介</h3>
            <p>{{ book.description }}</p>
          </div>
        </div>
      </div>

      <!-- 内容预览 -->
      <div class="book-content-section">
        <h2>经典内容</h2>

        <!-- 章节选择 -->
        <div class="chapter-tabs">
          <tiny-tabs v-model="activeChapter" type="card">
            <tiny-tab-pane
              v-for="(chapter, index) in book.chapters"
              :key="index"
              :label="chapter.title"
              :name="index"
            >
              <div class="chapter-content">
                <p class="content-text">{{ chapter.content }}</p>
                <div class="translation">
                  <h4>译文</h4>
                  <p>这里是对原文的现代汉语翻译，帮助读者更好地理解经典内容。</p>
                </div>
                <div class="annotation">
                  <h4>注释</h4>
                  <p>这里是对重要词句的注释，解释其中的典故、含义和历史背景等。</p>
                </div>
              </div>
            </tiny-tab-pane>
          </tiny-tabs>
        </div>
      </div>

      <!-- 相关推荐 -->
      <div class="related-books">
        <h2>相关推荐</h2>
        <div class="related-info">
          <p>
            这里可以展示与《{{
              book.title
            }}》相关的其他书籍推荐，如同一作者的作品、同类题材的经典等。
          </p>
        </div>
      </div>

      <!-- 学习资源 -->
      <div class="learning-resources">
        <h2>学习资源</h2>
        <div class="resource-list">
          <div class="resource-item">
            <tiny-icon name="video-play" size="24px"></tiny-icon>
            <div class="resource-info">
              <h4>《{{ book.title }}》导读讲座</h4>
              <p>由著名国学专家主讲，深入浅出地讲解《{{ book.title }}》的核心思想和价值。</p>
            </div>
          </div>
          <div class="resource-item">
            <tiny-icon name="document" size="24px"></tiny-icon>
            <div class="resource-info">
              <h4>《{{ book.title }}》学习笔记</h4>
              <p>精选读者学习笔记，分享对《{{ book.title }}》的理解和感悟。</p>
            </div>
          </div>
          <div class="resource-item">
            <tiny-icon name="chat-dot-square" size="24px"></tiny-icon>
            <div class="resource-info">
              <h4>《{{ book.title }}》学习讨论组</h4>
              <p>加入讨论组，与其他读者一起交流学习心得。</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.book-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 加载中 */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
}

.loading p {
  margin-top: 20px;
  color: #666;
}

/* 返回链接 */
.back-link {
  margin-bottom: 20px;
}

/* 书籍基本信息 */
.book-info-section {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.book-cover {
  flex-shrink: 0;
  width: 240px;
  height: 320px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-details {
  flex: 1;
}

.book-title {
  font-size: 32px;
  margin: 0 0 20px;
  color: #333;
  font-family: 'STKaiti', 'KaiTi', serif;
  line-height: 1.3;
}

.book-meta {
  margin-bottom: 25px;
}

.meta-item {
  display: inline-block;
  margin-right: 25px;
  margin-bottom: 10px;
}

.meta-item .label {
  color: #666;
  margin-right: 5px;
}

.meta-item .value {
  color: #333;
  font-weight: 500;
}

.book-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
}

.book-description {
  margin-top: 25px;
}

.book-description h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.book-description p {
  line-height: 1.7;
  color: #555;
  text-align: justify;
}

/* 内容预览 */
.book-content-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.book-content-section h2,
.related-books h2,
.learning-resources h2 {
  font-size: 24px;
  margin: 0 0 20px;
  color: #333;
  font-family: 'STKaiti', 'KaiTi', serif;
  position: relative;
  padding-bottom: 10px;
}

.book-content-section h2::after,
.related-books h2::after,
.learning-resources h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 2px;
  background-color: #842029;
}

.chapter-content {
  padding: 20px;
  background-color: #f9f6f1;
  border-radius: 8px;
}

.content-text {
  font-size: 18px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 25px;
  font-family: 'STKaiti', 'KaiTi', serif;
  text-align: justify;
}

.translation,
.annotation {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #ddd;
}

.translation h4,
.annotation h4 {
  font-size: 16px;
  margin: 0 0 10px;
  color: #842029;
}

.translation p,
.annotation p {
  line-height: 1.7;
  color: #555;
}

/* 相关推荐 */
.related-books {
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.related-info {
  color: #666;
  font-style: italic;
}

/* 学习资源 */
.learning-resources {
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.resource-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.resource-item {
  display: flex;
  align-items: flex-start;
  padding: 15px;
  background-color: #f9f6f1;
  border-radius: 8px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.resource-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.resource-item .tiny-icon {
  margin-right: 15px;
  color: #842029;
  margin-top: 2px;
}

.resource-info h4 {
  margin: 0 0 5px;
  color: #333;
  font-size: 16px;
}

.resource-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .book-info-section {
    flex-direction: column;
  }

  .book-cover {
    width: 180px;
    height: 240px;
    margin: 0 auto 20px;
  }

  .book-title {
    font-size: 24px;
    text-align: center;
  }

  .book-meta {
    text-align: center;
  }

  .book-actions {
    justify-content: center;
  }
}
</style>
