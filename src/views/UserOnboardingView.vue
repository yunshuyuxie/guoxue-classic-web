<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 当前步骤
const currentStep = ref(1)
// 总步骤数
const totalSteps = 4

// 定义类型
interface UserSelections {
  role: string
  interests: string[]
  level: string
  recommendedBooks: number[]
  recommendedCourses: number[]
}

// 用户选择数据
const userSelections = reactive<UserSelections>({
  role: '',
  interests: [],
  level: '',
  recommendedBooks: [],
  recommendedCourses: [],
})

// 角色选项
const roleOptions = [
  { value: 'student', label: '学生', icon: '📚', description: '系统学习国学基础知识' },
  { value: 'teacher', label: '教师', icon: '🧑‍🏫', description: '获取教学资源与教案' },
  { value: 'enthusiast', label: '文化爱好者', icon: '🏮', description: '探索中华文化精髓' },
  { value: 'researcher', label: '研究者', icon: '🔍', description: '深入研究经典著作' },
  { value: 'parent', label: '家长', icon: '👨‍👩‍👧‍👦', description: '为孩子寻找国学启蒙材料' },
]

// 兴趣分类
const interestCategories = [
  {
    name: '经典著作',
    options: [
      { value: 'four-books', label: '四书', selected: false },
      { value: 'five-classics', label: '五经', selected: false },
      { value: 'zhuzi', label: '诸子百家', selected: false },
      { value: 'histories', label: '史书', selected: false },
    ],
  },
  {
    name: '文学艺术',
    options: [
      { value: 'poetry', label: '诗词歌赋', selected: false },
      { value: 'novels', label: '古典小说', selected: false },
      { value: 'calligraphy', label: '书法', selected: false },
      { value: 'painting', label: '国画', selected: false },
    ],
  },
  {
    name: '思想流派',
    options: [
      { value: 'confucianism', label: '儒家', selected: false },
      { value: 'taoism', label: '道家', selected: false },
      { value: 'buddhism', label: '佛学', selected: false },
      { value: 'legalism', label: '法家', selected: false },
    ],
  },
  {
    name: '应用国学',
    options: [
      { value: 'medicine', label: '中医典籍', selected: false },
      { value: 'strategy', label: '兵法谋略', selected: false },
      { value: 'divination', label: '易经预测', selected: false },
      { value: 'life-wisdom', label: '生活智慧', selected: false },
    ],
  },
]

// 学习水平选项
const levelOptions = [
  { value: 'beginner', label: '初学者', description: '刚接触国学，希望从基础开始' },
  { value: 'intermediate', label: '进阶者', description: '已有一定基础，想深入学习' },
  { value: 'advanced', label: '资深爱好者', description: '熟悉经典著作，寻求更深层次理解' },
]

// 推荐书籍
const recommendedBooks = computed(() => {
  // 基于用户角色和兴趣生成推荐
  const books = [
    {
      id: 1,
      title: '论语译注',
      author: '杨伯峻',
      cover: 'images/books/lunyu.png',
      tags: ['confucianism', 'four-books', 'beginner'],
    },
    {
      id: 2,
      title: '老子今注今译',
      author: '陈鼓应',
      cover: 'images/books/laozi.png',
      tags: ['taoism', 'zhuzi', 'beginner'],
    },
    {
      id: 3,
      title: '史记(精装本)',
      author: '司马迁',
      cover: 'images/books/shiji.png',
      tags: ['histories', 'intermediate'],
    },
    {
      id: 4,
      title: '唐诗三百首详析',
      author: '喻守真',
      cover: 'images/books/tangshi.png',
      tags: ['poetry', 'beginner'],
    },
    {
      id: 5,
      title: '孟子译注',
      author: '杨伯峻',
      cover: 'images/books/mengzi.png',
      tags: ['confucianism', 'four-books', 'intermediate'],
    },
    {
      id: 6,
      title: '庄子今注今译',
      author: '陈鼓应',
      cover: 'images/books/zhuangzi.png',
      tags: ['taoism', 'zhuzi', 'advanced'],
    },
    {
      id: 7,
      title: '红楼梦(校注本)',
      author: '曹雪芹',
      cover: 'images/books/hongloumeng.png',
      tags: ['novels', 'intermediate'],
    },
    {
      id: 8,
      title: '孙子兵法译注',
      author: '曹操等',
      cover: 'images/books/sunzi.png',
      tags: ['strategy', 'intermediate'],
    },
  ]

  // 根据用户兴趣和水平筛选
  let filtered = books

  if (userSelections.interests.length > 0) {
    filtered = filtered.filter((book) =>
      book.tags.some((tag) => userSelections.interests.includes(tag)),
    )
  }

  if (userSelections.level) {
    filtered = filtered.filter((book) => book.tags.includes(userSelections.level))
  }

  // 如果筛选后没有结果，返回默认推荐
  if (filtered.length === 0) {
    return books.slice(0, 4)
  }

  return filtered.slice(0, 4)
})

// 推荐课程
const recommendedCourses = computed(() => {
  // 基于用户角色和兴趣生成推荐
  const courses = [
    {
      id: 1,
      title: '论语导读',
      instructor: '王教授',
      cover: 'images/courses/lunyu-course.png',
      tags: ['confucianism', 'four-books', 'beginner', 'teacher'],
    },
    {
      id: 2,
      title: '诗词鉴赏入门',
      instructor: '李教授',
      cover: 'images/courses/poetry-course.png',
      tags: ['poetry', 'beginner', 'enthusiast'],
    },
    {
      id: 3,
      title: '易经与现代生活',
      instructor: '张教授',
      cover: 'images/courses/yijing-course.png',
      tags: ['divination', 'intermediate', 'enthusiast'],
    },
    {
      id: 4,
      title: '国学与教育',
      instructor: '刘教授',
      cover: 'images/courses/education-course.png',
      tags: ['teacher', 'parent'],
    },
    {
      id: 5,
      title: '道家思想专题研究',
      instructor: '陈教授',
      cover: 'images/courses/taoism-course.png',
      tags: ['taoism', 'advanced', 'researcher'],
    },
    {
      id: 6,
      title: '儿童国学启蒙',
      instructor: '赵老师',
      cover: 'images/courses/children-course.png',
      tags: ['parent', 'beginner'],
    },
  ]

  // 根据用户角色、兴趣和水平筛选
  let filtered = courses

  if (userSelections.role) {
    filtered = filtered.filter((course) => course.tags.includes(userSelections.role))
  }

  if (userSelections.interests.length > 0) {
    filtered = filtered.filter((course) =>
      course.tags.some((tag) => userSelections.interests.includes(tag)),
    )
  }

  if (userSelections.level) {
    filtered = filtered.filter((course) => course.tags.includes(userSelections.level))
  }

  // 如果筛选后没有结果，返回默认推荐
  if (filtered.length === 0) {
    return courses.slice(0, 3)
  }

  return filtered.slice(0, 3)
})

// 选择角色
const selectRole = (role: string) => {
  userSelections.role = role
}

// 选择兴趣
const toggleInterest = (interest: string) => {
  const index = userSelections.interests.indexOf(interest)
  if (index === -1) {
    userSelections.interests.push(interest)
  } else {
    userSelections.interests.splice(index, 1)
  }
}

// 选择水平
const selectLevel = (level: string) => {
  userSelections.level = level
}

// 选择书籍
const toggleBook = (bookId: number) => {
  const index = userSelections.recommendedBooks.indexOf(bookId)
  if (index === -1) {
    userSelections.recommendedBooks.push(bookId)
  } else {
    userSelections.recommendedBooks.splice(index, 1)
  }
}

// 选择课程
const toggleCourse = (courseId: number) => {
  const index = userSelections.recommendedCourses.indexOf(courseId)
  if (index === -1) {
    userSelections.recommendedCourses.push(courseId)
  } else {
    userSelections.recommendedCourses.splice(index, 1)
  }
}

// 下一步
const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  } else {
    // 完成引导流程
    completeOnboarding()
  }
}

// 上一步
const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// 完成引导流程
const completeOnboarding = () => {
  // 保存用户选择到本地存储或发送到服务器
  localStorage.setItem('userOnboardingCompleted', 'true')
  localStorage.setItem('userSelections', JSON.stringify(userSelections))

  // 跳转到首页
  router.push('/home')
}

// 跳过引导流程
const skipOnboarding = () => {
  if (confirm('确定要跳过个性化设置吗？您可以稍后在个人设置中完成。')) {
    localStorage.setItem('userOnboardingCompleted', 'true')
    router.push('/home')
  }
}

// 计算当前进度百分比
const progressPercentage = computed(() => {
  return ((currentStep.value - 1) / (totalSteps - 1)) * 100
})
</script>

<template>
  <div class="onboarding-container">
    <div class="onboarding-header">
      <h1>开启您的国学之旅</h1>
      <button class="skip-button" @click="skipOnboarding">跳过</button>
    </div>

    <!-- 进度条 -->
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
    </div>

    <div class="steps-indicator">
      <span>{{ currentStep }} / {{ totalSteps }}</span>
    </div>

    <!-- 步骤内容 -->
    <div class="step-content">
      <!-- 步骤1: 选择角色 -->
      <div v-if="currentStep === 1" class="step-container">
        <h2>您是以什么身份学习国学？</h2>
        <p class="step-description">选择您的角色，我们将为您提供更符合需求的内容</p>

        <div class="role-options">
          <div
            v-for="role in roleOptions"
            :key="role.value"
            class="role-card"
            :class="{ selected: userSelections.role === role.value }"
            @click="selectRole(role.value)"
          >
            <div class="role-icon">{{ role.icon }}</div>
            <h3>{{ role.label }}</h3>
            <p>{{ role.description }}</p>
          </div>
        </div>
      </div>

      <!-- 步骤2: 选择兴趣 -->
      <div v-else-if="currentStep === 2" class="step-container">
        <h2>您对哪些国学领域感兴趣？</h2>
        <p class="step-description">选择您感兴趣的领域（可多选），帮助我们推荐合适的内容</p>

        <div class="interest-container">
          <div
            v-for="category in interestCategories"
            :key="category.name"
            class="interest-category"
          >
            <h3 class="category-title">{{ category.name }}</h3>
            <div class="interest-options">
              <div
                v-for="option in category.options"
                :key="option.value"
                class="interest-tag"
                :class="{ selected: userSelections.interests.includes(option.value) }"
                @click="toggleInterest(option.value)"
              >
                {{ option.label }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 步骤3: 选择水平 -->
      <div v-else-if="currentStep === 3" class="step-container">
        <h2>您的国学学习水平如何？</h2>
        <p class="step-description">告诉我们您的学习阶段，以便推荐适合的学习内容</p>

        <div class="level-options">
          <div
            v-for="level in levelOptions"
            :key="level.value"
            class="level-card"
            :class="{ selected: userSelections.level === level.value }"
            @click="selectLevel(level.value)"
          >
            <h3>{{ level.label }}</h3>
            <p>{{ level.description }}</p>
          </div>
        </div>
      </div>

      <!-- 步骤4: 推荐内容 -->
      <div v-else class="step-container">
        <h2>为您推荐的学习内容</h2>
        <p class="step-description">根据您的选择，我们为您精选了以下内容，点击添加到您的收藏</p>

        <div class="recommendations">
          <div class="recommendation-section">
            <h3>推荐书籍</h3>
            <div class="books-grid">
              <div
                v-for="book in recommendedBooks"
                :key="book.id"
                class="book-card"
                :class="{ selected: userSelections.recommendedBooks.includes(book.id) }"
                @click="toggleBook(book.id)"
              >
                <div class="book-cover">
                  <img :src="book.cover" :alt="book.title" />
                  <div class="selection-mark">✓</div>
                </div>
                <h4>{{ book.title }}</h4>
                <p>{{ book.author }}</p>
              </div>
            </div>
          </div>

          <div class="recommendation-section">
            <h3>推荐课程</h3>
            <div class="courses-grid">
              <div
                v-for="course in recommendedCourses"
                :key="course.id"
                class="course-card"
                :class="{ selected: userSelections.recommendedCourses.includes(course.id) }"
                @click="toggleCourse(course.id)"
              >
                <div class="course-cover">
                  <img :src="course.cover" :alt="course.title" />
                  <div class="selection-mark">✓</div>
                </div>
                <h4>{{ course.title }}</h4>
                <p>{{ course.instructor }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 导航按钮 -->
    <div class="navigation-buttons">
      <button v-if="currentStep > 1" class="prev-button" @click="prevStep">上一步</button>
      <button class="next-button" @click="nextStep">
        {{ currentStep < totalSteps ? '下一步' : '开始学习' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.onboarding-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 30px 20px;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
}

.onboarding-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.onboarding-header h1 {
  font-size: 28px;
  color: #842029;
  margin: 0;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.skip-button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
}

.progress-bar {
  height: 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background-color: #842029;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.steps-indicator {
  text-align: right;
  color: #666;
  font-size: 14px;
  margin-bottom: 30px;
}

.step-content {
  flex: 1;
}

.step-container {
  animation: fadeIn 0.5s ease;
}

.step-container h2 {
  font-size: 24px;
  color: #333;
  margin: 0 0 10px;
  text-align: center;
}

.step-description {
  color: #666;
  text-align: center;
  margin-bottom: 30px;
}

/* 角色选择样式 */
.role-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.role-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.role-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.role-card.selected {
  border-color: #842029;
  background-color: #f8f0f1;
}

.role-icon {
  font-size: 36px;
  margin-bottom: 10px;
}

.role-card h3 {
  font-size: 18px;
  margin: 0 0 10px;
  color: #333;
}

.role-card p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 兴趣选择样式 */
.interest-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.interest-category {
  margin-bottom: 10px;
}

.category-title {
  font-size: 16px;
  color: #333;
  margin: 0 0 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}

.interest-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.interest-tag {
  background-color: white;
  border: 1px solid #ddd;
  color: #333;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.interest-tag:hover {
  border-color: #842029;
}

.interest-tag.selected {
  background-color: #842029;
  color: white;
  border-color: #842029;
}

/* 水平选择样式 */
.level-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.level-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.level-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.level-card.selected {
  border-color: #842029;
  background-color: #f8f0f1;
}

.level-card h3 {
  font-size: 18px;
  margin: 0 0 10px;
  color: #333;
}

.level-card p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 推荐内容样式 */
.recommendations {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.recommendation-section h3 {
  font-size: 18px;
  color: #333;
  margin: 0 0 15px;
}

.books-grid,
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.book-card,
.course-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.book-card:hover,
.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.book-cover,
.course-cover {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.book-cover img,
.course-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.selection-mark {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  background-color: #842029;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.book-card.selected .selection-mark,
.course-card.selected .selection-mark {
  opacity: 1;
}

.book-card h4,
.course-card h4 {
  font-size: 14px;
  margin: 10px 10px 5px;
  color: #333;
}

.book-card p,
.course-card p {
  font-size: 12px;
  color: #666;
  margin: 0 10px 10px;
}

/* 导航按钮 */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}

.prev-button,
.next-button {
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.prev-button {
  background-color: white;
  border: 1px solid #ddd;
  color: #666;
}

.prev-button:hover {
  background-color: #f8f9fa;
}

.next-button {
  background-color: #842029;
  border: none;
  color: white;
}

.next-button:hover {
  background-color: #6b1717;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .role-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .books-grid,
  .courses-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .onboarding-container {
    padding: 20px 15px;
  }

  .onboarding-header h1 {
    font-size: 22px;
  }

  .role-options {
    grid-template-columns: 1fr;
  }

  .books-grid,
  .courses-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .book-cover,
  .course-cover {
    height: 150px;
  }

  .navigation-buttons {
    flex-direction: column-reverse;
    gap: 10px;
  }

  .prev-button,
  .next-button {
    width: 100%;
  }
}
</style>
