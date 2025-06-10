<script setup lang="ts">
import { ref, computed, defineProps } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  // 测验结果数据
  results: {
    type: Object,
    required: true,
  },
  // 测验类型
  quizType: {
    type: String,
    required: true,
  },
})

const router = useRouter()

// 计算正确率
const correctRate = computed(() => {
  if (!props.results.questions || props.results.questions.length === 0) return 0

  const correctCount = props.results.questions.filter((q) => q.isCorrect).length
  return Math.round((correctCount / props.results.questions.length) * 100)
})

// 计算得分
const score = computed(() => {
  if (!props.results.questions || props.results.questions.length === 0) return 0

  // 基础分数
  const baseScore = Math.round((correctRate.value / 100) * 100)

  // 根据时间和难度加成
  const timeBonus = props.results.timeBonus || 0
  const difficultyBonus = props.results.difficultyBonus || 0

  return baseScore + timeBonus + difficultyBonus
})

// 计算知识点掌握情况
const knowledgePointsAnalysis = computed(() => {
  if (!props.results.questions || props.results.questions.length === 0) return []

  // 收集所有知识点
  const pointsMap = new Map()

  props.results.questions.forEach((question) => {
    if (question.knowledgePoints && Array.isArray(question.knowledgePoints)) {
      question.knowledgePoints.forEach((point) => {
        if (!pointsMap.has(point)) {
          pointsMap.set(point, {
            name: point,
            total: 0,
            correct: 0,
          })
        }

        const pointData = pointsMap.get(point)
        pointData.total += 1
        if (question.isCorrect) {
          pointData.correct += 1
        }
      })
    }
  })

  // 转换为数组并计算掌握度
  return Array.from(pointsMap.values())
    .map((point) => {
      return {
        ...point,
        masteryRate: point.total > 0 ? Math.round((point.correct / point.total) * 100) : 0,
        masteryLevel: getMasteryLevel(
          point.total > 0 ? Math.round((point.correct / point.total) * 100) : 0,
        ),
      }
    })
    .sort((a, b) => b.masteryRate - a.masteryRate)
})

// 获取掌握度级别
const getMasteryLevel = (rate) => {
  if (rate >= 90) return { level: '精通', color: '#4caf50' }
  if (rate >= 70) return { level: '熟练', color: '#8bc34a' }
  if (rate >= 50) return { level: '基础', color: '#ffc107' }
  return { level: '待加强', color: '#f44336' }
}

// 计算难度分布
const difficultyDistribution = computed(() => {
  if (!props.results.questions || props.results.questions.length === 0) return []

  const difficultyMap = new Map()

  props.results.questions.forEach((question) => {
    const difficulty = question.difficulty || '普通'

    if (!difficultyMap.has(difficulty)) {
      difficultyMap.set(difficulty, {
        name: difficulty,
        total: 0,
        correct: 0,
      })
    }

    const diffData = difficultyMap.get(difficulty)
    diffData.total += 1
    if (question.isCorrect) {
      diffData.correct += 1
    }
  })

  return Array.from(difficultyMap.values()).map((diff) => {
    return {
      ...diff,
      correctRate: diff.total > 0 ? Math.round((diff.correct / diff.total) * 100) : 0,
    }
  })
})

// 计算推荐学习内容
const recommendedContent = computed(() => {
  // 找出掌握度最低的知识点
  const weakPoints = knowledgePointsAnalysis.value
    .filter((point) => point.masteryRate < 70)
    .slice(0, 3)

  // 模拟推荐内容
  return weakPoints.map((point) => {
    return {
      title: `${point.name}专题讲解`,
      type: '课程',
      link: `/courses?topic=${encodeURIComponent(point.name)}`,
    }
  })
})

// 重新测验
const retakeQuiz = () => {
  router.push(`/quiz/${props.quizType}`)
}

// 查看错题
const viewIncorrectQuestions = () => {
  router.push(`/quiz/review/${props.results.id}?filter=incorrect`)
}

// 返回测验主页
const backToQuizHome = () => {
  router.push('/quiz')
}

// 分享结果
const shareResults = () => {
  // 简单实现复制结果到剪贴板
  const shareText = `我在「国学经典」完成了${props.results.title}测验，获得了${score.value}分，正确率${correctRate.value}%！`

  try {
    navigator.clipboard.writeText(shareText).then(() => {
      alert('结果已复制到剪贴板，可以分享给好友了！')
    })
  } catch (err) {
    console.error('无法复制到剪贴板:', err)
    alert('无法复制到剪贴板，请手动复制分享！')
  }
}
</script>

<template>
  <div class="quiz-result">
    <div class="result-header">
      <h2 class="result-title">{{ results.title || '测验结果' }}</h2>
      <div class="result-time">
        完成时间: {{ new Date(results.completedAt || Date.now()).toLocaleString('zh-CN') }}
      </div>
    </div>

    <div class="result-overview">
      <div class="result-score-container">
        <div class="result-score">
          <div class="score-value">{{ score }}</div>
          <div class="score-label">总分</div>
        </div>

        <div class="score-circle-container">
          <svg class="score-circle" viewBox="0 0 100 100">
            <circle class="score-circle-bg" cx="50" cy="50" r="45"></circle>
            <circle
              class="score-circle-progress"
              cx="50"
              cy="50"
              r="45"
              :stroke-dasharray="`${correctRate * 2.83}, 283`"
            ></circle>
          </svg>
          <div class="score-percentage">{{ correctRate }}%</div>
        </div>
      </div>

      <div class="result-stats">
        <div class="stat-item">
          <div class="stat-value">{{ results.questions?.length || 0 }}</div>
          <div class="stat-label">总题数</div>
        </div>

        <div class="stat-item">
          <div class="stat-value">
            {{ results.questions?.filter((q) => q.isCorrect).length || 0 }}
          </div>
          <div class="stat-label">答对</div>
        </div>

        <div class="stat-item">
          <div class="stat-value">
            {{ results.questions?.filter((q) => !q.isCorrect).length || 0 }}
          </div>
          <div class="stat-label">答错</div>
        </div>

        <div class="stat-item">
          <div class="stat-value">
            {{
              results.timeSpent
                ? Math.floor(results.timeSpent / 60) + '分' + (results.timeSpent % 60) + '秒'
                : '-- --'
            }}
          </div>
          <div class="stat-label">用时</div>
        </div>
      </div>
    </div>

    <!-- 知识点分析 -->
    <div class="analysis-section" v-if="knowledgePointsAnalysis.length > 0">
      <h3 class="section-title">知识掌握分析</h3>

      <div class="knowledge-mastery">
        <div v-for="point in knowledgePointsAnalysis" :key="point.name" class="mastery-item">
          <div class="mastery-header">
            <div class="mastery-name">{{ point.name }}</div>
            <div class="mastery-level" :style="{ color: point.masteryLevel.color }">
              {{ point.masteryLevel.level }}
            </div>
          </div>

          <div class="mastery-bar-container">
            <div class="mastery-bar-bg"></div>
            <div
              class="mastery-bar-progress"
              :style="{
                width: `${point.masteryRate}%`,
                backgroundColor: point.masteryLevel.color,
              }"
            ></div>
            <div class="mastery-rate">{{ point.masteryRate }}%</div>
          </div>

          <div class="mastery-detail">
            <span>答对 {{ point.correct }}/{{ point.total }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 难度分布 -->
    <div class="analysis-section" v-if="difficultyDistribution.length > 0">
      <h3 class="section-title">难度分布</h3>

      <div class="difficulty-distribution">
        <div v-for="diff in difficultyDistribution" :key="diff.name" class="difficulty-item">
          <div class="difficulty-header">
            <div class="difficulty-name">{{ diff.name }}</div>
            <div class="difficulty-rate">正确率: {{ diff.correctRate }}%</div>
          </div>

          <div class="difficulty-bar-container">
            <div class="difficulty-count">{{ diff.correct }}/{{ diff.total }}</div>
            <div class="difficulty-bar-bg">
              <div class="difficulty-bar-progress" :style="{ width: `${diff.correctRate}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 推荐学习内容 -->
    <div class="recommendation-section" v-if="recommendedContent.length > 0">
      <h3 class="section-title">推荐学习内容</h3>

      <div class="recommendation-list">
        <div v-for="(item, index) in recommendedContent" :key="index" class="recommendation-item">
          <div class="recommendation-icon">📚</div>
          <div class="recommendation-content">
            <div class="recommendation-title">{{ item.title }}</div>
            <div class="recommendation-type">{{ item.type }}</div>
          </div>
          <router-link :to="item.link" class="recommendation-link"> 查看 </router-link>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="actions-container">
      <button class="action-button retry" @click="retakeQuiz">重新测验</button>

      <button class="action-button review" @click="viewIncorrectQuestions">查看错题</button>

      <button class="action-button share" @click="shareResults">分享结果</button>

      <button class="action-button home" @click="backToQuizHome">返回主页</button>
    </div>
  </div>
</template>

<style scoped>
.quiz-result {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.result-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.result-title {
  font-size: 28px;
  color: #8a1e1e;
  margin: 0 0 10px 0;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.result-time {
  color: #888;
  font-size: 14px;
}

.result-overview {
  display: flex;
  margin-bottom: 40px;
}

.result-score-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 30px;
  border-right: 1px solid #eee;
  width: 180px;
}

.result-score {
  text-align: center;
  margin-bottom: 20px;
}

.score-value {
  font-size: 48px;
  font-weight: bold;
  color: #8a1e1e;
}

.score-label {
  font-size: 16px;
  color: #666;
}

.score-circle-container {
  position: relative;
  width: 120px;
  height: 120px;
}

.score-circle {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.score-circle-bg {
  fill: none;
  stroke: #f0f0f0;
  stroke-width: 8;
}

.score-circle-progress {
  fill: none;
  stroke: #8a1e1e;
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dasharray 0.8s ease;
}

.score-percentage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.result-stats {
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-left: 30px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.section-title {
  font-size: 20px;
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
  width: 4px;
  height: 18px;
  background-color: #8a1e1e;
  border-radius: 2px;
}

.analysis-section {
  margin-bottom: 40px;
}

.knowledge-mastery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.mastery-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
}

.mastery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.mastery-name {
  font-weight: bold;
  color: #333;
}

.mastery-level {
  font-size: 14px;
  font-weight: bold;
}

.mastery-bar-container {
  position: relative;
  height: 8px;
  margin-bottom: 8px;
}

.mastery-bar-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
  border-radius: 4px;
}

.mastery-bar-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 4px;
  transition: width 0.8s ease;
}

.mastery-rate {
  position: absolute;
  right: 0;
  top: -20px;
  font-size: 12px;
  color: #666;
}

.mastery-detail {
  font-size: 12px;
  color: #666;
  text-align: right;
}

.difficulty-distribution {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.difficulty-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
}

.difficulty-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.difficulty-name {
  font-weight: bold;
  color: #333;
}

.difficulty-rate {
  font-size: 14px;
  color: #666;
}

.difficulty-bar-container {
  display: flex;
  align-items: center;
}

.difficulty-count {
  width: 50px;
  font-size: 14px;
  color: #666;
  margin-right: 10px;
}

.difficulty-bar-bg {
  flex: 1;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.difficulty-bar-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #8a1e1e;
  border-radius: 4px;
  transition: width 0.8s ease;
}

.recommendation-section {
  margin-bottom: 40px;
}

.recommendation-list {
  background-color: #f9f5f2;
  border-radius: 8px;
  padding: 5px;
}

.recommendation-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.recommendation-item:last-child {
  border-bottom: none;
}

.recommendation-icon {
  font-size: 24px;
  margin-right: 15px;
}

.recommendation-content {
  flex: 1;
}

.recommendation-title {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.recommendation-type {
  font-size: 12px;
  color: #666;
}

.recommendation-link {
  background-color: #8a1e1e;
  color: white;
  padding: 6px 15px;
  border-radius: 4px;
  font-size: 14px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.recommendation-link:hover {
  background-color: #6e1818;
}

.actions-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 30px;
}

.action-button {
  padding: 12px 25px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.action-button.retry {
  background-color: #8a1e1e;
  color: white;
}

.action-button.retry:hover {
  background-color: #6e1818;
}

.action-button.review {
  background-color: #f0f0f0;
  color: #333;
}

.action-button.review:hover {
  background-color: #e0e0e0;
}

.action-button.share {
  background-color: #4267b2;
  color: white;
}

.action-button.share:hover {
  background-color: #365899;
}

.action-button.home {
  background-color: #f0f0f0;
  color: #333;
}

.action-button.home:hover {
  background-color: #e0e0e0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .quiz-result {
    padding: 20px;
  }

  .result-overview {
    flex-direction: column;
  }

  .result-score-container {
    width: 100%;
    padding-right: 0;
    border-right: none;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
  }

  .result-stats {
    padding-left: 0;
  }

  .knowledge-mastery,
  .difficulty-distribution {
    grid-template-columns: 1fr;
  }

  .actions-container {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
  }
}
</style>
