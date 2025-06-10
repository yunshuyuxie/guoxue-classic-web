<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 轮播图数据
const banners = ref([
  {
    id: 1,
    title: '四书精读系列课程',
    subtitle: '跟随名师领略儒家经典智慧',
    image: 'images/courses/banner1.png',
    link: '/course/101',
  },
  {
    id: 2,
    title: '诗词鉴赏专题讲座',
    subtitle: '感受古典诗词之美，提升文学素养',
    image: 'images/courses/banner2.png',
    link: '/course/102',
  },
  {
    id: 3,
    title: '国学与现代生活',
    subtitle: '传统智慧在当代的应用与实践',
    image: 'images/courses/banner3.png',
    link: '/course/103',
  },
])

// 当前轮播图索引
const currentBannerIndex = ref(0)

// 自动轮播
let bannerInterval: number | null = null
const startBannerInterval = () => {
  bannerInterval = window.setInterval(() => {
    nextBanner()
  }, 5000)
}

// 轮播图切换
const nextBanner = () => {
  currentBannerIndex.value = (currentBannerIndex.value + 1) % banners.value.length
}

const prevBanner = () => {
  currentBannerIndex.value =
    (currentBannerIndex.value - 1 + banners.value.length) % banners.value.length
}

// 课程分类
const categories = ref([
  { id: 'all', name: '全部课程' },
  { id: 'classics', name: '经典导读' },
  { id: 'modern', name: '国学与现代生活' },
  { id: 'culture', name: '传统文化精髓' },
  { id: 'philosophy', name: '哲学思想' },
  { id: 'literature', name: '文学艺术' },
])

// 当前选中的分类
const currentCategory = ref('all')

// 课程数据
const courses = ref([
  {
    id: 101,
    title: '《论语》精读',
    cover: 'images/courses/lunyu.png',
    instructor: '王立国',
    instructorTitle: '北京大学哲学系教授',
    instructorAvatar: 'images/instructors/wang.png',
    duration: '24课时',
    rating: 4.9,
    students: 1256,
    price: 199,
    category: 'classics',
    tags: ['儒家经典', '四书', '入门'],
    description:
      '本课程带您深入了解《论语》的核心思想，透过孔子言行，探讨儒家思想对中国文化的深远影响。',
    chapters: [
      { title: '绪论：《论语》的成书与流传', duration: '45分钟' },
      { title: '学而篇精读', duration: '60分钟' },
      { title: '为政篇精读', duration: '55分钟' },
      { title: '八佾篇精读', duration: '50分钟' },
    ],
  },
  {
    id: 102,
    title: '唐诗宋词鉴赏',
    cover: 'images/courses/poetry.png',
    instructor: '李清华',
    instructorTitle: '中国人民大学文学院教授',
    instructorAvatar: 'images/instructors/li.png',
    duration: '36课时',
    rating: 4.8,
    students: 987,
    price: 249,
    category: 'literature',
    tags: ['古典文学', '诗词', '进阶'],
    description: '带您领略唐诗宋词的艺术魅力，了解中国古典诗词的发展脉络，提升文学鉴赏能力。',
    chapters: [
      { title: '绪论：中国古典诗词发展概述', duration: '50分钟' },
      { title: '初唐四杰及其诗歌特点', duration: '60分钟' },
      { title: '盛唐气象与李白诗歌', duration: '65分钟' },
      { title: '杜甫诗歌的艺术成就', duration: '55分钟' },
    ],
  },
  {
    id: 103,
    title: '国学智慧与现代管理',
    cover: 'images/courses/management.png',
    instructor: '张明德',
    instructorTitle: '清华大学管理学院教授',
    instructorAvatar: 'images/instructors/zhang.png',
    duration: '18课时',
    rating: 4.7,
    students: 1542,
    price: 299,
    category: 'modern',
    tags: ['管理', '应用', '高级'],
    description: '将国学经典中的智慧应用于现代企业管理，探讨中国传统文化对现代商业实践的启示。',
    chapters: [
      { title: '儒家思想与领导力', duration: '45分钟' },
      { title: '《孙子兵法》与企业战略', duration: '60分钟' },
      { title: '《道德经》与组织管理', duration: '50分钟' },
      { title: '《周易》与商业决策', duration: '55分钟' },
    ],
  },
  {
    id: 104,
    title: '中国传统礼仪文化',
    cover: 'images/courses/etiquette.png',
    instructor: '赵文华',
    instructorTitle: '北京师范大学文化研究所研究员',
    instructorAvatar: 'images/instructors/zhao.png',
    duration: '12课时',
    rating: 4.6,
    students: 876,
    price: 149,
    category: 'culture',
    tags: ['礼仪', '传统文化', '入门'],
    description: '了解中国传统礼仪的形成与发展，掌握传统礼仪的基本内容与现代应用。',
    chapters: [
      { title: '中国礼仪文化概述', duration: '40分钟' },
      { title: '家庭礼仪与孝道文化', duration: '45分钟' },
      { title: '社交礼仪与人际关系', duration: '50分钟' },
      { title: '传统节日礼仪', duration: '55分钟' },
    ],
  },
  {
    id: 105,
    title: '道家思想解读',
    cover: 'images/courses/daoism.png',
    instructor: '吴德本',
    instructorTitle: '复旦大学哲学系教授',
    instructorAvatar: 'images/instructors/wu.png',
    duration: '20课时',
    rating: 4.9,
    students: 1024,
    price: 229,
    category: 'philosophy',
    tags: ['道家', '哲学', '进阶'],
    description: '深入解读老庄哲学，探讨道家思想对中国文化的影响及其现代价值。',
    chapters: [
      { title: '道家思想概述', duration: '50分钟' },
      { title: '《道德经》核心概念解读', duration: '65分钟' },
      { title: '庄子的逍遥与自由', duration: '60分钟' },
      { title: '道家思想与现代生活', duration: '55分钟' },
    ],
  },
  {
    id: 106,
    title: '《大学》《中庸》精读',
    cover: 'images/courses/daxue.png',
    instructor: '王立国',
    instructorTitle: '北京大学哲学系教授',
    instructorAvatar: 'images/instructors/wang.png',
    duration: '16课时',
    rating: 4.8,
    students: 892,
    price: 179,
    category: 'classics',
    tags: ['儒家经典', '四书', '进阶'],
    description: '深入解读《大学》《中庸》的核心思想，探讨修身齐家治国平天下的儒家理想。',
    chapters: [
      { title: '《大学》的地位与影响', duration: '45分钟' },
      { title: '格物致知与修身', duration: '55分钟' },
      { title: '《中庸》的思想体系', duration: '50分钟' },
      { title: '中和之道的现代意义', duration: '60分钟' },
    ],
  },
])

// 根据分类筛选课程
const filteredCourses = computed(() => {
  if (currentCategory.value === 'all') {
    return courses.value
  }
  return courses.value.filter((course) => course.category === currentCategory.value)
})

// 学习路径
const learningPaths = ref([
  {
    id: 1,
    title: '儒家经典研修路径',
    description: '从入门到精通，系统学习儒家经典著作',
    courses: [
      { id: 101, title: '《论语》精读', level: '入门' },
      { id: 106, title: '《大学》《中庸》精读', level: '进阶' },
      { id: 107, title: '《孟子》精读', level: '进阶' },
      { id: 108, title: '四书章句集注研读', level: '高级' },
    ],
  },
  {
    id: 2,
    title: '中国古典诗词鉴赏路径',
    description: '系统学习中国古典诗词，提升文学素养',
    courses: [
      { id: 109, title: '诗词格律基础', level: '入门' },
      { id: 102, title: '唐诗宋词鉴赏', level: '进阶' },
      { id: 110, title: '词曲赏析', level: '进阶' },
      { id: 111, title: '古典诗词创作', level: '高级' },
    ],
  },
  {
    id: 3,
    title: '国学与现代应用路径',
    description: '学习传统智慧在现代社会中的应用',
    courses: [
      { id: 112, title: '国学经典导读', level: '入门' },
      { id: 103, title: '国学智慧与现代管理', level: '进阶' },
      { id: 113, title: '国学与家庭教育', level: '进阶' },
      { id: 114, title: '国学与人生智慧', level: '高级' },
    ],
  },
])

// 直播课程日历
const liveCourses = ref([
  {
    id: 201,
    title: '《周易》与人生智慧',
    instructor: '吴德本',
    date: '2023-10-25',
    time: '19:30-21:00',
    cover: 'images/courses/zhouyi_live.png',
    enrolled: 356,
    capacity: 500,
  },
  {
    id: 202,
    title: '唐诗鉴赏专题讲座',
    instructor: '李清华',
    date: '2023-10-28',
    time: '15:00-16:30',
    cover: 'images/courses/tangshi_live.png',
    enrolled: 289,
    capacity: 400,
  },
  {
    id: 203,
    title: '国学与家庭教育',
    instructor: '张明德',
    date: '2023-11-01',
    time: '20:00-21:30',
    cover: 'images/courses/family_live.png',
    enrolled: 412,
    capacity: 600,
  },
  {
    id: 204,
    title: '《论语》与现代人生',
    instructor: '王立国',
    date: '2023-11-05',
    time: '19:00-20:30',
    cover: 'images/courses/lunyu_live.png',
    enrolled: 278,
    capacity: 500,
  },
])

// 课程详情视图
const showCourseDetail = ref(false)
const currentCourse = ref<{
  id: number
  title: string
  cover: string
  instructor: string
  instructorTitle: string
  instructorAvatar: string
  duration: string
  rating: number
  students: number
  price: number
  category: string
  tags: string[]
  description: string
  chapters: { title: string; duration: string }[]
} | null>(null)

// 显示课程详情
const viewCourseDetail = (courseId: number) => {
  const course = courses.value.find((c) => c.id === courseId)
  if (course) {
    currentCourse.value = course
    showCourseDetail.value = true
    // 在实际应用中，这里可能会导航到课程详情页
    // router.push(`/course/${courseId}`)
  }
}

// 关闭课程详情
const closeCourseDetail = () => {
  showCourseDetail.value = false
  currentCourse.value = null
}

// 报名直播课程
const enrollLiveCourse = (courseId: number) => {
  const course = liveCourses.value.find((c) => c.id === courseId)
  if (course && course.enrolled < course.capacity) {
    course.enrolled++
    alert(`成功报名《${course.title}》直播课程！`)
  } else {
    alert('很抱歉，该课程名额已满')
  }
}

// 页面加载时启动轮播
onMounted(() => {
  startBannerInterval()
})

// 页面卸载时清除定时器
onBeforeUnmount(() => {
  if (bannerInterval) {
    clearInterval(bannerInterval)
  }
})
</script>

<template>
  <div class="courses-view">
    <!-- 顶部轮播展示 -->
    <section class="banner-section">
      <div class="banner-container">
        <div
          class="banner-slides"
          :style="{ transform: `translateX(-${currentBannerIndex * 100}%)` }"
        >
          <div v-for="banner in banners" :key="banner.id" class="banner-slide">
            <img :src="banner.image" :alt="banner.title" class="banner-image" />
            <div class="banner-content">
              <h2 class="banner-title">{{ banner.title }}</h2>
              <p class="banner-subtitle">{{ banner.subtitle }}</p>
              <button
                class="banner-btn"
                @click="viewCourseDetail(Number(banner.link.split('/').pop()))"
              >
                了解详情
              </button>
            </div>
          </div>
        </div>
        <button class="banner-arrow banner-prev" @click="prevBanner">
          <span>&lt;</span>
        </button>
        <button class="banner-arrow banner-next" @click="nextBanner">
          <span>&gt;</span>
        </button>
        <div class="banner-dots">
          <span
            v-for="(banner, index) in banners"
            :key="banner.id"
            :class="['banner-dot', { active: index === currentBannerIndex }]"
            @click="currentBannerIndex = index"
          ></span>
        </div>
      </div>
    </section>

    <!-- 课程分类导航 -->
    <section class="categories-section">
      <div class="categories-container">
        <button
          v-for="category in categories"
          :key="category.id"
          :class="['category-btn', { active: currentCategory === category.id }]"
          @click="currentCategory = category.id"
        >
          {{ category.name }}
        </button>
      </div>
    </section>

    <!-- 课程列表 -->
    <section class="courses-section">
      <h2 class="section-title">精品课程</h2>
      <div class="courses-grid">
        <div
          v-for="course in filteredCourses"
          :key="course.id"
          class="course-card"
          @click="viewCourseDetail(course.id)"
        >
          <div class="course-cover">
            <img :src="course.cover" :alt="course.title" />
            <div class="course-duration">{{ course.duration }}</div>
          </div>
          <div class="course-info">
            <h3 class="course-title">{{ course.title }}</h3>
            <div class="course-instructor">
              <img
                :src="course.instructorAvatar"
                :alt="course.instructor"
                class="instructor-avatar"
              />
              <span>{{ course.instructor }}</span>
            </div>
            <div class="course-meta">
              <div class="course-rating">
                <span class="rating-stars">
                  <span
                    class="stars-filled"
                    :style="{ width: (course.rating / 5) * 100 + '%' }"
                  ></span>
                </span>
                <span class="rating-value">{{ course.rating }}</span>
              </div>
              <div class="course-students">{{ course.students }}人学习</div>
            </div>
            <div class="course-tags">
              <span v-for="(tag, index) in course.tags" :key="index" class="course-tag">{{
                tag
              }}</span>
            </div>
            <div class="course-price">¥{{ course.price }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 学习路径推荐 -->
    <section class="learning-paths-section">
      <h2 class="section-title">学习路径推荐</h2>
      <div class="paths-container">
        <div v-for="path in learningPaths" :key="path.id" class="path-card">
          <h3 class="path-title">{{ path.title }}</h3>
          <p class="path-description">{{ path.description }}</p>
          <div class="path-courses">
            <div v-for="(course, index) in path.courses" :key="course.id" class="path-course-item">
              <div class="path-course-number">{{ index + 1 }}</div>
              <div class="path-course-info">
                <div class="path-course-title">{{ course.title }}</div>
                <div class="path-course-level">{{ course.level }}</div>
              </div>
              <div class="path-arrow"></div>
            </div>
          </div>
          <button class="path-btn">开始学习</button>
        </div>
      </div>
    </section>

    <!-- 直播课程日历 -->
    <section class="live-courses-section">
      <h2 class="section-title">直播课程日历</h2>
      <div class="live-courses-grid">
        <div v-for="course in liveCourses" :key="course.id" class="live-course-card">
          <div class="live-course-cover">
            <img :src="course.cover" :alt="course.title" />
            <div class="live-badge">直播</div>
          </div>
          <div class="live-course-info">
            <h3 class="live-course-title">{{ course.title }}</h3>
            <div class="live-course-instructor">主讲：{{ course.instructor }}</div>
            <div class="live-course-time">
              <div class="live-date">{{ course.date }}</div>
              <div class="live-time">{{ course.time }}</div>
            </div>
            <div class="live-course-enrollment">
              <div class="enrollment-progress">
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: (course.enrolled / course.capacity) * 100 + '%' }"
                  ></div>
                </div>
                <div class="enrollment-text">{{ course.enrolled }}/{{ course.capacity }}</div>
              </div>
              <button
                class="enroll-btn"
                :disabled="course.enrolled >= course.capacity"
                @click.stop="enrollLiveCourse(course.id)"
              >
                {{ course.enrolled >= course.capacity ? '已满' : '报名' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 课程详情弹窗 -->
    <div v-if="showCourseDetail && currentCourse" class="course-detail-modal">
      <div class="modal-overlay" @click="closeCourseDetail"></div>
      <div class="modal-content">
        <button class="modal-close" @click="closeCourseDetail">&times;</button>

        <!-- 课程详情头部 -->
        <div class="detail-header">
          <div class="detail-cover">
            <img :src="currentCourse.cover" :alt="currentCourse.title" />
          </div>
          <div class="detail-info">
            <h2 class="detail-title">{{ currentCourse.title }}</h2>
            <div class="detail-meta">
              <div class="detail-rating">
                <span class="rating-stars">
                  <span
                    class="stars-filled"
                    :style="{ width: (currentCourse.rating / 5) * 100 + '%' }"
                  ></span>
                </span>
                <span class="rating-value">{{ currentCourse.rating }}</span>
              </div>
              <div class="detail-students">{{ currentCourse.students }}人学习</div>
              <div class="detail-duration">总时长：{{ currentCourse.duration }}</div>
            </div>
            <div class="detail-description">{{ currentCourse.description }}</div>
            <div class="detail-tags">
              <span v-for="(tag, index) in currentCourse.tags" :key="index" class="detail-tag">{{
                tag
              }}</span>
            </div>
            <div class="detail-price">¥{{ currentCourse.price }}</div>
            <button class="enroll-course-btn">立即报名</button>
          </div>
        </div>

        <!-- 课程章节 -->
        <div class="detail-chapters">
          <h3 class="chapters-title">课程章节</h3>
          <div class="chapters-list">
            <div
              v-for="(chapter, index) in currentCourse.chapters"
              :key="index"
              class="chapter-item"
            >
              <div class="chapter-number">{{ index + 1 }}</div>
              <div class="chapter-info">
                <div class="chapter-title">{{ chapter.title }}</div>
                <div class="chapter-duration">{{ chapter.duration }}</div>
              </div>
              <button class="play-btn">播放</button>
            </div>
          </div>
        </div>

        <!-- 讲师介绍 -->
        <div class="detail-instructor">
          <h3 class="instructor-section-title">讲师介绍</h3>
          <div class="instructor-profile">
            <img
              :src="currentCourse.instructorAvatar"
              :alt="currentCourse.instructor"
              class="instructor-detail-avatar"
            />
            <div class="instructor-detail-info">
              <div class="instructor-name">{{ currentCourse.instructor }}</div>
              <div class="instructor-title">{{ currentCourse.instructorTitle }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 视频播放页面设计 -->
    <div v-if="false" class="video-player-page">
      <div class="video-container">
        <div class="video-player">
          <!-- 实际项目中这里会是视频播放器 -->
          <div class="video-placeholder">视频播放区域</div>
          <div class="video-controls">
            <button class="play-control">播放/暂停</button>
            <div class="progress-control">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 35%"></div>
              </div>
              <div class="time-display">15:30 / 45:00</div>
            </div>
            <button class="fullscreen-control">全屏</button>
          </div>
        </div>

        <div class="video-sidebar">
          <div class="video-tabs">
            <button class="tab-btn active">章节</button>
            <button class="tab-btn">笔记</button>
            <button class="tab-btn">问答</button>
          </div>

          <div class="tab-content">
            <!-- 章节列表 -->
            <div class="chapters-panel">
              <div class="video-chapter-item active">
                <div class="chapter-number">1</div>
                <div class="chapter-info">
                  <div class="chapter-title">绪论：《论语》的成书与流传</div>
                  <div class="chapter-duration">45分钟</div>
                </div>
                <div class="chapter-status">播放中</div>
              </div>
              <!-- 更多章节... -->
            </div>

            <!-- 笔记工具 -->
            <div class="notes-panel" style="display: none">
              <div class="note-editor">
                <textarea placeholder="记录您的学习笔记..." class="note-textarea"></textarea>
                <div class="note-toolbar">
                  <button class="note-btn">添加截图</button>
                  <button class="note-btn">保存笔记</button>
                </div>
              </div>
              <div class="notes-list">
                <div class="note-item">
                  <div class="note-time">15:30</div>
                  <div class="note-content">孔子"学而时习之"的教育思想强调学习与实践的结合...</div>
                </div>
                <!-- 更多笔记... -->
              </div>
            </div>

            <!-- 问答区 -->
            <div class="qa-panel" style="display: none">
              <div class="question-form">
                <textarea placeholder="有什么问题想问讲师？" class="question-textarea"></textarea>
                <button class="submit-question-btn">提交问题</button>
              </div>
              <div class="questions-list">
                <div class="question-item">
                  <div class="question-user">
                    <img src="/images/avatars/user1.png" alt="用户头像" class="question-avatar" />
                    <span>学习者</span>
                  </div>
                  <div class="question-content">请问老师，《论语》中"君子"的概念是如何演变的？</div>
                  <div class="question-answer">
                    <div class="answer-user">
                      <img
                        src="/images/instructors/wang.png"
                        alt="讲师头像"
                        class="answer-avatar"
                      />
                      <span>王立国 讲师</span>
                    </div>
                    <div class="answer-content">
                      "君子"在先秦时期原本是贵族的代称，孔子赋予了其道德内涵，将其提升为一种人格理想...
                    </div>
                  </div>
                </div>
                <!-- 更多问答... -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 全局样式 */
.courses-view {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: '楷体', 'KaiTi', serif;
  color: #333;
}

.section-title {
  font-size: 1.8rem;
  color: #8a1e1e;
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0e6dc;
  text-align: center;
}

/* 轮播图样式 */
.banner-section {
  margin-bottom: 40px;
}

.banner-container {
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.banner-slides {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease;
}

.banner-slide {
  flex: 0 0 100%;
  position: relative;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-content {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 30px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
}

.banner-title {
  font-size: 2.2rem;
  margin-bottom: 10px;
  font-weight: bold;
}

.banner-subtitle {
  font-size: 1.2rem;
  margin-bottom: 20px;
  opacity: 0.9;
}

.banner-btn {
  padding: 10px 20px;
  background-color: #8a1e1e;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.banner-btn:hover {
  background-color: #6b1717;
}

.banner-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 10;
  transition: background-color 0.3s ease;
}

.banner-arrow:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.banner-prev {
  left: 20px;
}

.banner-next {
  right: 20px;
}

.banner-dots {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}

.banner-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.banner-dot.active {
  background-color: #8a1e1e;
}

/* 课程分类导航 */
.categories-section {
  margin-bottom: 40px;
}

.categories-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
}

.category-btn {
  padding: 10px 20px;
  background-color: #f0e6dc;
  color: #333;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-btn:hover {
  background-color: #e0d6cc;
}

.category-btn.active {
  background-color: #8a1e1e;
  color: white;
}

/* 课程列表 */
.courses-section {
  margin-bottom: 50px;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.course-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.course-cover {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.course-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.course-card:hover .course-cover img {
  transform: scale(1.05);
}

.course-duration {
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 5px 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 15px;
  font-size: 0.8rem;
}

.course-info {
  padding: 15px;
}

.course-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
  height: 2.8em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.course-instructor {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.instructor-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.course-rating {
  display: flex;
  align-items: center;
  gap: 5px;
}

.rating-stars {
  position: relative;
  width: 80px;
  height: 16px;
  background-image: url('images/icons/stars-empty.svg');
  background-size: contain;
  background-repeat: no-repeat;
}

.stars-filled {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-image: url('images/icons/stars-filled.svg');
  background-size: cover;
  background-repeat: no-repeat;
}

.rating-value {
  font-size: 0.9rem;
  font-weight: bold;
  color: #f39c12;
}

.course-students {
  font-size: 0.9rem;
  color: #666;
}

.course-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
}

.course-tag {
  padding: 3px 8px;
  background-color: #f0e6dc;
  border-radius: 15px;
  font-size: 0.8rem;
  color: #666;
}

.course-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #8a1e1e;
}

/* 学习路径推荐 */
.learning-paths-section {
  margin-bottom: 50px;
}

.paths-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
}

.path-card {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.path-title {
  font-size: 1.4rem;
  margin-bottom: 10px;
  color: #8a1e1e;
}

.path-description {
  font-size: 1rem;
  color: #666;
  margin-bottom: 20px;
}

.path-courses {
  margin-bottom: 20px;
}

.path-course-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 5px;
  background-color: #f9f5f2;
  margin-bottom: 10px;
  position: relative;
}

.path-course-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #8a1e1e;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 15px;
}

.path-course-info {
  flex: 1;
}

.path-course-title {
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.path-course-level {
  font-size: 0.9rem;
  color: #666;
}

.path-arrow {
  position: absolute;
  bottom: -15px;
  left: 30px;
  width: 2px;
  height: 20px;
  background-color: #8a1e1e;
  z-index: 1;
}

.path-arrow::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: -4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #8a1e1e;
}

.path-btn {
  width: 100%;
  padding: 10px;
  background-color: #8a1e1e;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.path-btn:hover {
  background-color: #6b1717;
}

/* 直播课程日历 */
.live-courses-section {
  margin-bottom: 50px;
}

.live-courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.live-course-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.live-course-card:hover {
  transform: translateY(-5px);
}

.live-course-cover {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.live-course-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.live-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  background-color: #e74c3c;
  color: white;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
}

.live-course-info {
  padding: 15px;
}

.live-course-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
}

.live-course-instructor {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
}

.live-course-time {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.live-date {
  color: #8a1e1e;
  font-weight: bold;
}

.live-time {
  color: #666;
}

.live-course-enrollment {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.enrollment-progress {
  flex: 1;
  margin-right: 15px;
}

.progress-bar {
  height: 6px;
  background-color: #f0e6dc;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 5px;
}

.progress-fill {
  height: 100%;
  background-color: #8a1e1e;
}

.enrollment-text {
  font-size: 0.8rem;
  color: #666;
  text-align: right;
}

.enroll-btn {
  padding: 8px 15px;
  background-color: #8a1e1e;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.enroll-btn:hover {
  background-color: #6b1717;
}

.enroll-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 课程详情弹窗 */
.course-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  overflow-y: auto;
  z-index: 1001;
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 30px;
  height: 30px;
  background-color: #f0e6dc;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  line-height: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-close:hover {
  background-color: #e0d6cc;
}

.detail-header {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.detail-cover {
  width: 300px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.detail-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-info {
  flex: 1;
}

.detail-title {
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: #333;
}

.detail-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.detail-rating,
.detail-students,
.detail-duration {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: #666;
}

.detail-description {
  margin-bottom: 15px;
  line-height: 1.6;
  color: #555;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.detail-tag {
  padding: 5px 10px;
  background-color: #f0e6dc;
  border-radius: 15px;
  font-size: 0.9rem;
  color: #666;
}

.detail-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #8a1e1e;
  margin-bottom: 15px;
}

.enroll-course-btn {
  padding: 10px 20px;
  background-color: #8a1e1e;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.enroll-course-btn:hover {
  background-color: #6b1717;
}

.detail-chapters {
  margin-bottom: 30px;
}

.chapters-title {
  font-size: 1.4rem;
  margin-bottom: 15px;
  color: #8a1e1e;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0e6dc;
}

.chapter-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #f9f5f2;
  border-radius: 5px;
  margin-bottom: 10px;
}

.chapter-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #8a1e1e;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 15px;
}

.chapter-info {
  flex: 1;
}

.chapter-title {
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.chapter-duration {
  font-size: 0.9rem;
  color: #666;
}

.play-btn {
  padding: 5px 15px;
  background-color: #8a1e1e;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
}

.detail-instructor {
  margin-bottom: 30px;
}

.instructor-section-title {
  font-size: 1.4rem;
  margin-bottom: 15px;
  color: #8a1e1e;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0e6dc;
}

.instructor-profile {
  display: flex;
  align-items: center;
  gap: 20px;
}

.instructor-detail-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.instructor-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.instructor-title {
  font-size: 1rem;
  color: #666;
}

/* 视频播放页面 */
.video-player-page {
  margin-top: 50px;
}

.video-container {
  display: flex;
  gap: 30px;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.video-player {
  flex: 1;
}

.video-placeholder {
  height: 500px;
  background-color: #333;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
}

.video-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background-color: #f9f5f2;
}

.play-control,
.fullscreen-control {
  padding: 8px 15px;
  background-color: #8a1e1e;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.progress-control {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.time-display {
  font-size: 0.9rem;
  color: #666;
  text-align: right;
  margin-top: 5px;
}

.video-sidebar {
  width: 300px;
  background-color: #f9f5f2;
}

.video-tabs {
  display: flex;
  border-bottom: 1px solid #e0d6cc;
}

.tab-btn {
  flex: 1;
  padding: 15px;
  background-color: transparent;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.tab-btn.active {
  background-color: #f0e6dc;
  font-weight: bold;
  color: #8a1e1e;
}

.tab-content {
  height: 500px;
  overflow-y: auto;
}

.chapters-panel,
.notes-panel,
.qa-panel {
  padding: 15px;
}

.video-chapter-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: white;
  border-radius: 5px;
  margin-bottom: 10px;
}

.video-chapter-item.active {
  border-left: 4px solid #8a1e1e;
}

.chapter-status {
  padding: 3px 8px;
  background-color: #8a1e1e;
  color: white;
  border-radius: 15px;
  font-size: 0.8rem;
}

.note-editor {
  margin-bottom: 20px;
}

.note-textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
  margin-bottom: 10px;
}

.note-toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.note-btn {
  padding: 5px 10px;
  background-color: #8a1e1e;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.note-item {
  padding: 15px;
  background-color: white;
  border-radius: 5px;
}

.note-time {
  font-size: 0.8rem;
  color: #8a1e1e;
  margin-bottom: 5px;
}

.note-content {
  font-size: 0.9rem;
  color: #555;
}

.question-form {
  margin-bottom: 20px;
}

.question-textarea {
  width: 100%;
  height: 80px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
  margin-bottom: 10px;
}

.submit-question-btn {
  padding: 8px 15px;
  background-color: #8a1e1e;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  float: right;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.question-item {
  padding: 15px;
  background-color: white;
  border-radius: 5px;
}

.question-user,
.answer-user {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.question-avatar,
.answer-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.question-content {
  font-size: 1rem;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0e6dc;
}

.question-answer {
  background-color: #f9f5f2;
  padding: 15px;
  border-radius: 5px;
}

.answer-content {
  font-size: 0.9rem;
  color: #555;
}

/* 响应式设计 */
@media (max-width: 900px) {
  .banner-container {
    height: 300px;
  }

  .banner-title {
    font-size: 1.8rem;
  }

  .detail-header {
    flex-direction: column;
  }

  .detail-cover {
    width: 100%;
    height: 200px;
  }

  .video-container {
    flex-direction: column;
  }

  .video-sidebar {
    width: 100%;
  }

  .paths-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .banner-container {
    height: 200px;
  }

  .banner-title {
    font-size: 1.5rem;
  }

  .banner-subtitle {
    font-size: 1rem;
  }

  .courses-grid,
  .live-courses-grid {
    grid-template-columns: 1fr;
  }

  .category-btn {
    font-size: 0.9rem;
    padding: 8px 15px;
  }
}
</style>
