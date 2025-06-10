<script setup lang="ts">
import { ref, computed, onMounted, defineProps, defineEmits } from 'vue'

const props = defineProps({
  // 问题数据
  question: {
    type: Object,
    required: true,
  },
  // 问题索引
  index: {
    type: Number,
    required: true,
  },
  // 总问题数
  total: {
    type: Number,
    required: true,
  },
  // 是否处于解析模式
  isReviewMode: {
    type: Boolean,
    default: false,
  },
  // 计时器剩余时间（秒）
  timeRemaining: {
    type: Number,
    default: 0,
  },
  // 用户选择的答案
  userAnswer: {
    type: [Number, Array, String],
    default: null,
  },
})

const emit = defineEmits(['answer', 'next', 'previous'])

// 答案选择
const selectedOption = ref(props.userAnswer)
const isAnswered = ref(false)
const isCorrect = ref(false)
const showExplanation = ref(props.isReviewMode)
const animateCorrect = ref(false)
const animateIncorrect = ref(false)

// 填空题的值
const fillInValue = ref(props.userAnswer || '')

// 判断问题类型
const questionType = computed(() => {
  if (props.question.type) return props.question.type

  // 默认逻辑判断问题类型
  if (Array.isArray(props.question.options) && props.question.options.length > 0) {
    // 如果有multiple属性且为true，则为多选题
    if (props.question.multiple) return 'multiple'
    // 否则为单选题
    return 'single'
  }
  // 如果有fillIn属性且为true，则为填空题
  if (props.question.fillIn) return 'fill-in'

  // 默认为单选题
  return 'single'
})

// 计算是否有图片
const hasImage = computed(() => {
  return props.question.image && props.question.image.trim() !== ''
})

// 选择选项
const selectOption = (optionIndex) => {
  if (isAnswered.value && !props.isReviewMode) return

  if (questionType.value === 'multiple') {
    // 多选逻辑
    if (!Array.isArray(selectedOption.value)) {
      selectedOption.value = []
    }

    const index = selectedOption.value.indexOf(optionIndex)
    if (index >= 0) {
      selectedOption.value.splice(index, 1)
    } else {
      selectedOption.value.push(optionIndex)
    }
  } else {
    // 单选逻辑
    selectedOption.value = optionIndex
  }
}

// 检查选项是否被选中
const isSelected = (optionIndex) => {
  if (questionType.value === 'multiple') {
    return Array.isArray(selectedOption.value) && selectedOption.value.includes(optionIndex)
  }

  return selectedOption.value === optionIndex
}

// 提交答案
const submitAnswer = () => {
  if (isAnswered.value && !props.isReviewMode) return

  let answer
  if (questionType.value === 'fill-in') {
    answer = fillInValue.value
  } else {
    answer = selectedOption.value
  }

  // 检查答案是否正确
  if (questionType.value === 'multiple') {
    const correctAnswer = props.question.answer

    // 多选题：检查所有正确选项是否都被选中，且没有选错的选项
    if (Array.isArray(answer) && Array.isArray(correctAnswer)) {
      // 检查长度是否相等
      if (answer.length === correctAnswer.length) {
        // 检查所有选项是否都正确
        isCorrect.value =
          correctAnswer.every((option) => answer.includes(option)) &&
          answer.every((option) => correctAnswer.includes(option))
      } else {
        isCorrect.value = false
      }
    } else {
      isCorrect.value = false
    }
  } else if (questionType.value === 'fill-in') {
    // 填空题：检查答案是否匹配（支持多个正确答案）
    if (Array.isArray(props.question.answer)) {
      isCorrect.value = props.question.answer.some(
        (ans) => ans.toLowerCase() === answer.toLowerCase().trim(),
      )
    } else {
      isCorrect.value = props.question.answer.toLowerCase() === answer.toLowerCase().trim()
    }
  } else {
    // 单选题：直接比较答案
    isCorrect.value = answer === props.question.answer
  }

  isAnswered.value = true
  showExplanation.value = true

  // 动画效果
  if (isCorrect.value) {
    animateCorrect.value = true
    setTimeout(() => {
      animateCorrect.value = false
    }, 1000)
  } else {
    animateIncorrect.value = true
    setTimeout(() => {
      animateIncorrect.value = false
    }, 1000)
  }

  // 向父组件发送答案
  emit('answer', {
    questionId: props.question.id,
    userAnswer: answer,
    isCorrect: isCorrect.value,
  })
}

// 下一题
const nextQuestion = () => {
  emit('next')
}

// 上一题
const previousQuestion = () => {
  emit('previous')
}

// 格式化时间
const formattedTime = computed(() => {
  if (props.timeRemaining <= 0) return '00:00'

  const minutes = Math.floor(props.timeRemaining / 60)
  const seconds = props.timeRemaining % 60

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 时间进度
const timeProgress = computed(() => {
  if (!props.question.timeLimit) return 100
  return (props.timeRemaining / props.question.timeLimit) * 100
})

// 检查是否时间不足
const isTimeRunningOut = computed(() => {
  if (!props.question.timeLimit) return false
  return props.timeRemaining <= 10
})

// 在组件挂载时，如果是回顾模式，设置答案状态
onMounted(() => {
  if (props.isReviewMode) {
    isAnswered.value = true
    selectedOption.value = props.userAnswer

    // 检查答案是否正确
    if (questionType.value === 'multiple') {
      const correctAnswer = props.question.answer

      if (Array.isArray(props.userAnswer) && Array.isArray(correctAnswer)) {
        isCorrect.value =
          correctAnswer.every((option) => props.userAnswer.includes(option)) &&
          props.userAnswer.every((option) => correctAnswer.includes(option))
      }
    } else if (questionType.value === 'fill-in') {
      if (Array.isArray(props.question.answer)) {
        isCorrect.value = props.question.answer.some(
          (ans) => ans.toLowerCase() === props.userAnswer.toLowerCase().trim(),
        )
      } else {
        isCorrect.value =
          props.question.answer.toLowerCase() === props.userAnswer.toLowerCase().trim()
      }
    } else {
      isCorrect.value = props.userAnswer === props.question.answer
    }

    fillInValue.value = props.userAnswer || ''
  }
})
</script>

<template>
  <div
    class="quiz-question"
    :class="{
      answered: isAnswered,
      correct: isCorrect && isAnswered,
      incorrect: !isCorrect && isAnswered,
    }"
  >
    <div class="question-header">
      <div class="question-progress">
        <span class="question-number">{{ index + 1 }}/{{ total }}</span>
        <div class="progress-bar">
          <div class="progress-track"></div>
          <div class="progress-fill" :style="{ width: `${((index + 1) / total) * 100}%` }"></div>
        </div>
      </div>

      <div class="timer" v-if="timeRemaining > 0" :class="{ 'running-out': isTimeRunningOut }">
        <div class="timer-icon">⏱️</div>
        <div class="timer-text">{{ formattedTime }}</div>
        <div class="timer-progress">
          <div class="timer-track"></div>
          <div class="timer-fill" :style="{ width: `${timeProgress}%` }"></div>
        </div>
      </div>
    </div>

    <div class="question-content">
      <div class="question-text" :class="{ 'with-image': hasImage }">
        <h3 v-html="question.question"></h3>
        <div class="question-source" v-if="question.source">——《{{ question.source }}》</div>
      </div>

      <div class="question-image" v-if="hasImage">
        <img :src="question.image" :alt="question.question" />
      </div>
    </div>

    <!-- 单选题 -->
    <div class="options-container" v-if="questionType === 'single'">
      <div
        v-for="(option, index) in question.options"
        :key="index"
        class="option"
        :class="{
          selected: isSelected(index),
          'correct-option': isAnswered && question.answer === index,
          'incorrect-option': isAnswered && isSelected(index) && question.answer !== index,
          'animate-correct': animateCorrect && question.answer === index,
          'animate-incorrect': animateIncorrect && isSelected(index) && question.answer !== index,
        }"
        @click="selectOption(index)"
      >
        <div class="option-marker">{{ ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'][index] }}</div>
        <div class="option-text" v-html="option"></div>
        <div class="option-status">
          <div class="correct-icon" v-if="isAnswered && question.answer === index">✓</div>
          <div
            class="incorrect-icon"
            v-if="isAnswered && isSelected(index) && question.answer !== index"
          >
            ✗
          </div>
        </div>
      </div>
    </div>

    <!-- 多选题 -->
    <div class="options-container" v-if="questionType === 'multiple'">
      <div class="multiple-choice-hint">【多选题】</div>
      <div
        v-for="(option, index) in question.options"
        :key="index"
        class="option multiple"
        :class="{
          selected: isSelected(index),
          'correct-option': isAnswered && question.answer.includes(index),
          'incorrect-option': isAnswered && isSelected(index) && !question.answer.includes(index),
          'animate-correct': animateCorrect && question.answer.includes(index),
          'animate-incorrect':
            animateIncorrect && isSelected(index) && !question.answer.includes(index),
        }"
        @click="selectOption(index)"
      >
        <div class="option-marker">{{ ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'][index] }}</div>
        <div class="option-text" v-html="option"></div>
        <div class="option-status">
          <div class="correct-icon" v-if="isAnswered && question.answer.includes(index)">✓</div>
          <div
            class="incorrect-icon"
            v-if="isAnswered && isSelected(index) && !question.answer.includes(index)"
          >
            ✗
          </div>
        </div>
      </div>
    </div>

    <!-- 填空题 -->
    <div class="fill-in-container" v-if="questionType === 'fill-in'">
      <div class="fill-in-hint">【填空题】</div>
      <div class="fill-in-input-container">
        <input
          type="text"
          class="fill-in-input"
          v-model="fillInValue"
          placeholder="请输入答案"
          :disabled="isAnswered && !isReviewMode"
          @keyup.enter="submitAnswer"
        />
      </div>

      <div class="fill-in-result" v-if="isAnswered">
        <div class="correct-answer" v-if="isCorrect">
          <div class="correct-icon">✓</div>
          <div class="correct-text">回答正确</div>
        </div>
        <div class="incorrect-answer" v-else>
          <div class="incorrect-icon">✗</div>
          <div class="incorrect-text">
            正确答案：
            <span v-if="Array.isArray(question.answer)">
              {{ question.answer.join(' 或 ') }}
            </span>
            <span v-else>
              {{ question.answer }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 问题解析 -->
    <div class="explanation-container" v-if="showExplanation && question.explanation">
      <div class="explanation-header">
        <div class="explanation-icon">📝</div>
        <div class="explanation-title">解析</div>
      </div>
      <div class="explanation-content" v-html="question.explanation"></div>

      <div class="knowledge-points" v-if="question.knowledgePoints">
        <div class="knowledge-points-header">知识点</div>
        <div class="knowledge-points-content">
          <div
            v-for="(point, index) in question.knowledgePoints"
            :key="index"
            class="knowledge-point"
          >
            {{ point }}
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="actions-container">
      <button class="action-button previous" v-if="index > 0" @click="previousQuestion">
        <span class="button-icon">←</span>
        <span class="button-text">上一题</span>
      </button>

      <button
        v-if="!isAnswered && !isReviewMode"
        class="action-button submit"
        @click="submitAnswer"
        :disabled="
          (questionType === 'single' && selectedOption === null) ||
          (questionType === 'multiple' &&
            (!Array.isArray(selectedOption) || selectedOption.length === 0)) ||
          (questionType === 'fill-in' && fillInValue.trim() === '')
        "
      >
        提交答案
      </button>

      <button v-if="isAnswered || isReviewMode" class="action-button next" @click="nextQuestion">
        <span class="button-text">{{ index === total - 1 ? '完成测验' : '下一题' }}</span>
        <span class="button-icon">→</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.quiz-question {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  padding: 30px;
  margin-bottom: 20px;
  border: 1px solid #eee;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.quiz-question.answered {
  border-left: 4px solid #ccc;
}

.quiz-question.correct {
  border-left: 4px solid #4caf50;
}

.quiz-question.incorrect {
  border-left: 4px solid #f44336;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.question-progress {
  display: flex;
  align-items: center;
}

.question-number {
  font-size: 16px;
  color: #666;
  margin-right: 15px;
  min-width: 50px;
}

.progress-bar {
  width: 150px;
  height: 6px;
  background-color: #eee;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.progress-track {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #eee;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #8a1e1e;
  transition: width 0.3s ease;
}

.timer {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
}

.timer.running-out {
  animation: pulse 1s infinite;
}

.timer-icon {
  margin-right: 8px;
}

.timer-text {
  font-weight: bold;
  color: #333;
  margin-right: 10px;
}

.timer-progress {
  width: 60px;
  height: 4px;
  background-color: #eee;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.timer-track {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #eee;
}

.timer-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #8a1e1e;
  transition: width 1s linear;
}

.question-content {
  display: flex;
  margin-bottom: 30px;
}

.question-text {
  flex: 1;
}

.question-text.with-image {
  margin-right: 20px;
  max-width: 60%;
}

.question-text h3 {
  font-size: 20px;
  color: #333;
  line-height: 1.6;
  margin: 0 0 15px 0;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.question-source {
  font-style: italic;
  color: #888;
  text-align: right;
  margin-top: 10px;
}

.question-image {
  width: 40%;
  max-width: 300px;
  border-radius: 8px;
  overflow: hidden;
}

.question-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.options-container {
  margin-bottom: 30px;
}

.multiple-choice-hint,
.fill-in-hint {
  font-size: 14px;
  color: #8a1e1e;
  margin-bottom: 10px;
  font-weight: bold;
}

.option {
  display: flex;
  align-items: flex-start;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.option:hover {
  background-color: #f9f5f2;
  border-color: #e0d5cc;
}

.option.selected {
  background-color: #fff8e1;
  border-color: #ffe082;
}

.option.correct-option {
  background-color: #e8f5e9;
  border-color: #a5d6a7;
}

.option.incorrect-option {
  background-color: #ffebee;
  border-color: #ef9a9a;
}

.option-marker {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #666;
  margin-right: 15px;
  flex-shrink: 0;
}

.option.selected .option-marker {
  background-color: #ffe082;
  color: #8a1e1e;
}

.option.correct-option .option-marker {
  background-color: #a5d6a7;
  color: #2e7d32;
}

.option.incorrect-option .option-marker {
  background-color: #ef9a9a;
  color: #c62828;
}

.option-text {
  flex: 1;
  font-size: 16px;
  color: #333;
  line-height: 1.5;
  padding-top: 4px;
}

.option-status {
  margin-left: 15px;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.correct-icon {
  color: #4caf50;
  font-size: 20px;
  font-weight: bold;
}

.incorrect-icon {
  color: #f44336;
  font-size: 20px;
  font-weight: bold;
}

.option.multiple {
  padding-left: 15px;
}

.option.multiple .option-marker {
  border-radius: 4px;
}

.fill-in-container {
  margin-bottom: 30px;
}

.fill-in-input-container {
  margin: 20px 0;
}

.fill-in-input {
  width: 100%;
  padding: 12px 15px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.fill-in-input:focus {
  outline: none;
  border-color: #8a1e1e;
  box-shadow: 0 0 0 2px rgba(138, 30, 30, 0.1);
}

.fill-in-input:disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
}

.fill-in-result {
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
}

.correct-answer {
  display: flex;
  align-items: center;
  color: #4caf50;
}

.incorrect-answer {
  display: flex;
  align-items: center;
  color: #f44336;
}

.incorrect-text {
  margin-left: 10px;
}

.explanation-container {
  background-color: #f9f5f2;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  border-left: 3px solid #8a1e1e;
}

.explanation-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.explanation-icon {
  margin-right: 10px;
  font-size: 20px;
}

.explanation-title {
  font-size: 18px;
  font-weight: bold;
  color: #8a1e1e;
}

.explanation-content {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

.knowledge-points {
  margin-top: 20px;
  border-top: 1px dashed #ddd;
  padding-top: 15px;
}

.knowledge-points-header {
  font-weight: bold;
  margin-bottom: 10px;
  color: #666;
}

.knowledge-points-content {
  display: flex;
  flex-wrap: wrap;
}

.knowledge-point {
  background-color: #eee;
  color: #666;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 15px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.actions-container {
  display: flex;
  justify-content: space-between;
}

.action-button {
  padding: 12px 25px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-icon {
  margin: 0 5px;
}

.action-button.previous {
  background-color: #f0f0f0;
  color: #666;
}

.action-button.previous:hover {
  background-color: #e0e0e0;
}

.action-button.next {
  background-color: #8a1e1e;
  color: white;
  margin-left: auto;
}

.action-button.next:hover {
  background-color: #6e1818;
}

.action-button.submit {
  background-color: #8a1e1e;
  color: white;
  margin: 0 auto;
}

.action-button.submit:hover {
  background-color: #6e1818;
}

/* 动画效果 */
@keyframes pulse {
  0% {
    background-color: #f9f9f9;
  }
  50% {
    background-color: #ffebee;
  }
  100% {
    background-color: #f9f9f9;
  }
}

@keyframes correct-animation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes incorrect-animation {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0);
  }
}

.animate-correct {
  animation: correct-animation 0.5s;
}

.animate-incorrect {
  animation: incorrect-animation 0.5s;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .quiz-question {
    padding: 20px;
  }

  .question-content {
    flex-direction: column;
  }

  .question-text.with-image {
    margin-right: 0;
    max-width: 100%;
    margin-bottom: 20px;
  }

  .question-image {
    width: 100%;
    max-width: 100%;
  }

  .timer {
    padding: 5px 10px;
  }

  .timer-progress {
    display: none;
  }

  .option {
    padding: 12px;
  }

  .explanation-container {
    padding: 15px;
  }

  .action-button {
    padding: 10px 15px;
    font-size: 14px;
  }
}
</style>
