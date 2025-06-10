<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 精选经典书籍数据
const classicBooks = ref([
  {
    id: 1,
    title: '论语',
    author: '孔子及其弟子',
    cover: '/images/books/lunyu.png',
    description:
      '《论语》记录了孔子及其弟子的言行，是儒家思想的重要经典，对中国传统文化产生了深远影响。',
  },
  {
    id: 2,
    title: '大学',
    author: '曾子',
    cover: '/images/books/daxue.png',
    description:
      '《大学》阐述"修身齐家治国平天下"的治学次第，是儒家思想的重要代表作，也是四书之一。',
  },
  {
    id: 3,
    title: '中庸',
    author: '子思',
    cover: '/images/books/zhongyong.png',
    description: '《中庸》强调"中和"思想，阐述"诚"的哲学，体现了中国传统文化中的中正平和精神。',
  },
  {
    id: 4,
    title: '孟子',
    author: '孟子及其弟子',
    cover: '/images/books/mengzi.png',
    description: '《孟子》记录了孟子的言行和思想，提出"仁政"、"性善论"等重要观点，是儒家经典著作。',
  },
])

// 今日名句数据
const dailyQuote = ref({
  content: '君子喻于义，小人喻于利。',
  source: '《论语·里仁》',
  explanation: '君子明白什么是道义，并按照道义行事；小人只知道什么对自己有利，一切以利益为出发点。',
})

// 学习路径数据
const learningPaths = ref([
  { name: '入门启蒙', icon: 'reading', description: '初识国学基础概念，培养兴趣' },
  { name: '经典研读', icon: 'notebook', description: '系统学习四书五经等重要典籍' },
  { name: '深度探究', icon: 'search', description: '探讨国学精髓，融会贯通' },
])

// 线上讲堂数据
const onlineLectures = ref([
  { title: '《论语》导读', lecturer: '王教授', time: '每周六 20:00' },
  { title: '诗词鉴赏', lecturer: '李博士', time: '每周日 15:00' },
  { title: '易经解析', lecturer: '张老师', time: '每周三 19:30' },
])

const goToBookDetail = (id: number) => {
  router.push(`/book/${id}`)
}
</script>

<template>
  <main class="home-container">
    <!-- 顶部水墨背景横幅 -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="main-title">传承国学经典，弘扬中华文化</h1>
        <p class="subtitle">探索中国传统文化的智慧宝库，汲取先贤智慧</p>
        <tiny-button type="primary" class="cta-button" @click="router.push('/books')">
          开启学习之旅
        </tiny-button>
      </div>
    </section>

    <!-- 精选经典书籍区域 -->
    <section class="section classic-books">
      <div class="section-header">
        <h2>精选经典</h2>
        <tiny-button type="text" theme="primary" @click="router.push('/books')">
          查看全部 <tiny-icon name="arrow-right"></tiny-icon>
        </tiny-button>
      </div>

      <div class="book-grid">
        <div
          v-for="book in classicBooks"
          :key="book.id"
          class="book-card"
          @click="goToBookDetail(book.id)"
        >
          <div class="book-cover">
            <img :src="book.cover" :alt="book.title" />
          </div>
          <div class="book-info">
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-author">{{ book.author }}</p>
            <p class="book-description">{{ book.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能区块 -->
    <section class="features-section">
      <tiny-row :gutter="24">
        <!-- 今日名句 -->
        <tiny-col :xs="24" :md="8">
          <div class="feature-card daily-quote">
            <h3 class="feature-title">今日名句</h3>
            <div class="quote-content">
              <p class="quote-text">"{{ dailyQuote.content }}"</p>
              <p class="quote-source">—— {{ dailyQuote.source }}</p>
            </div>
            <p class="quote-explanation">{{ dailyQuote.explanation }}</p>
          </div>
        </tiny-col>

        <!-- 学习路径 -->
        <tiny-col :xs="24" :md="8">
          <div class="feature-card learning-path">
            <h3 class="feature-title">学习路径</h3>
            <ul class="path-list">
              <li v-for="(path, index) in learningPaths" :key="index" class="path-item">
                <tiny-icon :name="path.icon"></tiny-icon>
                <div>
                  <h4>{{ path.name }}</h4>
                  <p>{{ path.description }}</p>
                </div>
              </li>
            </ul>
          </div>
        </tiny-col>

        <!-- 线上讲堂 -->
        <tiny-col :xs="24" :md="8">
          <div class="feature-card online-lectures">
            <h3 class="feature-title">线上讲堂</h3>
            <ul class="lecture-list">
              <li v-for="(lecture, index) in onlineLectures" :key="index" class="lecture-item">
                <h4>{{ lecture.title }}</h4>
                <p>主讲：{{ lecture.lecturer }}</p>
                <p class="lecture-time"><tiny-icon name="time"></tiny-icon> {{ lecture.time }}</p>
              </li>
            </ul>
            <tiny-button size="small" type="primary" plain class="view-more-btn">
              查看更多课程
            </tiny-button>
          </div>
        </tiny-col>
      </tiny-row>
    </section>

    <div class="cta-buttons">
      <router-link to="/images-test" class="primary-button"> 图片错误处理测试 </router-link>
    </div>
  </main>
</template>

<style scoped>
/* 主容器样式 */
.home-container {
  padding: 0;
  font-family: 'STXihei', 'Microsoft YaHei', sans-serif;
}

/* 水墨背景横幅 */
.hero {
  background-image: url('https://img.51miz.com/Element/00/71/99/28/7755928_E719928_bf82292d.png');
  background-size: cover;
  background-position: center;
  position: relative;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  margin-bottom: 40px;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  padding: 0 20px;
}

.main-title {
  font-size: 3.2rem;
  margin-bottom: 20px;
  font-family: 'STKaiti', 'KaiTi', serif;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.subtitle {
  font-size: 1.3rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

.cta-button {
  font-size: 1.1rem;
  padding: 12px 30px;
  border-radius: 4px;
  background-color: #842029;
  border-color: #842029;
}

.cta-button:hover {
  background-color: #9a2530;
  border-color: #9a2530;
}

/* 通用部分标题样式 */
.section {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.section-header h2 {
  font-size: 1.8rem;
  font-family: 'STKaiti', 'KaiTi', serif;
  margin: 0;
  color: #333;
  position: relative;
}

.section-header h2::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #842029;
}

/* 经典书籍区域 */
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
}

.book-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #eee;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.book-cover {
  height: 200px;
  overflow: hidden;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.book-card:hover .book-cover img {
  transform: scale(1.05);
}

.book-info {
  padding: 15px;
}

.book-title {
  font-size: 1.4rem;
  margin: 0 0 5px;
  font-family: 'STKaiti', 'KaiTi', serif;
  color: #333;
}

.book-author {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.book-description {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 功能区块样式 */
.features-section {
  background-color: #f8f8f8;
  padding: 50px 20px;
  margin-top: 40px;
}

.features-section .tiny-row {
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 25px;
  height: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  border-top: 3px solid #842029;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
  font-family: 'STKaiti', 'KaiTi', serif;
  position: relative;
  padding-bottom: 10px;
}

.feature-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 2px;
  background-color: #842029;
}

/* 今日名句样式 */
.quote-content {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #f9f5f0;
  border-radius: 4px;
  position: relative;
}

.quote-content::before {
  content: '"';
  position: absolute;
  top: -15px;
  left: 10px;
  font-size: 40px;
  color: #842029;
  font-family: serif;
}

.quote-text {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #333;
  font-family: 'STKaiti', 'KaiTi', serif;
  margin-bottom: 10px;
}

.quote-source {
  text-align: right;
  font-style: italic;
  color: #666;
}

.quote-explanation {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #555;
}

/* 学习路径样式 */
.path-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.path-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #eee;
}

.path-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.path-item .tiny-icon {
  margin-right: 15px;
  font-size: 24px;
  color: #842029;
}

.path-item h4 {
  margin: 0 0 5px;
  font-size: 1.1rem;
  color: #333;
}

.path-item p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

/* 线上讲堂样式 */
.lecture-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.lecture-item {
  padding: 12px 0;
  border-bottom: 1px dashed #eee;
}

.lecture-item:last-child {
  border-bottom: none;
}

.lecture-item h4 {
  margin: 0 0 5px;
  font-size: 1.1rem;
  color: #333;
}

.lecture-item p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.lecture-time {
  display: flex;
  align-items: center;
  color: #842029;
  margin-top: 5px;
}

.lecture-time .tiny-icon {
  margin-right: 5px;
}

.view-more-btn {
  margin-top: 15px;
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.2rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .hero {
    height: 400px;
  }

  .feature-card {
    margin-bottom: 20px;
  }
}
</style>
