<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QuizResult from '../components/QuizResult.vue'

const route = useRoute()
const router = useRouter()

// 结果ID
const resultId = computed(() => route.params.id as string)

// 结果数据
const resultData = ref<any>(null)

// 加载状态
const isLoading = ref(true)

// 获取结果数据
const fetchResultData = () => {
  // 首先检查路由状态中是否有结果数据
  if (route.query && route.query.state && typeof route.query.state === 'string') {
    try {
      const stateData = JSON.parse(route.query.state)
      if (stateData.results) {
        resultData.value = stateData.results
        isLoading.value = false
        return
      }
    } catch (e) {
      console.error('Failed to parse state data', e)
    }
  }

  // 如果没有，则模拟从API获取
  // 实际项目中应该从后端API获取结果数据
  setTimeout(() => {
    // 根据结果ID生成模拟数据
    if (resultId.value.includes('daily')) {
      resultData.value = generateDailyResult()
    } else if (resultId.value.includes('challenge')) {
      resultData.value = generateChallengeResult()
    } else {
      resultData.value = generateNormalResult()
    }

    isLoading.value = false
  }, 1000)
}

// 生成每日一题结果
const generateDailyResult = () => {
  return {
    id: resultId.value,
    title: '每日一题',
    completedAt: new Date(),
    timeSpent: 45,
    questions: [
      {
        id: 1001,
        question: '《论语》"学而时习之，不亦说乎"中的"说"字应解释为：',
        options: ['悦', '阅', '说', '税'],
        answer: 0,
        userAnswer: 0,
        isCorrect: true,
        explanation:
          '"说"通"悦"，表示高兴、愉快的意思。这句话的意思是"学习知识并且经常温习它，不也是很快乐的事情吗？"',
        source: '《论语·学而》',
        difficulty: '入门级',
        knowledgePoints: ['《论语》', '古文字通假'],
      },
    ],
  }
}

// 生成挑战模式结果
const generateChallengeResult = () => {
  return {
    id: resultId.value,
    title: '进阶挑战',
    completedAt: new Date(),
    timeSpent: 180,
    timeBonus: 20,
    difficultyBonus: 30,
    questions: [
      {
        id: 501,
        question: '《三字经》开头的句子是：',
        options: ['人之初，性本善', '天地玄黄', '子曰：学而时习之', '老吾老，以及人之老'],
        answer: 0,
        userAnswer: 0,
        isCorrect: true,
        explanation:
          '《三字经》是中国古代蒙学读物，开头为"人之初，性本善。性相近，习相远。"表达了人性本善的儒家思想。',
        source: '《三字经》',
        difficulty: '入门级',
        knowledgePoints: ['蒙学读物', '儒家思想'],
      },
      {
        id: 502,
        question: '下列哪位不是"唐宋八大家"之一？',
        options: ['韩愈', '柳宗元', '欧阳修', '李白'],
        answer: 3,
        userAnswer: 3,
        isCorrect: true,
        explanation:
          '"唐宋八大家"是指唐宋时期八位散文大家，包括韩愈、柳宗元、欧阳修、苏洵、苏轼、苏辙、王安石和曾巩。李白虽然是著名诗人，但不在其中。',
        source: '文学史',
        difficulty: '普通级',
        knowledgePoints: ['唐宋八大家', '文学史'],
      },
      {
        id: 503,
        question: '以下哪项不是朱熹理学思想的核心概念？',
        options: ['理气', '格物致知', '诚意正心', '无为而治'],
        answer: 3,
        userAnswer: 1,
        isCorrect: false,
        explanation:
          '"无为而治"是道家思想的核心概念，而非朱熹理学的核心概念。朱熹理学强调"理气"、"格物致知"、"诚意正心"等概念，体现了儒家思想。',
        source: '宋明理学',
        difficulty: '进阶级',
        knowledgePoints: ['宋明理学', '朱熹', '道家思想'],
      },
    ],
  }
}

// 生成普通测验结果
const generateNormalResult = () => {
  // 根据结果ID识别测验类型
  let quizType = 'classics'

  if (resultId.value.includes('quotes')) {
    quizType = 'quotes'
  } else if (resultId.value.includes('figures')) {
    quizType = 'figures'
  } else if (resultId.value.includes('culture')) {
    quizType = 'culture'
  }

  const titles: Record<string, string> = {
    classics: '经典常识测验',
    quotes: '名句填空测验',
    figures: '人物典故测验',
    culture: '文化常识测验',
  }

  return {
    id: resultId.value,
    title: titles[quizType as keyof typeof titles],
    completedAt: new Date(),
    timeSpent: 240,
    questions: [
      // 根据测验类型生成不同的模拟结果
      {
        id: 101,
        question: quizType === 'quotes' ? '________，疑是地上霜。（李白《静夜思》）' : '四书是指：',
        options:
          quizType !== 'quotes'
            ? [
                '《大学》《中庸》《论语》《孟子》',
                '《诗经》《尚书》《礼记》《周易》',
                '《春秋》《左传》《公羊传》《谷梁传》',
                '《道德经》《庄子》《列子》《文子》',
              ]
            : null,
        fillIn: quizType === 'quotes',
        answer: quizType === 'quotes' ? '床前明月光' : 0,
        userAnswer: quizType === 'quotes' ? '床前明月光' : 0,
        isCorrect: true,
        explanation:
          quizType === 'quotes'
            ? '完整诗句为"床前明月光，疑是地上霜"，出自唐代诗人李白的《静夜思》，描绘了月光洒在床前，诗人误以为是地上的霜的情景。'
            : '四书是指《大学》《中庸》《论语》《孟子》，是宋代理学家朱熹选定并注释的儒家经典著作。',
        source: quizType === 'quotes' ? '《静夜思》' : '儒家经典',
        difficulty: '入门级',
        knowledgePoints: quizType === 'quotes' ? ['唐诗', '李白'] : ['四书五经', '儒家经典'],
      },
      {
        id: 102,
        question:
          quizType === 'quotes'
            ? '小荷才露尖尖角，_______。（杨万里《小池》）'
            : quizType === 'figures'
              ? '"负荆请罪"的主人公是：'
              : '《道德经》的作者是：',
        options:
          quizType !== 'quotes'
            ? quizType === 'figures'
              ? ['廉颇', '蔺相如', '李牧', '白起']
              : ['老子', '庄子', '孔子', '孟子']
            : null,
        fillIn: quizType === 'quotes',
        answer: quizType === 'quotes' ? '早有蜻蜓立上头' : 0,
        userAnswer: quizType === 'quotes' ? '早有蜻蜓立上头' : 2,
        isCorrect: quizType !== 'figures',
        explanation:
          quizType === 'quotes'
            ? '完整诗句为"小荷才露尖尖角，早有蜻蜓立上头"，出自南宋诗人杨万里的《小池》，描绘了初夏小池塘中的生机勃勃景象。'
            : quizType === 'figures'
              ? '"负荆请罪"典故出自《史记·廉颇蔺相如列传》，廉颇因误会而怨恨蔺相如，后知道蔺相如以国家利益为重而不与自己计较，感到惭愧，于是背着荆条去向蔺相如请罪。'
              : '《道德经》又称《老子》，是道家学派创始人老子（李耳）的著作，共五千余字，分为"道经"和"德经"两部分。',
        source:
          quizType === 'quotes'
            ? '《小池》'
            : quizType === 'figures'
              ? '《史记·廉颇蔺相如列传》'
              : '道家经典',
        difficulty: '普通级',
        knowledgePoints:
          quizType === 'quotes'
            ? ['宋诗', '杨万里']
            : quizType === 'figures'
              ? ['历史典故', '战国人物']
              : ['道家经典', '老子'],
      },
    ],
  }
}

// 获取测验类型
const getQuizType = computed(() => {
  if (resultId.value.includes('daily')) return 'daily'
  if (resultId.value.includes('challenge')) return 'challenge'
  if (resultId.value.includes('classics')) return 'classics'
  if (resultId.value.includes('quotes')) return 'quotes'
  if (resultId.value.includes('figures')) return 'figures'
  if (resultId.value.includes('culture')) return 'culture'
  return 'classics'
})

// 组件挂载
onMounted(() => {
  fetchResultData()
})
</script>

<template>
  <div class="quiz-result-view">
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载结果中...</p>
    </div>

    <div v-else class="result-container">
      <QuizResult :results="resultData" :quiz-type="getQuizType" />
    </div>
  </div>
</template>

<style scoped>
.quiz-result-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #8a1e1e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.result-container {
  margin-bottom: 40px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .quiz-result-view {
    padding: 15px;
  }
}
</style>
