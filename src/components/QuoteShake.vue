<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 定义属性
defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

// 定义事件
const emit = defineEmits(['close'])

// 名句数据
const quotes = [
  {
    content: '学而时习之，不亦说乎？有朋自远方来，不亦乐乎？人不知而不愠，不亦君子乎？',
    source: '《论语·学而》',
    author: '孔子',
    translation:
      '学习知识并且不断复习，不也是很愉快的事情吗？有朋友从远方来访，不也是很令人高兴的事情吗？别人不了解我，我却不恼怒，不也是有修养的人吗？',
  },
  {
    content: '温故而知新，可以为师矣。',
    source: '《论语·为政》',
    author: '孔子',
    translation: '温习旧知识而得到新领悟，这样的人可以当老师了。',
  },
  {
    content: '三人行，必有我师焉。择其善者而从之，其不善者而改之。',
    source: '《论语·述而》',
    author: '孔子',
    translation:
      '几个人一起走，其中必定有可以成为我的老师的人。选择其中好的方面向他学习，发现其中不好的方面就在自己身上改正。',
  },
  {
    content: '工欲善其事，必先利其器。',
    source: '《论语·卫灵公》',
    author: '孔子',
    translation: '工匠要做好工作，一定要先把工具准备好。',
  },
  {
    content: '知之者不如好之者，好之者不如乐之者。',
    source: '《论语·雍也》',
    author: '孔子',
    translation: '知道的人不如喜欢的人，喜欢的人不如以此为乐的人。',
  },
  {
    content: '己所不欲，勿施于人。',
    source: '《论语·颜渊》',
    author: '孔子',
    translation: '自己不希望得到的，不要强加给别人。',
  },
  {
    content: '君子坦荡荡，小人长戚戚。',
    source: '《论语·述而》',
    author: '孔子',
    translation: '有修养的人内心坦荡，心胸开阔；无修养的人则常常忧愁烦恼。',
  },
  {
    content: '见贤思齐焉，见不贤而内自省也。',
    source: '《论语·里仁》',
    author: '孔子',
    translation: '看见贤人就想着向他看齐，看见不贤的人就反省自己是否有同样的缺点。',
  },
  {
    content: '不患人之不己知，患不知人也。',
    source: '《论语·学而》',
    author: '孔子',
    translation: '不担心别人不了解自己，只担心自己不了解别人。',
  },
  {
    content: '人而无信，不知其可也。',
    source: '《论语·为政》',
    author: '孔子',
    translation: '一个人如果不讲信用，我不知道他还能做什么。',
  },
  {
    content: '千里之行，始于足下。',
    source: '《老子·道德经》',
    author: '老子',
    translation: '千里的远行，是从脚下第一步开始的。',
  },
  {
    content: '人无远虑，必有近忧。',
    source: '《论语·卫灵公》',
    author: '孔子',
    translation: '人如果没有长远的打算，就一定会有眼前的忧患。',
  },
  {
    content: '逝者如斯夫，不舍昼夜。',
    source: '《论语·子罕》',
    author: '孔子',
    translation: '时光如同这河水一样，日夜不停地流逝。',
  },
  {
    content: '仁者爱人，有礼者敬人。爱人者人恒爱之，敬人者人恒敬之。',
    source: '《孟子·离娄上》',
    author: '孟子',
    translation:
      '仁爱的人爱护别人，有礼的人尊敬别人。爱护别人的人，别人也常常爱护他；尊敬别人的人，别人也常常尊敬他。',
  },
  {
    content: '老吾老，以及人之老；幼吾幼，以及人之幼。',
    source: '《孟子·梁惠王上》',
    author: '孟子',
    translation: '尊敬自己的长辈，推广到尊敬别人的长辈；爱护自己的晚辈，推广到爱护别人的晚辈。',
  },
]

// 当前展示的名句
const currentQuote = ref(quotes[0])

// 是否显示翻译
const showTranslation = ref(false)

// 选择随机名句
const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length)
  currentQuote.value = quotes[randomIndex]
  showTranslation.value = false
}

// 关闭弹窗
const closeQuoteModal = () => {
  emit('close')
}

// 切换翻译显示
const toggleTranslation = () => {
  showTranslation.value = !showTranslation.value
}

// 复制名句
const copyQuote = () => {
  const textToCopy = `${currentQuote.value.content}\n——${currentQuote.value.author}《${currentQuote.value.source}》`
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      alert('名句已复制到剪贴板')
    })
    .catch((err) => {
      console.error('复制失败:', err)
      alert('复制失败，请手动复制')
    })
}

// 分享名句
const shareQuote = () => {
  if (navigator.share) {
    navigator
      .share({
        title: '国学经典名句',
        text: `${currentQuote.value.content}\n——${currentQuote.value.author}《${currentQuote.value.source}》`,
        url: window.location.href,
      })
      .catch((err) => {
        console.error('分享失败:', err)
      })
  } else {
    alert('您的浏览器不支持分享功能')
  }
}

// 组件挂载时获取随机名句
onMounted(() => {
  getRandomQuote()
})
</script>

<template>
  <transition name="fade">
    <div v-if="visible" class="quote-shake-modal">
      <div class="quote-shake-content">
        <div class="quote-header">
          <h3>国学经典名句</h3>
          <button class="close-button" @click="closeQuoteModal">×</button>
        </div>

        <div class="quote-body">
          <div class="quote-content">
            {{ currentQuote.content }}
          </div>

          <div class="quote-source">——{{ currentQuote.author }}《{{ currentQuote.source }}》</div>

          <transition name="slide-fade">
            <div v-if="showTranslation" class="quote-translation">
              {{ currentQuote.translation }}
            </div>
          </transition>
        </div>

        <div class="quote-actions">
          <button class="action-button translation-button" @click="toggleTranslation">
            {{ showTranslation ? '隐藏译文' : '显示译文' }}
          </button>
          <button class="action-button refresh-button" @click="getRandomQuote">换一句</button>
          <button class="action-button copy-button" @click="copyQuote">复制</button>
          <button class="action-button share-button" @click="shareQuote">分享</button>
        </div>

        <div class="quote-tip">
          <div class="shake-icon"></div>
          <p>摇一摇手机，随时获取新的名句</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.quote-shake-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.quote-shake-content {
  width: 90%;
  max-width: 400px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.quote-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  background-color: #842029;
  color: white;
}

.quote-header h3 {
  margin: 0;
  font-size: 18px;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.quote-body {
  padding: 20px;
  background-color: #f9f5f2;
}

.quote-content {
  font-size: 18px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 15px;
  font-family: 'STKaiti', 'KaiTi', serif;
  text-align: justify;
}

.quote-source {
  text-align: right;
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
}

.quote-translation {
  background-color: #fff;
  padding: 15px;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  border-left: 3px solid #842029;
  margin-top: 15px;
}

.quote-actions {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  border-top: 1px solid #eee;
  background-color: #fff;
}

.action-button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.translation-button {
  background-color: #f0e6dc;
  color: #842029;
}

.refresh-button {
  background-color: #842029;
  color: white;
}

.copy-button,
.share-button {
  background-color: #f0f0f0;
  color: #333;
}

.action-button:hover {
  opacity: 0.9;
}

.quote-tip {
  padding: 15px;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #999;
  border-top: 1px dashed #eee;
}

.shake-icon {
  width: 16px;
  height: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23999' d='M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z' /%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  margin-right: 5px;
  animation: shake 2s infinite;
}

@keyframes shake {
  0%,
  100% {
    transform: rotate(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: rotate(-10deg);
  }
  20%,
  40%,
  60%,
  80% {
    transform: rotate(10deg);
  }
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* 暗黑模式支持 */
@media (prefers-color-scheme: dark) {
  .quote-shake-content {
    background-color: #333;
  }

  .quote-header {
    border-bottom-color: #444;
  }

  .quote-body {
    background-color: #222;
  }

  .quote-content {
    color: #e0e0e0;
  }

  .quote-source {
    color: #aaa;
  }

  .quote-translation {
    background-color: #2a2a2a;
    color: #bbb;
  }

  .quote-actions {
    border-top-color: #444;
    background-color: #333;
  }

  .translation-button {
    background-color: #503e3a;
    color: #ff9b9f;
  }

  .copy-button,
  .share-button {
    background-color: #444;
    color: #ddd;
  }

  .quote-tip {
    background-color: #2a2a2a;
    color: #888;
    border-top-color: #444;
  }
}

/* 移动端优化 */
@media (max-width: 480px) {
  .quote-shake-content {
    width: 95%;
  }

  .quote-content {
    font-size: 16px;
  }

  .action-button {
    padding: 10px;
    font-size: 13px;
  }
}
</style>
