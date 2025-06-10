<script setup lang="ts">
import { ref, computed } from 'vue'

// 定义类型
interface Quote {
  id: number
  content: string
  source: string
  translation: string
  interpretation: string
  application?: string
  tags: string[]
  likes: number
  isLiked?: boolean
}

// 当日精选名句
const dailyQuote = ref<Quote>({
  id: 0,
  content: '学而时习之，不亦说乎？有朋自远方来，不亦乐乎？人不知而不愠，不亦君子乎？',
  source: '《论语·学而》',
  translation:
    '学习了知识再不断温习和练习，不也很愉快吗？有志同道合的朋友从远方来，不也很快乐吗？别人不了解我，我却不恼怒，不也是有修养的君子吗？',
  interpretation:
    '这是《论语》的开篇，表达了孔子的三个观点：一是学习要勤加温习；二是志同道合的朋友相聚是人生乐事；三是君子应当宽厚待人，不计较他人的误解。',
  application:
    '在现代社会中，这句话提醒我们：持续学习的重要性、友谊的珍贵，以及宽容大度的处世态度。',
  tags: ['学习', '友谊', '修身'],
  likes: 258,
})

// 名句列表
const quotes = ref<Quote[]>([
  {
    id: 1,
    content: '学而时习之，不亦说乎？有朋自远方来，不亦乐乎？人不知而不愠，不亦君子乎？',
    source: '《论语·学而》',
    translation:
      '学习了知识再不断温习和练习，不也很愉快吗？有志同道合的朋友从远方来，不也很快乐吗？别人不了解我，我却不恼怒，不也是有修养的君子吗？',
    interpretation:
      '这是《论语》的开篇，表达了孔子的三个观点：一是学习要勤加温习；二是志同道合的朋友相聚是人生乐事；三是君子应当宽厚待人，不计较他人的误解。',
    tags: ['学习', '友谊', '修身'],
    likes: 258,
    isLiked: false,
  },
  {
    id: 2,
    content: '吾日三省吾身：为人谋而不忠乎？与朋友交而不信乎？传不习乎？',
    source: '《论语·学而》',
    translation:
      '我每天多次反省自己：替别人做事是否尽心尽力？与朋友交往是否诚实守信？老师传授的知识是否复习了？',
    interpretation:
      '这句话强调了自省的重要性，提出了三个重要的自省方向：对人忠诚、待人真诚和学习勤奋。',
    tags: ['修身', '为人处世', '学习'],
    likes: 216,
    isLiked: false,
  },
  {
    id: 3,
    content: '己所不欲，勿施于人。',
    source: '《论语·颜渊》',
    translation: '自己不想要的，不要强加给别人。',
    interpretation:
      '这是孔子提出的"仁"的核心思想之一，体现了推己及人、将心比心的处世原则，是为人处世的黄金法则。',
    tags: ['修身', '为人处世', '人生哲理'],
    likes: 325,
    isLiked: false,
  },
  {
    id: 4,
    content: '三人行，必有我师焉，择其善者而从之，其不善者而改之。',
    source: '《论语·述而》',
    translation:
      '几个人一起走，其中必定有可以成为我的老师的人，选择他们的优点来学习，看到他们的缺点就反省自己并改正。',
    interpretation:
      '这句话体现了孔子虚心好学的态度，告诉我们要善于向他人学习，取长补短，不断完善自己。',
    tags: ['学习', '修身'],
    likes: 302,
    isLiked: false,
  },
  {
    id: 5,
    content: '温故而知新，可以为师矣。',
    source: '《论语·为政》',
    translation: '温习旧知识而获得新领悟，就可以做老师了。',
    interpretation:
      '这句话强调学习需要复习旧知识并从中获得新的理解和启发，体现了学习的深入过程和教学的基本要求。',
    tags: ['学习'],
    likes: 189,
    isLiked: false,
  },
  {
    id: 6,
    content: '见贤思齐焉，见不贤而内自省也。',
    source: '《论语·里仁》',
    translation: '看到贤德的人就想着向他看齐，看到不贤德的人就自我反省。',
    interpretation:
      '这句话教导我们要学习贤者的优点，看到他人的缺点时也要反省自己是否有类似问题，从而不断完善自己。',
    tags: ['修身', '学习'],
    likes: 178,
    isLiked: false,
  },
])

// 标签云
const tags = ref([
  { name: '修身', count: 28 },
  { name: '齐家', count: 15 },
  { name: '治国', count: 12 },
  { name: '平天下', count: 8 },
  { name: '人生哲理', count: 32 },
  { name: '为人处世', count: 26 },
  { name: '学习', count: 24 },
  { name: '友谊', count: 18 },
  { name: '志向', count: 20 },
])

// 热门名句
const popularQuotes = ref([
  { id: 3, content: '己所不欲，勿施于人。', likes: 325 },
  { id: 4, content: '三人行，必有我师焉，择其善者而从之，其不善者而改之。', likes: 302 },
  { id: 1, content: '学而时习之，不亦说乎？', likes: 258 },
  { id: 9, content: '工欲善其事，必先利其器。', likes: 203 },
  { id: 12, content: '三军可夺帅也，匹夫不可夺志也。', likes: 198 },
])

// 筛选条件
const activeTag = ref('')
const searchQuery = ref('')

// 接龙游戏数据
const dragonGameActive = ref(false)
const lastCharacter = ref('')
const userInput = ref('')
const dragonChain = ref<{ content: string; source: string }[]>([])

// 分页
const currentPage = ref(1)
const pageSize = ref(6)

// 筛选后的名句
const filteredQuotes = computed(() => {
  return quotes.value.filter((quote) => {
    // 标签筛选
    const tagMatch = activeTag.value === '' || quote.tags.includes(activeTag.value)

    // 搜索筛选
    const searchMatch =
      searchQuery.value === '' ||
      quote.content.includes(searchQuery.value) ||
      quote.source.includes(searchQuery.value)

    return tagMatch && searchMatch
  })
})

// 当前页显示的名句
const currentPageQuotes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredQuotes.value.slice(start, start + pageSize.value)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredQuotes.value.length / pageSize.value)
})

// 处理标签点击
const handleTagClick = (tag: string) => {
  if (activeTag.value === tag) {
    activeTag.value = ''
  } else {
    activeTag.value = tag
  }
  currentPage.value = 1
}

// 点赞功能
const toggleLike = (quote: Quote) => {
  quote.isLiked = !quote.isLiked
  if (quote.isLiked) {
    quote.likes++
  } else {
    quote.likes--
  }
}

// 分享功能
const shareQuote = (quote: Quote) => {
  // 实际应用中可以接入分享API
  console.log('分享名句:', quote.content)
  // 显示分享成功提示
  alert('分享成功！')
}

// 处理接龙提交
const submitDragonInput = () => {
  if (!userInput.value) return

  // 检查是否符合接龙规则
  if (lastCharacter.value && !userInput.value.startsWith(lastCharacter.value)) {
    alert(`请输入以"${lastCharacter.value}"开头的名句`)
    return
  }

  // 添加到接龙链
  dragonChain.value.push({
    content: userInput.value,
    source: '用户接龙',
  })

  // 更新末尾字符
  lastCharacter.value = userInput.value.charAt(userInput.value.length - 1)
  userInput.value = ''
}

// 开始接龙游戏
const startDragonGame = () => {
  dragonGameActive.value = true
  dragonChain.value = [
    {
      content: dailyQuote.value.content,
      source: dailyQuote.value.source,
    },
  ]
  lastCharacter.value = dailyQuote.value.content.charAt(dailyQuote.value.content.length - 1)
  userInput.value = ''
}

// 结束接龙游戏
const endDragonGame = () => {
  dragonGameActive.value = false
}
</script>

<template>
  <div class="quotes-view">
    <!-- 顶部精选名句展示区 -->
    <section class="top-quote-showcase">
      <div class="background-image"></div>
      <div class="showcase-content">
        <h1 class="showcase-title">国学经典名句赏析</h1>
        <p class="calligraphy-quote">{{ dailyQuote.content }}</p>
        <p class="quote-source">——{{ dailyQuote.source }}</p>
      </div>
    </section>

    <!-- 每日一句模块 -->
    <section class="daily-quote">
      <div class="section-title">
        <h2>每日一句</h2>
        <div class="title-decoration"></div>
      </div>
      <div class="daily-quote-card">
        <div class="quote-content">
          <h3 class="original-text">{{ dailyQuote.content }}</h3>
          <p class="quote-source">{{ dailyQuote.source }}</p>
        </div>
        <div class="quote-explanation">
          <div class="explanation-section">
            <h4>译文</h4>
            <p>{{ dailyQuote.translation }}</p>
          </div>
          <div class="explanation-section">
            <h4>解读</h4>
            <p>{{ dailyQuote.interpretation }}</p>
          </div>
          <div class="explanation-section" v-if="dailyQuote.application">
            <h4>现代应用</h4>
            <p>{{ dailyQuote.application }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 名句分类标签云 -->
    <section class="tag-cloud-section">
      <div class="section-title">
        <h2>名句分类</h2>
        <div class="title-decoration"></div>
      </div>
      <div class="tag-cloud">
        <span
          v-for="tag in tags"
          :key="tag.name"
          :class="['tag', { active: activeTag === tag.name }]"
          :style="{ fontSize: `${Math.max(14, Math.min(22, 14 + tag.count / 10))}px` }"
          @click="handleTagClick(tag.name)"
        >
          {{ tag.name }}
          <small>({{ tag.count }})</small>
        </span>
      </div>
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索名句或出处..."
          class="search-input"
        />
        <button class="search-button">搜索</button>
      </div>
    </section>

    <!-- 名句卡片列表 -->
    <section class="quotes-list-section">
      <div class="section-title">
        <h2>经典名句</h2>
        <div class="title-decoration"></div>
      </div>
      <div class="quotes-grid">
        <div v-for="quote in currentPageQuotes" :key="quote.id" class="quote-card">
          <div class="quote-card-content">
            <p class="quote-text">{{ quote.content }}</p>
            <p class="quote-source">{{ quote.source }}</p>
            <div class="tags-container">
              <span v-for="tag in quote.tags" :key="tag" class="quote-tag">
                {{ tag }}
              </span>
            </div>
            <div class="quote-interpretation">
              <p>{{ quote.interpretation }}</p>
            </div>
          </div>
          <div class="quote-card-actions">
            <button :class="['like-button', { liked: quote.isLiked }]" @click="toggleLike(quote)">
              <span class="like-icon">❤</span>
              <span class="like-count">{{ quote.likes }}</span>
            </button>
            <button class="share-button" @click="shareQuote(quote)">
              <span class="share-icon">分享</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 分页控件 -->
      <div class="pagination">
        <button :disabled="currentPage === 1" @click="currentPage--" class="page-button">
          上一页
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="currentPage++" class="page-button">
          下一页
        </button>
      </div>
    </section>

    <!-- 名句接龙游戏模块 -->
    <section class="dragon-game-section">
      <div class="section-title">
        <h2>名句接龙</h2>
        <div class="title-decoration"></div>
      </div>
      <div class="dragon-game-container">
        <div v-if="!dragonGameActive" class="game-intro">
          <p>
            点击"开始接龙"，以每日名句开始，用最后一个字作为下一句的开头，看看你能接出多少经典名句！
          </p>
          <button class="start-game-button" @click="startDragonGame">开始接龙</button>
        </div>
        <div v-else class="game-active">
          <div class="dragon-chain">
            <div v-for="(item, index) in dragonChain" :key="index" class="dragon-item">
              <p class="dragon-content">{{ item.content }}</p>
              <p class="dragon-source">{{ item.source }}</p>
            </div>
          </div>
          <div class="dragon-input-container">
            <p class="dragon-hint">
              请输入以"<span class="highlight-char">{{ lastCharacter }}</span
              >"开头的名句：
            </p>
            <div class="input-group">
              <input
                type="text"
                v-model="userInput"
                placeholder="请输入名句..."
                class="dragon-input"
              />
              <button @click="submitDragonInput" class="submit-button">提交</button>
            </div>
            <button @click="endDragonGame" class="end-game-button">结束游戏</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部区域 -->
    <section class="bottom-section">
      <div class="section-wrapper">
        <!-- 用户投稿入口 -->
        <div class="submission-section">
          <div class="section-title">
            <h2>名句投稿</h2>
            <div class="title-decoration"></div>
          </div>
          <div class="submission-form">
            <p>您有珍藏的国学名句吗？在此分享您的收藏，让更多人了解中华文化的魅力！</p>
            <button class="submission-button">我要投稿</button>
          </div>
        </div>

        <!-- 热门名句排行榜 -->
        <div class="popular-quotes-section">
          <div class="section-title">
            <h2>热门名句榜</h2>
            <div class="title-decoration"></div>
          </div>
          <div class="popular-list">
            <div v-for="(quote, index) in popularQuotes" :key="quote.id" class="popular-item">
              <span class="rank-number">{{ index + 1 }}</span>
              <span class="popular-content">{{ quote.content }}</span>
              <span class="popular-likes">{{ quote.likes }}赞</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 全局样式 */
.quotes-view {
  width: 100%;
  font-family: '楷体', 'KaiTi', serif;
  color: #333;
  background-color: #f8f5f2;
}

.section-title {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

.section-title h2 {
  font-size: 2rem;
  font-weight: bold;
  color: #8a1e1e;
  margin-bottom: 0.5rem;
}

.title-decoration {
  width: 80px;
  height: 2px;
  background-color: #8a1e1e;
  margin: 0 auto;
  position: relative;
}

.title-decoration::before,
.title-decoration::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #8a1e1e;
  border-radius: 50%;
  top: -3px;
}

.title-decoration::before {
  left: -4px;
}

.title-decoration::after {
  right: -4px;
}

/* 顶部精选名句展示区 */
.top-quote-showcase {
  height: 400px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  margin-bottom: 3rem;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/images/chinese-landscape.png');
  background-size: cover;
  background-position: center;
  opacity: 0.3;
  z-index: 1;
}

.showcase-content {
  position: relative;
  z-index: 2;
  padding: 2rem;
  max-width: 800px;
}

.showcase-title {
  font-size: 2.5rem;
  color: #8a1e1e;
  margin-bottom: 2rem;
  font-weight: bold;
}

.calligraphy-quote {
  font-size: 2.8rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  color: #000;
  font-family: '宋体', 'SimSun', serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.quote-source {
  font-size: 1.2rem;
  color: #666;
}

/* 每日一句模块 */
.daily-quote {
  max-width: 1200px;
  margin: 0 auto 3rem;
  padding: 0 1rem;
}

.daily-quote-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.quote-content {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1.5rem;
}

.original-text {
  font-size: 1.8rem;
  line-height: 1.6;
  margin-bottom: 0.5rem;
  color: #000;
}

.quote-explanation {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.explanation-section {
  margin-bottom: 1rem;
}

.explanation-section h4 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #8a1e1e;
}

.explanation-section p {
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
}

/* 名句分类标签云 */
.tag-cloud-section {
  max-width: 1200px;
  margin: 0 auto 3rem;
  padding: 0 1rem;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tag {
  padding: 0.5rem 1rem;
  background-color: #f0e6dc;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
}

.tag:hover {
  background-color: #dbc8b6;
}

.tag.active {
  background-color: #8a1e1e;
  color: #fff;
}

.tag small {
  opacity: 0.7;
  margin-left: 4px;
}

.search-box {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.search-input {
  width: 100%;
  max-width: 500px;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 1rem;
  outline: none;
}

.search-button {
  padding: 0.8rem 1.5rem;
  background-color: #8a1e1e;
  color: #fff;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 1rem;
}

/* 名句卡片列表 */
.quotes-list-section {
  max-width: 1200px;
  margin: 0 auto 3rem;
  padding: 0 1rem;
}

.quotes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.quote-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.quote-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.quote-card-content {
  padding: 1.5rem;
  flex-grow: 1;
}

.quote-text {
  font-size: 1.3rem;
  line-height: 1.6;
  margin-bottom: 0.5rem;
  color: #000;
}

.quote-source {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.quote-tag {
  font-size: 0.8rem;
  background-color: #f0e6dc;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  color: #333;
}

.quote-interpretation {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.6;
}

.quote-card-actions {
  display: flex;
  border-top: 1px solid #eee;
}

.like-button,
.share-button {
  flex: 1;
  padding: 0.8rem;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.like-button:hover,
.share-button:hover {
  background-color: #f8f5f2;
}

.like-button.liked {
  color: #e74c3c;
}

.like-icon,
.share-icon {
  margin-right: 0.5rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
}

.page-button {
  padding: 0.5rem 1rem;
  background-color: #f0e6dc;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 0.5rem;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  margin: 0 1rem;
}

/* 名句接龙游戏模块 */
.dragon-game-section {
  max-width: 1200px;
  margin: 0 auto 3rem;
  padding: 0 1rem;
}

.dragon-game-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.game-intro {
  text-align: center;
  padding: 2rem 0;
}

.game-intro p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.start-game-button {
  padding: 0.8rem 2rem;
  background-color: #8a1e1e;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.start-game-button:hover {
  background-color: #6b1717;
}

.game-active {
  display: flex;
  flex-direction: column;
}

.dragon-chain {
  margin-bottom: 2rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 1rem;
  background-color: #f8f5f2;
  border-radius: 4px;
}

.dragon-item {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed #ddd;
}

.dragon-item:last-child {
  border-bottom: none;
}

.dragon-content {
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
}

.dragon-source {
  font-size: 0.9rem;
  color: #666;
}

.dragon-input-container {
  padding: 1rem;
}

.dragon-hint {
  margin-bottom: 1rem;
  font-size: 1rem;
}

.highlight-char {
  color: #8a1e1e;
  font-weight: bold;
  font-size: 1.2rem;
}

.input-group {
  display: flex;
  margin-bottom: 1rem;
}

.dragon-input {
  flex-grow: 1;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 1rem;
  outline: none;
}

.submit-button {
  padding: 0.8rem 1.5rem;
  background-color: #8a1e1e;
  color: #fff;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.end-game-button {
  padding: 0.6rem 1.2rem;
  background-color: #666;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

/* 底部区域 */
.bottom-section {
  background-color: #f0e6dc;
  padding: 3rem 1rem;
}

.section-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.submission-section,
.popular-quotes-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.submission-form {
  text-align: center;
}

.submission-form p {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.submission-button {
  padding: 0.8rem 2rem;
  background-color: #8a1e1e;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.submission-button:hover {
  background-color: #6b1717;
}

.popular-list {
  display: flex;
  flex-direction: column;
}

.popular-item {
  display: flex;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px solid #eee;
}

.popular-item:last-child {
  border-bottom: none;
}

.rank-number {
  width: 24px;
  height: 24px;
  background-color: #8a1e1e;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  margin-right: 1rem;
}

.popular-content {
  flex-grow: 1;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.popular-likes {
  font-size: 0.9rem;
  color: #8a1e1e;
  margin-left: 0.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .top-quote-showcase {
    height: 300px;
  }

  .calligraphy-quote {
    font-size: 1.8rem;
  }

  .daily-quote-card {
    padding: 1.5rem;
  }

  .quote-explanation {
    grid-template-columns: 1fr;
  }

  .section-wrapper {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .top-quote-showcase {
    height: 250px;
  }

  .showcase-title {
    font-size: 1.8rem;
  }

  .calligraphy-quote {
    font-size: 1.5rem;
  }

  .quotes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
