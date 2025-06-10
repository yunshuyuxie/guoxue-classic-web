<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QuizQuestion from '../components/QuizQuestion.vue'

const route = useRoute()
const router = useRouter()

const quizType = computed(() => route.params.type as string)
const isDaily = computed(() => quizType.value === 'daily')
const isChallenge = computed(() => quizType.value === 'challenge')

// 加载状态
const isLoading = ref(true)

// 测验标题
const quizTitle = computed(() => {
  if (isDaily.value) return '每日一题'
  if (isChallenge.value) return '进阶挑战'

  switch (quizType.value) {
    case 'classics':
      return '经典常识测验'
    case 'quotes':
      return '名句填空测验'
    case 'figures':
      return '人物典故测验'
    case 'culture':
      return '文化常识测验'
    default:
      return '国学知识测验'
  }
})

// 测验数据
const quizData = ref({
  id: '',
  title: '',
  description: '',
  questions: [],
  timeLimit: 0,
})

// 当前问题索引
const currentQuestionIndex = ref(0)

// 用户答案
const userAnswers = ref([])

// 计时器
const timer = ref(null)
const timeRemaining = ref(0)
const totalTimeSpent = ref(0)

// 测验是否结束
const isQuizCompleted = ref(false)

// 获取测验数据
const fetchQuizData = () => {
  // 模拟API请求
  setTimeout(() => {
    if (isDaily.value) {
      quizData.value = {
        id: 'daily-' + new Date().toISOString().split('T')[0],
        title: '每日一题',
        description: '测试今日知识要点',
        timeLimit: 0,
        questions: [
          {
            id: 1001,
            question: '《论语》"学而时习之，不亦说乎"中的"说"字应解释为：',
            options: ['悦', '阅', '说', '税'],
            answer: 0,
            explanation:
              '"说"通"悦"，表示高兴、愉快的意思。这句话的意思是"学习知识并且经常温习它，不也是很快乐的事情吗？"',
            source: '《论语·学而》',
            difficulty: '入门级',
            knowledgePoints: ['《论语》', '古文字通假'],
          },
        ],
      }
    } else if (isChallenge.value) {
      // 创建挑战模式测验
      generateChallengeQuiz()
    } else {
      // 根据测验类型生成测验数据
      generateQuizByType()
    }

    // 初始化用户答案数组
    userAnswers.value = Array(quizData.value.questions.length).fill(null)

    // 如果有时间限制，启动计时器
    if (quizData.value.timeLimit > 0) {
      timeRemaining.value = quizData.value.timeLimit
      startTimer()
    }

    isLoading.value = false
  }, 1000)
}

// 根据类型生成测验
const generateQuizByType = () => {
  // 这里使用模拟数据，实际应从API获取
  const types = {
    classics: {
      title: '经典常识测验',
      description: '测试您对四书五经等经典著作的了解',
      questions: [
        {
          id: 101,
          question: '四书是指：',
          options: [
            '《大学》《中庸》《论语》《孟子》',
            '《诗经》《尚书》《礼记》《周易》',
            '《春秋》《左传》《公羊传》《谷梁传》',
            '《道德经》《庄子》《列子》《文子》',
          ],
          answer: 0,
          explanation:
            '四书是指《大学》《中庸》《论语》《孟子》，是宋代理学家朱熹选定并注释的儒家经典著作。',
          source: '儒家经典',
          difficulty: '入门级',
          knowledgePoints: ['四书五经', '儒家经典'],
        },
        {
          id: 102,
          question: '《道德经》的作者是：',
          options: ['老子', '庄子', '孔子', '孟子'],
          answer: 0,
          explanation:
            '《道德经》又称《老子》，是道家学派创始人老子（李耳）的著作，共五千余字，分为"道经"和"德经"两部分。',
          source: '道家经典',
          difficulty: '入门级',
          knowledgePoints: ['道家经典', '老子'],
        },
        {
          id: 103,
          question: '下列哪部作品不属于"史记五大名篇"？',
          options: ['项羽本纪', '廉颇蔺相如列传', '屈原贾生列传', '孙子兵法'],
          answer: 3,
          explanation:
            '《史记》五大名篇通常指《项羽本纪》《廉颇蔺相如列传》《屈原贾生列传》《陈涉世家》《淮阴侯列传》。《孙子兵法》是著名兵法，非《史记》中的篇章。',
          source: '《史记》',
          difficulty: '普通级',
          knowledgePoints: ['史记', '古代文学作品'],
        },
      ],
    },
    quotes: {
      title: '名句填空测验',
      description: '完成古诗文名句中的空缺部分',
      questions: [
        {
          id: 201,
          question: '会当凌绝顶，_______。（杜甫《望岳》）',
          fillIn: true,
          answer: '一览众山小',
          explanation:
            '完整诗句为"会当凌绝顶，一览众山小"，出自唐代诗人杜甫的《望岳》，表达了诗人登上泰山顶峰，俯视群山的壮阔情景和豪迈气概。',
          source: '《望岳》',
          difficulty: '入门级',
          knowledgePoints: ['唐诗', '杜甫'],
        },
        {
          id: 202,
          question: '________，疑是地上霜。（李白《静夜思》）',
          fillIn: true,
          answer: '床前明月光',
          explanation:
            '完整诗句为"床前明月光，疑是地上霜"，出自唐代诗人李白的《静夜思》，描绘了月光洒在床前，诗人误以为是地上的霜的情景。',
          source: '《静夜思》',
          difficulty: '入门级',
          knowledgePoints: ['唐诗', '李白'],
        },
        {
          id: 203,
          question: '小荷才露尖尖角，_______。（杨万里《小池》）',
          fillIn: true,
          answer: ['早有蜻蜓立上头', '早有青蜓立上头'],
          explanation:
            '完整诗句为"小荷才露尖尖角，早有蜻蜓立上头"，出自南宋诗人杨万里的《小池》，描绘了初夏小池塘中的生机勃勃景象。',
          source: '《小池》',
          difficulty: '普通级',
          knowledgePoints: ['宋诗', '杨万里'],
        },
      ],
    },
    figures: {
      title: '人物典故测验',
      description: '了解古代名人及其相关历史典故',
      questions: [
        {
          id: 301,
          question: '"负荆请罪"的主人公是：',
          options: ['廉颇', '蔺相如', '李牧', '白起'],
          answer: 0,
          explanation:
            '"负荆请罪"典故出自《史记·廉颇蔺相如列传》，廉颇因误会而怨恨蔺相如，后知道蔺相如以国家利益为重而不与自己计较，感到惭愧，于是背着荆条去向蔺相如请罪。',
          source: '《史记·廉颇蔺相如列传》',
          difficulty: '普通级',
          knowledgePoints: ['历史典故', '战国人物'],
        },
        {
          id: 302,
          question: '"东山再起"典故中的主人公是：',
          options: ['谢安', '范仲淹', '王羲之', '陶渊明'],
          answer: 0,
          explanation:
            '"东山再起"典故源于晋朝的谢安，他隐居会稽东山多年后重新出山辅佐朝政，后成为比喻失势之后重新恢复地位的成语。',
          source: '《晋书·谢安传》',
          difficulty: '普通级',
          knowledgePoints: ['历史典故', '晋代人物'],
        },
        {
          id: 303,
          question: '"望梅止渴"的故事与哪位历史人物有关？',
          options: ['曹操', '刘备', '孙权', '诸葛亮'],
          answer: 0,
          explanation:
            '"望梅止渴"典故出自《世说新语》，描述曹操率军行军时士兵口渴，曹操谎称前方有梅林，梅子酸甜可止渴，士兵闻言口中生津，暂时缓解了口渴。',
          source: '《世说新语》',
          difficulty: '普通级',
          knowledgePoints: ['历史典故', '三国人物'],
        },
      ],
    },
    culture: {
      title: '文化常识测验',
      description: '测试中国传统文化知识与风俗习惯',
      questions: [
        {
          id: 401,
          question: '下列哪个节日不属于中国传统四大节日？',
          options: ['春节', '端午节', '中秋节', '元宵节'],
          answer: 3,
          explanation:
            '中国传统的四大节日是指春节、清明节、端午节和中秋节。元宵节虽然也是重要传统节日，但不在四大节日之列。',
          source: '中国传统文化',
          difficulty: '入门级',
          knowledgePoints: ['传统节日', '民俗文化'],
        },
        {
          id: 402,
          question: '中国传统绘画中的"四君子"是指：',
          options: ['梅、兰、竹、菊', '松、竹、梅、兰', '松、竹、梅、菊', '松、柏、梅、兰'],
          answer: 0,
          explanation:
            '中国传统绘画中的"四君子"是指梅、兰、竹、菊四种植物，它们分别象征着坚韧不拔、高洁典雅、虚心有节和傲霜不屈的品格。',
          source: '中国传统文化',
          difficulty: '普通级',
          knowledgePoints: ['传统绘画', '文化象征'],
        },
        {
          id: 403,
          question: '下列哪个不是中国传统的五行学说中的五行之一？',
          options: ['金', '木', '水', '土', '气'],
          answer: 4,
          explanation:
            '中国传统的五行学说认为世界由金、木、水、火、土五种基本元素构成，并相互制约、相互生成。"气"不是五行之一。',
          source: '中国古代哲学',
          difficulty: '普通级',
          knowledgePoints: ['五行学说', '中国古代哲学'],
        },
      ],
    },
  }

  quizData.value = {
    id: quizType.value + '-' + Date.now(),
    ...types[quizType.value],
  }
}

// 生成挑战模式测验
const generateChallengeQuiz = () => {
  // 模拟挑战模式测验数据
  quizData.value = {
    id: 'challenge-' + Date.now(),
    title: '进阶挑战',
    description: '挑战多种难度的国学知识题目',
    timeLimit: 600, // 10分钟
    questions: [
      // 初级难度题目
      {
        id: 501,
        question: '《三字经》开头的句子是：',
        options: ['人之初，性本善', '天地玄黄', '子曰：学而时习之', '老吾老，以及人之老'],
        answer: 0,
        explanation:
          '《三字经》是中国古代蒙学读物，开头为"人之初，性本善。性相近，习相远。"表达了人性本善的儒家思想。',
        source: '《三字经》',
        difficulty: '入门级',
        timeLimit: 20,
        knowledgePoints: ['蒙学读物', '儒家思想'],
      },
      // 中级难度题目
      {
        id: 502,
        question: '下列哪位不是"唐宋八大家"之一？',
        options: ['韩愈', '柳宗元', '欧阳修', '李白'],
        answer: 3,
        explanation:
          '"唐宋八大家"是指唐宋时期八位散文大家，包括韩愈、柳宗元、欧阳修、苏洵、苏轼、苏辙、王安石和曾巩。李白虽然是著名诗人，但不在其中。',
        source: '文学史',
        difficulty: '普通级',
        timeLimit: 25,
        knowledgePoints: ['唐宋八大家', '文学史'],
      },
      // 高级难度题目
      {
        id: 503,
        question: '以下哪项不是朱熹理学思想的核心概念？',
        options: ['理气', '格物致知', '诚意正心', '无为而治'],
        answer: 3,
        explanation:
          '"无为而治"是道家思想的核心概念，而非朱熹理学的核心概念。朱熹理学强调"理气"、"格物致知"、"诚意正心"等概念，体现了儒家思想。',
        source: '宋明理学',
        difficulty: '进阶级',
        timeLimit: 30,
        knowledgePoints: ['宋明理学', '朱熹', '道家思想'],
      },
    ],
  }
}

// 开始计时器
const startTimer = () => {
  timer.value = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
      totalTimeSpent.value++
    } else {
      // 时间用尽，自动提交当前答案
      handleAnswer({
        questionId: getCurrentQuestion.value.id,
        userAnswer: userAnswers.value[currentQuestionIndex.value],
        isCorrect: false,
      })

      if (currentQuestionIndex.value < quizData.value.questions.length - 1) {
        nextQuestion()
      } else {
        completeQuiz()
      }
    }
  }, 1000)
}

// 停止计时器
const stopTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

// 获取当前问题
const getCurrentQuestion = computed(() => {
  if (!quizData.value.questions || quizData.value.questions.length === 0) {
    return null
  }

  return quizData.value.questions[currentQuestionIndex.value]
})

// 处理答案
const handleAnswer = (answerData) => {
  // 保存用户答案
  userAnswers.value[currentQuestionIndex.value] = answerData.userAnswer

  // 更新问题的正确性
  if (quizData.value.questions[currentQuestionIndex.value]) {
    quizData.value.questions[currentQuestionIndex.value].isCorrect = answerData.isCorrect
  }
}

// 下一题
const nextQuestion = () => {
  // 检查是否还有下一题
  if (currentQuestionIndex.value < quizData.value.questions.length - 1) {
    currentQuestionIndex.value++

    // 设置当前问题的时间限制
    if (isChallenge.value && getCurrentQuestion.value.timeLimit) {
      timeRemaining.value = getCurrentQuestion.value.timeLimit
    }
  } else {
    // 如果没有下一题，完成测验
    completeQuiz()
  }
}

// 上一题
const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

// 完成测验
const completeQuiz = () => {
  // 停止计时器
  stopTimer()

  // 标记测验为已完成
  isQuizCompleted.value = true

  // 计算结果
  const results = {
    id: quizData.value.id,
    title: quizData.value.title,
    completedAt: new Date(),
    timeSpent: totalTimeSpent.value,
    questions: quizData.value.questions,
    userAnswers: userAnswers.value,
  }

  // 如果是每日一题，保存完成状态
  if (isDaily.value) {
    const today = new Date().toISOString().split('T')[0]
    localStorage.setItem('lastDailyQuizDate', today)
  }

  // 导航到结果页面
  router.push({
    name: 'quiz-result',
    params: { id: quizData.value.id },
    state: { results },
  })
}

// 放弃测验
const abandonQuiz = () => {
  if (confirm('确定要放弃本次测验吗？已答题目将不会被保存。')) {
    stopTimer()
    router.push('/quiz')
  }
}

// 监听路由变化，防止用户意外离开
const beforeRouteLeave = (to, from, next) => {
  if (!isQuizCompleted.value && quizData.value.questions && quizData.value.questions.length > 0) {
    const answer = confirm('测验尚未完成，确定要离开吗？')
    if (answer) {
      stopTimer()
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
}

// 组件挂载
onMounted(() => {
  fetchQuizData()
})

// 组件卸载前
onBeforeUnmount(() => {
  stopTimer()
})
</script>

<template>
  <div class="quiz-play">
    <div class="quiz-header">
      <h1 class="quiz-title">{{ quizTitle }}</h1>
      <button class="abandon-button" @click="abandonQuiz">放弃测验</button>
    </div>

    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载题目中...</p>
    </div>

    <div v-else class="quiz-container">
      <QuizQuestion
        v-if="getCurrentQuestion"
        :question="getCurrentQuestion"
        :index="currentQuestionIndex"
        :total="quizData.questions.length"
        :time-remaining="timeRemaining"
        :user-answer="userAnswers[currentQuestionIndex]"
        @answer="handleAnswer"
        @next="nextQuestion"
        @previous="previousQuestion"
      />
    </div>
  </div>
</template>

<style scoped>
.quiz-play {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.quiz-title {
  font-size: 28px;
  color: #8a1e1e;
  margin: 0;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.abandon-button {
  background: none;
  border: none;
  color: #888;
  font-size: 14px;
  cursor: pointer;
  padding: 5px 10px;
}

.abandon-button:hover {
  color: #f44336;
  text-decoration: underline;
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

.quiz-container {
  margin-bottom: 40px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .quiz-play {
    padding: 15px;
  }

  .quiz-title {
    font-size: 22px;
  }
}
</style>
