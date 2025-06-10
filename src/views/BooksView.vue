<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 定义类型
interface Book {
  id: number
  title: string
  author: string
  dynasty: string
  school: string
  type: string
  cover: string
  description: string
}

interface CategoryNode {
  label: string
  id?: string
  children?: CategoryNode[]
}

interface FilterOption {
  value: string
  label: string
}

const router = useRouter()

// 搜索和筛选
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(12)

// 筛选条件
const dynastyFilter = ref('')
const schoolFilter = ref('')
const typeFilter = ref('')

// 朝代选项
const dynastyOptions: FilterOption[] = [
  { value: '', label: '全部朝代' },
  { value: '先秦', label: '先秦' },
  { value: '汉代', label: '汉代' },
  { value: '魏晋南北朝', label: '魏晋南北朝' },
  { value: '唐代', label: '唐代' },
  { value: '宋代', label: '宋代' },
  { value: '元代', label: '元代' },
  { value: '明代', label: '明代' },
  { value: '清代', label: '清代' },
]

// 流派选项
const schoolOptions: FilterOption[] = [
  { value: '', label: '全部流派' },
  { value: '儒家', label: '儒家' },
  { value: '道家', label: '道家' },
  { value: '法家', label: '法家' },
  { value: '墨家', label: '墨家' },
  { value: '兵家', label: '兵家' },
  { value: '名家', label: '名家' },
  { value: '阴阳家', label: '阴阳家' },
  { value: '杂家', label: '杂家' },
]

// 形式选项
const typeOptions: FilterOption[] = [
  { value: '', label: '全部形式' },
  { value: '经部', label: '经部' },
  { value: '史部', label: '史部' },
  { value: '子部', label: '子部' },
  { value: '集部', label: '集部' },
  { value: '诗歌', label: '诗歌' },
  { value: '散文', label: '散文' },
  { value: '小说', label: '小说' },
]

// 左侧分类树
const categoryTree: CategoryNode[] = [
  {
    label: '四书五经',
    children: [
      { label: '论语', id: '1' },
      { label: '大学', id: '2' },
      { label: '中庸', id: '3' },
      { label: '孟子', id: '4' },
      { label: '诗经', id: '5' },
      { label: '尚书', id: '6' },
      { label: '礼记', id: '7' },
      { label: '周易', id: '8' },
      { label: '春秋', id: '9' },
    ],
  },
  {
    label: '诸子百家',
    children: [
      { label: '老子', id: '10' },
      { label: '庄子', id: '11' },
      { label: '韩非子', id: '12' },
      { label: '墨子', id: '13' },
      { label: '孙子兵法', id: '14' },
      { label: '荀子', id: '15' },
      { label: '管子', id: '16' },
    ],
  },
  {
    label: '历史典籍',
    children: [
      { label: '史记', id: '17' },
      { label: '汉书', id: '18' },
      { label: '后汉书', id: '19' },
      { label: '三国志', id: '20' },
      { label: '资治通鉴', id: '21' },
    ],
  },
  {
    label: '诗词歌赋',
    children: [
      { label: '唐诗三百首', id: '22' },
      { label: '宋词三百首', id: '23' },
      { label: '楚辞', id: '24' },
      { label: '乐府诗集', id: '25' },
      { label: '古文观止', id: '26' },
    ],
  },
]

// 模拟书籍数据
const allBooks = ref<Book[]>([
  {
    id: 1,
    title: '论语',
    author: '孔子及其弟子',
    dynasty: '先秦',
    school: '儒家',
    type: '经部',
    cover: '/images/books/lunyu.png',
    description:
      '《论语》记录了孔子及其弟子的言行，是儒家思想的重要经典，对中国传统文化产生了深远影响。',
  },
  {
    id: 2,
    title: '大学',
    author: '曾子',
    dynasty: '先秦',
    school: '儒家',
    type: '经部',
    cover: '/images/books/daxue.png',
    description:
      '《大学》阐述"修身齐家治国平天下"的治学次第，是儒家思想的重要代表作，也是四书之一。',
  },
  {
    id: 3,
    title: '中庸',
    author: '子思',
    dynasty: '先秦',
    school: '儒家',
    type: '经部',
    cover: '/images/books/zhongyong.png',
    description: '《中庸》强调"中和"思想，阐述"诚"的哲学，体现了中国传统文化中的中正平和精神。',
  },
  {
    id: 4,
    title: '孟子',
    author: '孟子及其弟子',
    dynasty: '先秦',
    school: '儒家',
    type: '经部',
    cover: '/images/books/mengzi.png',
    description: '《孟子》记录了孟子的言行和思想，提出"仁政"、"性善论"等重要观点，是儒家经典著作。',
  },
  {
    id: 5,
    title: '老子',
    author: '老子',
    dynasty: '先秦',
    school: '道家',
    type: '子部',
    cover: '/images/books/laozi.png',
    description:
      '《老子》又称《道德经》，是道家学派的经典著作，阐述了"道"与"德"的哲学思想，对中国哲学产生了深远影响。',
  },
  {
    id: 6,
    title: '庄子',
    author: '庄子',
    dynasty: '先秦',
    school: '道家',
    type: '子部',
    cover: '/images/books/zhuangzi.png',
    description:
      '《庄子》是道家学派的重要著作，以寓言故事阐述哲理，富有想象力和文学性，对后世文学创作有深远影响。',
  },
  {
    id: 7,
    title: '韩非子',
    author: '韩非',
    dynasty: '先秦',
    school: '法家',
    type: '子部',
    cover: '/images/books/hanfeizi.png',
    description:
      '《韩非子》是法家思想的集大成者，系统阐述了法、术、势相结合的政治理论，对秦朝的统一和中央集权制度的形成产生重要影响。',
  },
  {
    id: 8,
    title: '墨子',
    author: '墨子及其弟子',
    dynasty: '先秦',
    school: '墨家',
    type: '子部',
    cover: '/images/books/mozi.png',
    description:
      '《墨子》记录了墨家学派的思想，提出"兼爱""非攻"等主张，形成了与儒家分庭抗礼的显学。',
  },
  {
    id: 9,
    title: '史记',
    author: '司马迁',
    dynasty: '汉代',
    school: '史学',
    type: '史部',
    cover: '/images/books/shiji.png',
    description:
      '《史记》是中国第一部纪传体通史，记载了上自黄帝下至汉武帝时期约三千年的历史，被鲁迅誉为"史家之绝唱，无韵之离骚"。',
  },
  {
    id: 10,
    title: '诗经',
    author: '佚名',
    dynasty: '先秦',
    school: '儒家',
    type: '经部',
    cover: '/images/books/shijing.png',
    description:
      '《诗经》是中国最早的诗歌总集，收录了西周初年至春秋中叶的诗歌305篇，分为风、雅、颂三部分。',
  },
  {
    id: 11,
    title: '楚辞',
    author: '屈原等',
    dynasty: '先秦',
    school: '楚文化',
    type: '集部',
    cover: '/images/books/chuci.png',
    description:
      '《楚辞》是以屈原作品为主的诗歌集，代表了南方楚国的文化特色，对后世文学创作有深远影响。',
  },
  {
    id: 12,
    title: '周易',
    author: '周文王、周公',
    dynasty: '先秦',
    school: '儒家',
    type: '经部',
    cover: '/images/books/zhouyi.png',
    description:
      '《周易》是中国最古老的经典之一，内容包括卦象、爻辞和十翼，是研究宇宙自然规律和人生哲理的重要著作。',
  },
  {
    id: 13,
    title: '唐诗三百首',
    author: '蘅塘退士编',
    dynasty: '清代',
    school: '文学',
    type: '集部',
    cover: '/images/books/tangshisanbaishou.png',
    description:
      '《唐诗三百首》是清代蘅塘退士编选的唐代诗歌选集，收录了唐代诗人的代表作品，是中国古典诗歌的经典选集。',
  },
  {
    id: 14,
    title: '宋词三百首',
    author: '朱孝臧编',
    dynasty: '清代',
    school: '文学',
    type: '集部',
    cover: '/images/books/songci.png',
    description:
      '《宋词三百首》是清代朱孝臧编选的宋代词作选集，收录了宋代词人的代表作品，是中国古典词作的经典选集。',
  },
  {
    id: 15,
    title: '资治通鉴',
    author: '司马光',
    dynasty: '宋代',
    school: '史学',
    type: '史部',
    cover: '/images/books/zhi.png',
    description:
      '《资治通鉴》是一部编年体通史，记载了从战国末期到五代末期共1362年的历史，是中国古代最著名的史学著作之一。',
  },
  {
    id: 16,
    title: '孙子兵法',
    author: '孙武',
    dynasty: '先秦',
    school: '兵家',
    type: '子部',
    cover: '/images/books/sunzi.png',
    description:
      '《孙子兵法》是中国古代最著名的兵书，论述了战争的基本原则和策略，对世界军事理论有深远影响。',
  },
])

// 筛选后的书籍
const filteredBooks = computed(() => {
  return allBooks.value.filter((book) => {
    // 搜索条件过滤
    const searchMatch =
      searchQuery.value === '' ||
      book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.value.toLowerCase())

    // 朝代过滤
    const dynastyMatch = dynastyFilter.value === '' || book.dynasty === dynastyFilter.value

    // 流派过滤
    const schoolMatch = schoolFilter.value === '' || book.school === schoolFilter.value

    // 形式过滤
    const typeMatch = typeFilter.value === '' || book.type === typeFilter.value

    return searchMatch && dynastyMatch && schoolMatch && typeMatch
  })
})

// 当前页显示的书籍
const currentPageBooks = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  return filteredBooks.value.slice(startIndex, startIndex + pageSize.value)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredBooks.value.length / pageSize.value)
})

// 分页处理
const handlePageChange = (page: number) => {
  currentPage.value = page
}

// 重置筛选条件
const resetFilters = () => {
  searchQuery.value = ''
  dynastyFilter.value = ''
  schoolFilter.value = ''
  typeFilter.value = ''
  currentPage.value = 1
}

// 导航到书籍详情页
const goToBookDetail = (id: number) => {
  router.push(`/book/${id}`)
}

// 处理分类树点击
const handleCategoryClick = (data: CategoryNode) => {
  if (data.id) {
    goToBookDetail(Number(data.id))
  }
}

// 收藏书籍
const collectBook = (id: number, event: Event) => {
  event.stopPropagation() // 阻止冒泡，防止触发卡片点击
  // 这里应该实现收藏功能，可以使用状态管理或API调用
  console.log('收藏书籍:', id)
}
</script>

<template>
  <div class="books-container">
    <!-- 顶部搜索和筛选区域 -->
    <div class="search-filter-container">
      <div class="search-box">
        <tiny-input
          v-model="searchQuery"
          placeholder="搜索书名、作者或内容关键词"
          prefix-icon="search"
          clearable
        />
      </div>
      <div class="filter-options">
        <tiny-select v-model="dynastyFilter" placeholder="按朝代筛选" class="filter-select">
          <tiny-option
            v-for="option in dynastyOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </tiny-select>

        <tiny-select v-model="schoolFilter" placeholder="按流派筛选" class="filter-select">
          <tiny-option
            v-for="option in schoolOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </tiny-select>

        <tiny-select v-model="typeFilter" placeholder="按形式筛选" class="filter-select">
          <tiny-option
            v-for="option in typeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </tiny-select>

        <tiny-button type="info" plain @click="resetFilters">重置筛选</tiny-button>
      </div>
    </div>

    <div class="main-content">
      <!-- 左侧分类树 -->
      <div class="category-sidebar">
        <h3 class="sidebar-title">分类导航</h3>
        <tiny-tree
          :data="categoryTree"
          default-expand-all
          @node-click="handleCategoryClick"
          node-key="label"
        />
      </div>

      <!-- 右侧书籍列表 -->
      <div class="books-list-container">
        <div class="books-header">
          <h2>国学经典著作库</h2>
          <p>
            共找到 <span class="highlight">{{ filteredBooks.length }}</span> 部著作
            <template v-if="dynastyFilter || schoolFilter || typeFilter"> （已筛选） </template>
          </p>
        </div>

        <!-- 书籍列表 -->
        <div class="books-grid">
          <div
            v-for="book in currentPageBooks"
            :key="book.id"
            class="book-card"
            @click="goToBookDetail(book.id)"
          >
            <div class="book-cover">
              <img :src="book.cover" :alt="book.title" />
              <div class="book-actions">
                <tiny-button size="small" type="primary" @click.stop="goToBookDetail(book.id)"
                  >开始阅读</tiny-button
                >
                <tiny-button size="small" type="success" @click.stop="collectBook(book.id, $event)"
                  >收藏</tiny-button
                >
              </div>
            </div>
            <div class="book-info">
              <h3 class="book-title">{{ book.title }}</h3>
              <p class="book-meta">
                <span class="book-author">{{ book.author }}</span>
                <span class="book-dynasty">{{ book.dynasty }}</span>
              </p>
              <p class="book-school">{{ book.school }} · {{ book.type }}</p>
              <p class="book-description">{{ book.description }}</p>
            </div>
          </div>
        </div>

        <!-- 分页控件 -->
        <div class="pagination-container" v-if="totalPages > 1">
          <tiny-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="filteredBooks.length"
            layout="prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.books-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 搜索和筛选区域 */
.search-filter-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.search-box {
  margin-bottom: 15px;
  max-width: 600px;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

.filter-select {
  width: 160px;
}

/* 主体内容布局 */
.main-content {
  display: flex;
  gap: 20px;
}

/* 左侧分类导航 */
.category-sidebar {
  width: 220px;
  flex-shrink: 0;
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: fit-content;
}

.sidebar-title {
  color: #333;
  font-size: 18px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  font-family: 'STKaiti', 'KaiTi', serif;
}

/* 书籍列表容器 */
.books-list-container {
  flex: 1;
}

.books-header {
  margin-bottom: 20px;
}

.books-header h2 {
  font-size: 24px;
  margin-bottom: 5px;
  color: #333;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.books-header p {
  color: #666;
  font-size: 14px;
}

.highlight {
  color: #842029;
  font-weight: bold;
}

/* 书籍网格 */
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

/* 书籍卡片 */
.book-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.12);
}

.book-cover {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.book-card:hover .book-cover img {
  transform: scale(1.05);
}

/* 书籍操作按钮 */
.book-actions {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 20px;
}

.book-card:hover .book-actions {
  opacity: 1;
}

.book-info {
  padding: 15px;
}

.book-title {
  font-size: 18px;
  margin: 0 0 5px;
  color: #333;
  font-family: 'STKaiti', 'KaiTi', serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-meta {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 13px;
  margin-bottom: 5px;
}

.book-school {
  color: #842029;
  font-size: 13px;
  margin-bottom: 8px;
}

.book-description {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 60px;
}

/* 分页控件 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 响应式布局 */
@media (max-width: 900px) {
  .main-content {
    flex-direction: column;
  }

  .category-sidebar {
    width: 100%;
    margin-bottom: 20px;
  }

  .filter-options {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-select {
    width: 100%;
  }
}
</style>
