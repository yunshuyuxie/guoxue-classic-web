<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 用户基本信息
const userInfo = ref({
  name: '文化传承者',
  avatar: 'images/avatars/user1.png',
  level: 5,
  joinDate: '2023-06-15',
})

// 学习数据
const learningStats = ref({
  totalTime: 128, // 小时
  booksRead: 12,
  notesCount: 36,
  completedWorks: 8,
  streakDays: 21,
})

// 学习日历数据 - 过去一年的学习记录
const currentDate = new Date()
const calendarData = ref<Array<{ date: string; value: number; formattedValue: string }>>([])

// 生成过去一年的学习记录数据
const generateCalendarData = () => {
  const data: Array<{ date: string; value: number; formattedValue: string }> = []
  const today = new Date()

  // 生成过去365天的数据
  for (let i = 0; i < 365; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)

    // 随机生成学习时间（0-3小时）
    const studyHours = Math.random() > 0.3 ? Math.random() * 3 : 0

    data.unshift({
      date: date.toISOString().split('T')[0],
      value: studyHours,
      formattedValue: studyHours.toFixed(1) + '小时',
    })
  }

  calendarData.value = data
}

// 获取热力图的CSS类
const getHeatmapClass = (value: number) => {
  if (value === 0) return 'heat-0'
  if (value <= 1) return 'heat-1'
  if (value <= 2) return 'heat-2'
  return 'heat-3'
}

// 获取指定月份的日历数据
const getMonthData = (month: number) => {
  const year = currentDate.getFullYear()
  const startDate = new Date(year, month, 1).toISOString().split('T')[0]
  const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]

  return calendarData.value.filter((item) => item.date >= startDate && item.date <= endDate)
}

// 计算当前月份的数据
const currentMonthData = computed(() => {
  return getMonthData(currentDate.getMonth())
})

// 收藏的书籍
const favoriteBooks = ref([
  {
    id: 1,
    title: '论语',
    author: '孔子及其弟子',
    cover: 'images/books/lunyu.png',
    progress: 75,
    lastRead: '2023-10-15',
  },
  {
    id: 2,
    title: '大学',
    author: '曾子',
    cover: 'images/books/daxue.png',
    progress: 90,
    lastRead: '2023-10-10',
  },
  {
    id: 3,
    title: '中庸',
    author: '子思',
    cover: 'images/books/zhongyong.png',
    progress: 60,
    lastRead: '2023-10-05',
  },
  {
    id: 4,
    title: '孟子',
    author: '孟子及其弟子',
    cover: 'images/books/mengzi.png',
    progress: 30,
    lastRead: '2023-09-28',
  },
  {
    id: 5,
    title: '道德经',
    author: '老子',
    cover: 'images/books/daodejing.png',
    progress: 45,
    lastRead: '2023-09-20',
  },
  {
    id: 6,
    title: '诗经',
    author: '先秦诗人',
    cover: 'images/books/shijing.png',
    progress: 25,
    lastRead: '2023-09-15',
  },
])

// 学习笔记分类
const noteCategories = ref([
  { id: 1, name: '经典导读', count: 12 },
  { id: 2, name: '心得体会', count: 8 },
  { id: 3, name: '读书笔记', count: 10 },
  { id: 4, name: '诗词赏析', count: 6 },
])

// 学习笔记列表
const notes = ref([
  {
    id: 1,
    title: '《论语》读书心得：君子之道',
    content: '读完《论语》第四章，对"君子坦荡荡，小人长戚戚"有了新的理解...',
    category: '读书笔记',
    createTime: '2023-10-15',
    tags: ['论语', '君子', '儒家思想'],
  },
  {
    id: 2,
    title: '孟子性善论探析',
    content: '孟子认为人性本善，这一思想对中国传统文化产生了深远影响...',
    category: '经典导读',
    createTime: '2023-10-12',
    tags: ['孟子', '性善论', '儒家思想'],
  },
  {
    id: 3,
    title: '《大学》中的修身齐家治国平天下',
    content: '《大学》开篇即点明"大学之道，在明明德，在亲民，在止于至善"...',
    category: '读书笔记',
    createTime: '2023-10-10',
    tags: ['大学', '修身', '儒家经典'],
  },
  {
    id: 4,
    title: '诗经中的爱情表达方式',
    content: '《诗经》中的爱情诗往往通过比兴手法，借物抒情，含蓄委婉...',
    category: '诗词赏析',
    createTime: '2023-10-08',
    tags: ['诗经', '爱情诗', '比兴手法'],
  },
  {
    id: 5,
    title: '读《道德经》有感',
    content: '老子的"无为而治"思想启发我们在现代社会中保持内心的平静...',
    category: '心得体会',
    createTime: '2023-10-05',
    tags: ['道德经', '老子', '道家思想'],
  },
])

// 当前选中的笔记分类
const selectedCategory = ref('全部')

// 根据分类筛选笔记
const filteredNotes = computed(() => {
  if (selectedCategory.value === '全部') {
    return notes.value
  }
  return notes.value.filter((note) => note.category === selectedCategory.value)
})

// 学习计划
const learningPlans = ref([
  {
    id: 1,
    title: '完成《论语》阅读',
    description: '每天阅读一章，做好读书笔记',
    startDate: '2023-10-01',
    endDate: '2023-11-30',
    progress: 45,
    reminder: '每天 20:00',
  },
  {
    id: 2,
    title: '背诵《大学》全文',
    description: '分段背诵，每周复习两次',
    startDate: '2023-10-15',
    endDate: '2023-12-15',
    progress: 30,
    reminder: '每天 08:00',
  },
  {
    id: 3,
    title: '《诗经》赏析学习',
    description: '每周学习5首诗，理解创作背景和艺术特色',
    startDate: '2023-09-01',
    endDate: '2023-12-31',
    progress: 60,
    reminder: '每周一、三、五 19:00',
  },
])

// 新建学习计划表单
const newPlan = ref({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  reminder: '',
})

// 是否显示新建计划表单
const showNewPlanForm = ref(false)

// 添加新计划
const addNewPlan = () => {
  if (!newPlan.value.title || !newPlan.value.startDate || !newPlan.value.endDate) {
    alert('请填写计划标题、开始日期和结束日期')
    return
  }

  const plan = {
    id: learningPlans.value.length + 1,
    title: newPlan.value.title,
    description: newPlan.value.description,
    startDate: newPlan.value.startDate,
    endDate: newPlan.value.endDate,
    progress: 0,
    reminder: newPlan.value.reminder,
  }

  learningPlans.value.push(plan)

  // 重置表单
  newPlan.value = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    reminder: '',
  }

  showNewPlanForm.value = false
}

// 成就徽章
const achievements = ref([
  {
    id: 1,
    name: '学习先锋',
    icon: 'images/badges/pioneer.png',
    description: '连续学习21天',
    unlocked: true,
    unlockDate: '2023-09-30',
  },
  {
    id: 2,
    name: '经典阅读者',
    icon: 'images/badges/reader.png',
    description: '完成10本经典著作阅读',
    unlocked: true,
    unlockDate: '2023-10-05',
  },
  {
    id: 3,
    name: '勤奋笔记家',
    icon: 'images/badges/note.png',
    description: '撰写30篇学习笔记',
    unlocked: true,
    unlockDate: '2023-10-10',
  },
  {
    id: 4,
    name: '诗词大师',
    icon: 'images/badges/poetry.png',
    description: '背诵50首古诗词',
    unlocked: false,
    progress: 35,
    total: 50,
  },
  {
    id: 5,
    name: '国学通',
    icon: 'images/badges/scholar.png',
    description: '完成四书五经全部学习',
    unlocked: false,
    progress: 3,
    total: 9,
  },
  {
    id: 6,
    name: '百日不辍',
    icon: 'images/badges/persistence.png',
    description: '连续学习100天',
    unlocked: false,
    progress: 21,
    total: 100,
  },
])

// 学习记录时间线
const learningHistory = ref([
  {
    id: 1,
    type: 'read',
    title: '阅读《论语》第七章',
    description: '学而篇：温故而知新，可以为师矣',
    time: '2023-10-15 20:30',
    duration: 45,
  },
  {
    id: 2,
    type: 'note',
    title: '创建笔记《论语》读书心得：君子之道',
    description: '记录了对君子坦荡荡，小人长戚戚的理解',
    time: '2023-10-15 21:15',
    duration: 30,
  },
  {
    id: 3,
    type: 'achievement',
    title: '获得成就：勤奋笔记家',
    description: '恭喜你撰写了30篇学习笔记！',
    time: '2023-10-10 18:45',
  },
  {
    id: 4,
    type: 'read',
    title: '阅读《大学》导论',
    description: '大学之道，在明明德，在亲民，在止于至善',
    time: '2023-10-10 15:20',
    duration: 60,
  },
  {
    id: 5,
    type: 'plan',
    title: '创建学习计划：背诵《大学》全文',
    description: '计划于12月15日前完成',
    time: '2023-10-09 09:15',
  },
  {
    id: 6,
    type: 'read',
    title: '阅读《诗经》国风·周南',
    description: '关雎、葛覃、卷耳等篇',
    time: '2023-10-08 16:40',
    duration: 50,
  },
  {
    id: 7,
    type: 'note',
    title: '创建笔记：诗经中的爱情表达方式',
    description: '分析了比兴手法在爱情诗中的运用',
    time: '2023-10-08 17:30',
    duration: 40,
  },
])

// 初始化
onMounted(() => {
  generateCalendarData()
})
</script>

<template>
  <div class="learning-center">
    <!-- 顶部用户信息 -->
    <div class="user-profile-header">
      <div class="user-info">
        <img :src="userInfo.avatar" :alt="userInfo.name" class="user-avatar" />
        <div class="user-details">
          <h2 class="user-name">{{ userInfo.name }}</h2>
          <div class="user-level">
            学习等级：<span>{{ userInfo.level }}</span>
          </div>
          <div class="user-join-date">加入时间：{{ userInfo.joinDate }}</div>
        </div>
      </div>
    </div>

    <!-- 学习数据仪表盘 -->
    <section class="dashboard-section">
      <h2 class="section-title">学习数据仪表盘</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon time-icon"></div>
          <div class="stat-data">
            <div class="stat-value">{{ learningStats.totalTime }}</div>
            <div class="stat-label">累计学习时间(小时)</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon book-icon"></div>
          <div class="stat-data">
            <div class="stat-value">{{ learningStats.booksRead }}</div>
            <div class="stat-label">已阅读书籍</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon note-icon"></div>
          <div class="stat-data">
            <div class="stat-value">{{ learningStats.notesCount }}</div>
            <div class="stat-label">学习笔记数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon work-icon"></div>
          <div class="stat-data">
            <div class="stat-value">{{ learningStats.completedWorks }}</div>
            <div class="stat-label">完成作品数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon streak-icon"></div>
          <div class="stat-data">
            <div class="stat-value">{{ learningStats.streakDays }}</div>
            <div class="stat-label">连续学习天数</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 学习日历热力图 -->
    <section class="calendar-section">
      <h2 class="section-title">学习日历</h2>
      <div class="calendar-heatmap">
        <div class="calendar-months">
          <div
            v-for="(month, index) in [
              '一月',
              '二月',
              '三月',
              '四月',
              '五月',
              '六月',
              '七月',
              '八月',
              '九月',
              '十月',
              '十一月',
              '十二月',
            ]"
            :key="index"
            class="calendar-month-label"
          >
            {{ month }}
          </div>
        </div>
        <div class="calendar-grid">
          <div
            v-for="(item, index) in calendarData"
            :key="index"
            class="calendar-day"
            :class="getHeatmapClass(item.value)"
            :title="`${item.date}: ${item.formattedValue}`"
          ></div>
        </div>
        <div class="calendar-legend">
          <div class="legend-label">学习时间：</div>
          <div class="legend-item">
            <div class="legend-color heat-0"></div>
            <div>0小时</div>
          </div>
          <div class="legend-item">
            <div class="legend-color heat-1"></div>
            <div>0-1小时</div>
          </div>
          <div class="legend-item">
            <div class="legend-color heat-2"></div>
            <div>1-2小时</div>
          </div>
          <div class="legend-item">
            <div class="legend-color heat-3"></div>
            <div>2-3小时</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 个人收藏书架 -->
    <section class="bookshelf-section">
      <h2 class="section-title">个人收藏书架</h2>
      <div class="books-grid">
        <div v-for="book in favoriteBooks" :key="book.id" class="book-card">
          <div class="book-cover">
            <img :src="book.cover" :alt="book.title" />
            <div class="book-progress-bar">
              <div class="progress-fill" :style="{ width: book.progress + '%' }"></div>
            </div>
            <div class="book-progress-text">{{ book.progress }}%</div>
          </div>
          <div class="book-info">
            <h3 class="book-title">{{ book.title }}</h3>
            <div class="book-author">{{ book.author }}</div>
            <div class="book-last-read">上次阅读：{{ book.lastRead }}</div>
            <button class="continue-reading-btn">继续阅读</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 学习笔记管理区 -->
    <section class="notes-section">
      <h2 class="section-title">学习笔记管理</h2>
      <div class="notes-container">
        <div class="notes-sidebar">
          <h3>笔记分类</h3>
          <ul class="category-list">
            <li
              class="category-item"
              :class="{ active: selectedCategory === '全部' }"
              @click="selectedCategory = '全部'"
            >
              全部笔记 <span class="count">{{ notes.length }}</span>
            </li>
            <li
              v-for="category in noteCategories"
              :key="category.id"
              class="category-item"
              :class="{ active: selectedCategory === category.name }"
              @click="selectedCategory = category.name"
            >
              {{ category.name }} <span class="count">{{ category.count }}</span>
            </li>
          </ul>
          <button class="new-note-btn">创建新笔记</button>
        </div>
        <div class="notes-content">
          <div class="notes-header">
            <h3>
              {{ selectedCategory }} <span class="notes-count">({{ filteredNotes.length }})</span>
            </h3>
            <div class="notes-actions">
              <input type="text" placeholder="搜索笔记..." class="search-input" />
              <select class="sort-select">
                <option value="newest">最新创建</option>
                <option value="oldest">最早创建</option>
                <option value="title">按标题</option>
              </select>
            </div>
          </div>
          <div class="notes-list">
            <div v-for="note in filteredNotes" :key="note.id" class="note-card">
              <div class="note-header">
                <h4 class="note-title">{{ note.title }}</h4>
                <div class="note-category">{{ note.category }}</div>
              </div>
              <div class="note-content">{{ note.content }}</div>
              <div class="note-footer">
                <div class="note-time">{{ note.createTime }}</div>
                <div class="note-tags">
                  <span v-for="(tag, index) in note.tags" :key="index" class="note-tag">{{
                    tag
                  }}</span>
                </div>
              </div>
              <div class="note-actions">
                <button class="edit-btn">编辑</button>
                <button class="delete-btn">删除</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 学习计划制定工具 -->
    <section class="plans-section">
      <h2 class="section-title">学习计划</h2>
      <div class="plans-container">
        <div class="plans-header">
          <button class="add-plan-btn" @click="showNewPlanForm = true">
            <span class="plus-icon">+</span> 新建学习计划
          </button>
        </div>

        <div v-if="showNewPlanForm" class="new-plan-form">
          <h3>创建新学习计划</h3>
          <div class="form-group">
            <label for="plan-title">计划标题</label>
            <input
              type="text"
              id="plan-title"
              v-model="newPlan.title"
              placeholder="输入计划标题..."
            />
          </div>
          <div class="form-group">
            <label for="plan-description">计划描述</label>
            <textarea
              id="plan-description"
              v-model="newPlan.description"
              placeholder="描述你的学习计划..."
            ></textarea>
          </div>
          <div class="form-row">
            <div class="form-group half">
              <label for="start-date">开始日期</label>
              <input type="date" id="start-date" v-model="newPlan.startDate" />
            </div>
            <div class="form-group half">
              <label for="end-date">结束日期</label>
              <input type="date" id="end-date" v-model="newPlan.endDate" />
            </div>
          </div>
          <div class="form-group">
            <label for="reminder">提醒时间</label>
            <input
              type="text"
              id="reminder"
              v-model="newPlan.reminder"
              placeholder="例如：每天 20:00"
            />
          </div>
          <div class="form-actions">
            <button class="cancel-btn" @click="showNewPlanForm = false">取消</button>
            <button class="save-btn" @click="addNewPlan">保存计划</button>
          </div>
        </div>

        <div class="plans-list">
          <div v-for="plan in learningPlans" :key="plan.id" class="plan-card">
            <div class="plan-header">
              <h3 class="plan-title">{{ plan.title }}</h3>
              <div class="plan-dates">{{ plan.startDate }} 至 {{ plan.endDate }}</div>
            </div>
            <div class="plan-description">{{ plan.description }}</div>
            <div class="plan-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: plan.progress + '%' }"></div>
              </div>
              <div class="progress-text">{{ plan.progress }}% 完成</div>
            </div>
            <div class="plan-reminder">
              <div class="reminder-icon"></div>
              <div class="reminder-text">提醒：{{ plan.reminder }}</div>
            </div>
            <div class="plan-actions">
              <button class="edit-btn">编辑</button>
              <button class="delete-btn">删除</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 个人成就徽章展示区 -->
    <section class="achievements-section">
      <h2 class="section-title">个人成就</h2>
      <div class="badges-grid">
        <div
          v-for="badge in achievements"
          :key="badge.id"
          class="badge-card"
          :class="{ locked: !badge.unlocked }"
        >
          <div class="badge-icon">
            <img :src="badge.icon" :alt="badge.name" />
            <div v-if="!badge.unlocked" class="badge-lock"></div>
          </div>
          <div class="badge-info">
            <h3 class="badge-name">{{ badge.name }}</h3>
            <div class="badge-description">{{ badge.description }}</div>
            <div v-if="badge.unlocked" class="badge-unlock-date">
              获得于：{{ badge.unlockDate }}
            </div>
            <div v-else class="badge-progress">
              进度：{{ badge.progress }}/{{ badge.total }}
              <div class="badge-progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: (badge.progress / badge.total) * 100 + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 学习记录时间线 -->
    <section class="timeline-section">
      <h2 class="section-title">学习记录时间线</h2>
      <div class="timeline">
        <div v-for="record in learningHistory" :key="record.id" class="timeline-item">
          <div class="timeline-icon" :class="record.type + '-icon'"></div>
          <div class="timeline-content">
            <div class="timeline-time">{{ record.time }}</div>
            <h3 class="timeline-title">{{ record.title }}</h3>
            <div class="timeline-description">{{ record.description }}</div>
            <div v-if="record.duration" class="timeline-duration">
              学习时长：{{ record.duration }}分钟
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 全局样式 */
.learning-center {
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
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0e6dc;
}

/* 用户信息头部 */
.user-profile-header {
  background: linear-gradient(to right, #8a1e1e, #c24a4a);
  border-radius: 10px;
  padding: 30px;
  margin-bottom: 30px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
  margin-right: 30px;
}

.user-name {
  font-size: 2rem;
  margin-bottom: 10px;
}

.user-level {
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.user-level span {
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 3px 8px;
  border-radius: 10px;
}

.user-join-date {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* 学习数据仪表盘 */
.dashboard-section {
  background-color: white;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #f9f5f2;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #8a1e1e;
  margin-right: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.5rem;
}

.time-icon::before {
  content: '⏱';
}

.book-icon::before {
  content: '📚';
}

.note-icon::before {
  content: '📝';
}

.work-icon::before {
  content: '🏆';
}

.streak-icon::before {
  content: '🔥';
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #8a1e1e;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

/* 学习日历热力图 */
.calendar-section {
  background-color: white;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.calendar-heatmap {
  margin-top: 20px;
}

.calendar-months {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.calendar-month-label {
  font-size: 0.8rem;
  color: #666;
  width: calc(100% / 12);
  text-align: center;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(52, 1fr);
  grid-template-rows: repeat(7, 1fr);
  gap: 3px;
  height: 140px;
}

.calendar-day {
  width: 100%;
  height: 100%;
  border-radius: 2px;
}

.heat-0 {
  background-color: #ebedf0;
}

.heat-1 {
  background-color: #c6e48b;
}

.heat-2 {
  background-color: #7bc96f;
}

.heat-3 {
  background-color: #196127;
}

.calendar-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 10px;
  gap: 10px;
}

.legend-label {
  font-size: 0.8rem;
  color: #666;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  color: #666;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

/* 个人收藏书架 */
.bookshelf-section {
  background-color: white;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 25px;
  margin-top: 20px;
}

.book-card {
  background-color: #f9f5f2;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.book-card:hover {
  transform: translateY(-5px);
}

.book-cover {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background-color: rgba(0, 0, 0, 0.2);
}

.progress-fill {
  height: 100%;
  background-color: #8a1e1e;
}

.book-progress-text {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #8a1e1e;
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
}

.book-info {
  padding: 15px;
}

.book-title {
  font-size: 1.1rem;
  margin-bottom: 5px;
  color: #333;
}

.book-author {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.book-last-read {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 12px;
}

.continue-reading-btn {
  width: 100%;
  padding: 8px;
  background-color: #8a1e1e;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.continue-reading-btn:hover {
  background-color: #6b1717;
}

/* 学习笔记管理区 */
.notes-section {
  background-color: white;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.notes-container {
  display: flex;
  gap: 25px;
  margin-top: 20px;
}

.notes-sidebar {
  width: 250px;
  flex-shrink: 0;
}

.notes-sidebar h3 {
  margin-bottom: 15px;
  color: #333;
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.category-item {
  padding: 10px 15px;
  border-radius: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;
}

.category-item:hover {
  background-color: #f0e6dc;
}

.category-item.active {
  background-color: #8a1e1e;
  color: white;
}

.category-item .count {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
}

.category-item.active .count {
  background-color: rgba(255, 255, 255, 0.2);
}

.new-note-btn {
  width: 100%;
  padding: 10px;
  background-color: #8a1e1e;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.new-note-btn:hover {
  background-color: #6b1717;
}

.notes-content {
  flex: 1;
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.notes-header h3 {
  color: #333;
}

.notes-count {
  color: #888;
  font-weight: normal;
}

.notes-actions {
  display: flex;
  gap: 10px;
}

.search-input,
.sort-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.notes-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.note-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.note-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.note-header {
  padding: 15px;
  background-color: #f9f5f2;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-title {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.note-category {
  font-size: 0.8rem;
  background-color: #8a1e1e;
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
}

.note-content {
  padding: 15px;
  color: #555;
  font-size: 0.9rem;
  line-height: 1.5;
  max-height: 100px;
  overflow: hidden;
}

.note-footer {
  padding: 10px 15px;
  background-color: #f9f5f2;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-time {
  font-size: 0.8rem;
  color: #888;
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.note-tag {
  font-size: 0.7rem;
  background-color: #f0e6dc;
  padding: 2px 6px;
  border-radius: 8px;
  color: #666;
}

.note-actions {
  padding: 10px 15px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.edit-btn,
.delete-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8rem;
}

.edit-btn {
  background-color: #8a1e1e;
  color: white;
}

.delete-btn {
  background-color: #f0e6dc;
  color: #333;
}

/* 学习计划制定工具 */
.plans-section {
  background-color: white;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.plans-header {
  margin-bottom: 20px;
}

.add-plan-btn {
  padding: 10px 15px;
  background-color: #8a1e1e;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.plus-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.new-plan-form {
  background-color: #f9f5f2;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
}

.new-plan-form h3 {
  margin-bottom: 15px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.form-group.half {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #555;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn,
.save-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f0e6dc;
  color: #333;
}

.save-btn {
  background-color: #8a1e1e;
  color: white;
}

.plans-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.plan-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.plan-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.plan-header {
  padding: 15px;
  background-color: #f9f5f2;
  border-bottom: 1px solid #eee;
}

.plan-title {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  color: #333;
}

.plan-dates {
  font-size: 0.8rem;
  color: #888;
}

.plan-description {
  padding: 15px;
  color: #555;
  font-size: 0.9rem;
  line-height: 1.5;
}

.plan-progress {
  padding: 0 15px 15px;
}

.progress-bar {
  height: 8px;
  background-color: #f0e6dc;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 5px;
}

.progress-text {
  font-size: 0.8rem;
  color: #888;
  text-align: right;
}

.plan-reminder {
  padding: 10px 15px;
  background-color: #f9f5f2;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 10px;
}

.reminder-icon {
  width: 16px;
  height: 16px;
  background-color: #8a1e1e;
  border-radius: 50%;
}

.reminder-text {
  font-size: 0.8rem;
  color: #666;
}

.plan-actions {
  padding: 10px 15px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 个人成就徽章展示区 */
.achievements-section {
  background-color: white;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.badge-card {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #f9f5f2;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.badge-card:hover {
  transform: translateY(-5px);
}

.badge-card.locked {
  opacity: 0.7;
}

.badge-icon {
  position: relative;
  width: 70px;
  height: 70px;
  margin-right: 15px;
  flex-shrink: 0;
}

.badge-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.badge-lock {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.badge-lock::after {
  content: '🔒';
  font-size: 1.5rem;
  color: white;
}

.badge-info {
  flex: 1;
}

.badge-name {
  font-size: 1.1rem;
  margin: 0 0 5px 0;
  color: #333;
}

.badge-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.badge-unlock-date {
  font-size: 0.8rem;
  color: #8a1e1e;
}

.badge-progress {
  font-size: 0.8rem;
  color: #666;
}

.badge-progress-bar {
  height: 6px;
  background-color: #eee;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 5px;
}

/* 学习记录时间线 */
.timeline-section {
  background-color: white;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.timeline {
  position: relative;
  margin-top: 30px;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 15px;
  width: 2px;
  background-color: #f0e6dc;
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;
}

.timeline-icon {
  position: absolute;
  top: 0;
  left: -30px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #8a1e1e;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.read-icon::after {
  content: '📖';
  font-size: 0.9rem;
}

.note-icon::after {
  content: '📝';
  font-size: 0.9rem;
}

.achievement-icon::after {
  content: '🏆';
  font-size: 0.9rem;
}

.plan-icon::after {
  content: '📅';
  font-size: 0.9rem;
}

.timeline-content {
  background-color: #f9f5f2;
  border-radius: 8px;
  padding: 15px;
}

.timeline-time {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 5px;
}

.timeline-title {
  font-size: 1.1rem;
  margin: 0 0 10px 0;
  color: #333;
}

.timeline-description {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 8px;
}

.timeline-duration {
  font-size: 0.8rem;
  color: #8a1e1e;
}

/* 响应式设计 */
@media (max-width: 900px) {
  .notes-container {
    flex-direction: column;
  }

  .notes-sidebar {
    width: 100%;
    margin-bottom: 20px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .books-grid,
  .badges-grid,
  .plans-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .user-info {
    flex-direction: column;
    text-align: center;
  }

  .user-avatar {
    margin-right: 0;
    margin-bottom: 15px;
  }

  .stats-grid,
  .books-grid,
  .badges-grid,
  .plans-list,
  .notes-list {
    grid-template-columns: 1fr;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .calendar-grid {
    grid-template-columns: repeat(26, 1fr);
    grid-auto-flow: dense;
  }
}
</style>
