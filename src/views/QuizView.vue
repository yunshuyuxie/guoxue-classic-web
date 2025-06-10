<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 测验分类
const quizCategories = [
  {
    id: 'classics',
    name: '经典常识',
    icon: '📚',
    description: '测试您对四书五经等经典著作的了解',
    color: '#8a1e1e',
    difficulty: '入门级',
    questionsCount: 20,
  },
  {
    id: 'quotes',
    name: '名句填空',
    icon: '✍️',
    description: '完成古诗文名句中的空缺部分',
    color: '#c17e0a',
    difficulty: '普通级',
    questionsCount: 30,
  },
  {
    id: 'figures',
    name: '人物典故',
    icon: '👑',
    description: '了解古代名人及其相关历史典故',
    color: '#0f5e9c',
    difficulty: '普通级',
    questionsCount: 25,
  },
  {
    id: 'culture',
    name: '文化常识',
    icon: '🏮',
    description: '测试中国传统文化知识与风俗习惯',
    color: '#7a5901',
    difficulty: '进阶级',
    questionsCount: 35,
  },
]

// 每日一题
const dailyQuestion = ref({
  id: 1001,
  question: '《论语》"学而时习之，不亦说乎"中的"说"字应解释为：',
  options: ['悦', '阅', '说', '税'],
  answer: 0,
  explanation:
    '"说"通"悦"，表示高兴、愉快的意思。这句话的意思是"学习知识并且经常温习它，不也是很快乐的事情吗？"',
  source: '《论语·学而》',
  difficulty: '入门级',
})

// 用户统计
const userStats = ref({
  totalQuizzes: 0,
  correctRate: 0,
  points: 0,
  ranking: 0,
  streakDays: 0,
})

// 加载状态
const isLoading = ref(true)
const isDailyCompleted = ref(false)

// 排行榜数据
const leaderboard = ref([
  { rank: 1, username: '国学大师', avatar: 'images/avatars/avatar1.png', points: 9800 },
  { rank: 2, username: '诗词达人', avatar: 'images/avatars/avatar2.png', points: 9650 },
  { rank: 3, username: '文化传承者', avatar: 'images/avatars/avatar3.png', points: 9320 },
  { rank: 4, username: '经典守护', avatar: 'images/avatars/avatar4.png', points: 8950 },
  { rank: 5, username: '知礼明义', avatar: 'images/avatars/avatar5.png', points: 8820 },
])

// 获取用户信息和每日一题
const fetchUserData = () => {
  // 模拟API请求
  setTimeout(() => {
    userStats.value = {
      totalQuizzes: 42,
      correctRate: 78,
      points: 3680,
      ranking: 78,
      streakDays: 5,
    }
    isLoading.value = false
  }, 1000)
}

// 判断每日一题是否已完成
const checkDailyStatus = () => {
  const today = new Date().toISOString().split('T')[0]
  const lastCompleted = localStorage.getItem('lastDailyQuizDate')
  isDailyCompleted.value = lastCompleted === today
}

// 计算用户等级
const userLevel = computed(() => {
  const points = userStats.value.points
  if (points >= 5000) return '国学大师'
  if (points >= 3000) return '文化传承者'
  if (points >= 1000) return '知礼明义'
  if (points >= 500) return '小有所成'
  return '初学之士'
})

// 开始测验
const startQuiz = (categoryId: string) => {
  router.push(`/quiz/${categoryId}`)
}

// 开始每日一题
const startDailyQuiz = () => {
  router.push('/quiz/daily')
}

// 查看历史记录
const viewHistory = () => {
  router.push('/quiz/history')
}

// 查看排行榜
const viewLeaderboard = () => {
  router.push('/quiz/leaderboard')
}

// 页面加载
onMounted(() => {
  fetchUserData()
  checkDailyStatus()
})
</script>

<template>
  <div class="quiz-view">
    <div class="page-header">
      <h1 class="page-title">国学知识测验</h1>
      <p class="page-subtitle">温故知新，以学益智</p>
    </div>

    <!-- 每日一题区域 -->
    <div class="daily-quiz-section">
      <div class="daily-quiz-card">
        <div class="daily-quiz-info">
          <div class="daily-header">
            <div class="daily-title">
              <span class="daily-icon">📝</span>
              每日一题
            </div>
            <div class="daily-date">
              {{ new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }) }}
            </div>
          </div>
          <p class="daily-question">{{ dailyQuestion.question }}</p>
          <div class="daily-footer">
            <div class="daily-source">来源：{{ dailyQuestion.source }}</div>
            <div class="daily-difficulty">{{ dailyQuestion.difficulty }}</div>
          </div>
        </div>
        <div class="daily-quiz-action">
          <button
            class="daily-button"
            :class="{ completed: isDailyCompleted }"
            @click="startDailyQuiz"
          >
            {{ isDailyCompleted ? '已完成' : '开始答题' }}
          </button>
          <div class="daily-streak" v-if="userStats.streakDays > 0">
            <span class="streak-icon">🔥</span>
            <span class="streak-days">连续答题 {{ userStats.streakDays }} 天</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户信息区 -->
    <div class="user-stats-section">
      <div class="user-stats-card">
        <div class="stats-header">
          <h3>学习进度</h3>
          <button class="view-history-button" @click="viewHistory">查看历史</button>
        </div>
        <div class="stats-content" v-if="!isLoading">
          <div class="stat-item">
            <div class="stat-value">{{ userStats.totalQuizzes }}</div>
            <div class="stat-label">已完成测验</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ userStats.correctRate }}%</div>
            <div class="stat-label">正确率</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ userStats.points }}</div>
            <div class="stat-label">积分</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ userLevel }}</div>
            <div class="stat-label">当前等级</div>
          </div>
        </div>
        <div class="stats-loading" v-else>
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    </div>

    <!-- 测验分类 -->
    <div class="quiz-categories-section">
      <h2 class="section-title">测验分类</h2>
      <div class="categories-grid">
        <div
          v-for="category in quizCategories"
          :key="category.id"
          class="category-card"
          :style="{ '--category-color': category.color }"
          @click="startQuiz(category.id)"
        >
          <div class="category-icon">{{ category.icon }}</div>
          <div class="category-content">
            <h3 class="category-title">{{ category.name }}</h3>
            <p class="category-description">{{ category.description }}</p>
            <div class="category-meta">
              <span class="category-difficulty">{{ category.difficulty }}</span>
              <span class="category-count">{{ category.questionsCount }}题</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 排行榜预览 -->
    <div class="leaderboard-section">
      <div class="leaderboard-header">
        <h2 class="section-title">排行榜</h2>
        <button class="view-all-button" @click="viewLeaderboard">查看全部</button>
      </div>
      <div class="leaderboard-preview">
        <div class="leaderboard-table">
          <div class="leaderboard-row header">
            <div class="leaderboard-cell rank">排名</div>
            <div class="leaderboard-cell user">用户</div>
            <div class="leaderboard-cell points">积分</div>
          </div>
          <div
            v-for="user in leaderboard"
            :key="user.rank"
            class="leaderboard-row"
            :class="{ 'current-user': user.rank === userStats.ranking }"
          >
            <div class="leaderboard-cell rank">
              <div class="rank-badge" :class="`rank-${user.rank}`" v-if="user.rank <= 3">
                {{ user.rank }}
              </div>
              <span v-else>{{ user.rank }}</span>
            </div>
            <div class="leaderboard-cell user">
              <img :src="user.avatar" :alt="user.username" class="user-avatar" />
              <span class="username">{{ user.username }}</span>
            </div>
            <div class="leaderboard-cell points">{{ user.points }}</div>
          </div>
        </div>
      </div>
      <div class="user-ranking" v-if="!isLoading">
        <div class="ranking-label">您的排名:</div>
        <div class="ranking-value">{{ userStats.ranking }}</div>
      </div>
    </div>

    <!-- 进阶挑战 -->
    <div class="challenge-section">
      <div class="challenge-card">
        <div class="challenge-content">
          <h3 class="challenge-title">进阶挑战模式</h3>
          <p class="challenge-description">挑战难度逐级递增的题目，检验您的国学知识深度！</p>
          <ul class="challenge-features">
            <li>五个难度等级，由浅入深</li>
            <li>限时答题，考验反应速度</li>
            <li>额外积分奖励，快速提升排名</li>
          </ul>
        </div>
        <button class="challenge-button" @click="startQuiz('challenge')">开始挑战</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
}

.page-header::after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background-color: #8a1e1e;
  margin: 15px auto 0;
}

.page-title {
  font-size: 32px;
  color: #8a1e1e;
  margin: 0;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.page-subtitle {
  font-size: 16px;
  color: #666;
  margin-top: 5px;
}

/* 每日一题区域 */
.daily-quiz-section {
  margin-bottom: 40px;
}

.daily-quiz-card {
  display: flex;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #eee;
}

.daily-quiz-info {
  flex: 1;
  padding: 20px;
  position: relative;
}

.daily-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.daily-title {
  font-size: 20px;
  font-weight: bold;
  color: #8a1e1e;
  display: flex;
  align-items: center;
}

.daily-icon {
  margin-right: 8px;
  font-size: 24px;
}

.daily-date {
  color: #888;
  font-size: 14px;
}

.daily-question {
  font-size: 18px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 20px;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.daily-footer {
  display: flex;
  justify-content: space-between;
  color: #888;
  font-size: 14px;
}

.daily-quiz-action {
  width: 200px;
  background-color: #f9f5f2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-left: 1px solid #eee;
}

.daily-button {
  background-color: #8a1e1e;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.daily-button:hover {
  background-color: #6e1818;
}

.daily-button.completed {
  background-color: #888;
  cursor: not-allowed;
}

.daily-streak {
  margin-top: 15px;
  display: flex;
  align-items: center;
  color: #ff7700;
  font-size: 14px;
}

.streak-icon {
  margin-right: 5px;
}

/* 用户信息区 */
.user-stats-section {
  margin-bottom: 40px;
}

.user-stats-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  padding: 20px;
  border: 1px solid #eee;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.stats-header h3 {
  font-size: 18px;
  color: #333;
  margin: 0;
}

.view-history-button {
  background: none;
  border: none;
  color: #8a1e1e;
  cursor: pointer;
  font-size: 14px;
}

.stats-content {
  display: flex;
  justify-content: space-between;
}

.stat-item {
  text-align: center;
  padding: 0 15px;
  flex: 1;
  border-right: 1px solid #eee;
}

.stat-item:last-child {
  border-right: none;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #8a1e1e;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stats-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #8a1e1e;
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

/* 测验分类 */
.quiz-categories-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  font-family: 'STKaiti', 'KaiTi', serif;
  position: relative;
  padding-left: 15px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 20px;
  background-color: #8a1e1e;
  border-radius: 2px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.category-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  border: 1px solid #eee;
  border-top: 3px solid var(--category-color, #8a1e1e);
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

.category-icon {
  font-size: 30px;
  padding: 20px;
  background-color: #f9f5f2;
  text-align: center;
}

.category-content {
  padding: 20px;
}

.category-title {
  font-size: 18px;
  color: var(--category-color, #8a1e1e);
  margin: 0 0 10px 0;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.category-description {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
}

.category-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
}

/* 排行榜区域 */
.leaderboard-section {
  margin-bottom: 40px;
}

.leaderboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.view-all-button {
  background: none;
  border: none;
  color: #8a1e1e;
  cursor: pointer;
  font-size: 14px;
}

.leaderboard-preview {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #eee;
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
}

.leaderboard-row {
  display: flex;
  border-bottom: 1px solid #eee;
}

.leaderboard-row.header {
  background-color: #f9f5f2;
  font-weight: bold;
  color: #666;
}

.leaderboard-row.current-user {
  background-color: #fff8e1;
}

.leaderboard-row:last-child {
  border-bottom: none;
}

.leaderboard-cell {
  padding: 12px 15px;
  text-align: left;
}

.leaderboard-cell.rank {
  width: 70px;
  text-align: center;
}

.leaderboard-cell.user {
  flex: 1;
  display: flex;
  align-items: center;
}

.leaderboard-cell.points {
  width: 100px;
  text-align: right;
  font-weight: bold;
  color: #8a1e1e;
}

.rank-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  margin: 0 auto;
}

.rank-1 {
  background-color: gold;
}

.rank-2 {
  background-color: silver;
}

.rank-3 {
  background-color: #cd7f32; /* bronze */
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.username {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-ranking {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}

.ranking-value {
  font-weight: bold;
  margin-left: 5px;
  color: #8a1e1e;
}

/* 进阶挑战区域 */
.challenge-section {
  margin-bottom: 40px;
}

.challenge-card {
  background: linear-gradient(135deg, #8a1e1e 0%, #c14c4c 100%);
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  color: white;
  display: flex;
  align-items: center;
  padding: 30px;
}

.challenge-content {
  flex: 1;
}

.challenge-title {
  font-size: 24px;
  margin: 0 0 10px 0;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.challenge-description {
  margin-bottom: 15px;
  font-size: 16px;
  opacity: 0.9;
}

.challenge-features {
  padding-left: 20px;
  margin: 15px 0;
}

.challenge-features li {
  margin-bottom: 5px;
  opacity: 0.8;
}

.challenge-button {
  background-color: white;
  color: #8a1e1e;
  border: none;
  padding: 12px 25px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  min-width: 150px;
}

.challenge-button:hover {
  background-color: #f0f0f0;
  transform: scale(1.05);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .daily-quiz-card {
    flex-direction: column;
  }

  .daily-quiz-action {
    width: 100%;
    border-left: none;
    border-top: 1px solid #eee;
  }

  .stats-content {
    flex-wrap: wrap;
  }

  .stat-item {
    width: 50%;
    padding: 10px;
    border-right: none;
    border-bottom: 1px solid #eee;
    flex: none;
  }

  .stat-item:nth-child(even) {
    border-left: 1px solid #eee;
  }

  .stat-item:nth-last-child(-n + 2) {
    border-bottom: none;
  }

  .challenge-card {
    flex-direction: column;
    text-align: center;
  }

  .challenge-button {
    margin-top: 20px;
    width: 100%;
  }
}
</style>
