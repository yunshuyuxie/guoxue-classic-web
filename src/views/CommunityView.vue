<script setup lang="ts">
import { ref, computed } from 'vue'

// 暂时注释掉TinyMCE编辑器，因为可能需要安装相关依赖
// import { Tinymce as TinymceEditor } from '@opentiny/vue'

// 用户学习数据
const userStats = ref({
  learningDays: 42,
  booksRead: 8,
  notesCount: 16,
})

// 笔记编辑器
const editorContent = ref('')
const editorConfig = ref({
  height: 300,
  menubar: 'file edit view insert format tools table',
  plugins:
    'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount',
  toolbar:
    'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | image | help',
})
const isPublishing = ref(false)
const noteTitle = ref('')
const selectedTags = ref<number[]>([])
const availableTags = ref([
  { id: 1, name: '经典导读' },
  { id: 2, name: '心得体会' },
  { id: 3, name: '读书笔记' },
  { id: 4, name: '诗词赏析' },
  { id: 5, name: '人物研究' },
  { id: 6, name: '思想探讨' },
])

// 笔记列表
const notes = ref([
  {
    id: 1,
    title: '《论语》读书心得：君子之道',
    content: '读完《论语》第四章，对"君子坦荡荡，小人长戚戚"有了新的理解...',
    author: '文化传承者',
    avatar: 'images/avatars/user1.png',
    publishTime: '2023-10-15',
    likes: 42,
    comments: 13,
    tags: ['读书笔记', '经典导读'],
  },
  {
    id: 2,
    title: '孟子性善论探析',
    content: '孟子认为人性本善，这一思想对中国传统文化产生了深远影响...',
    author: '国学爱好者',
    avatar: 'images/avatars/user2.png',
    publishTime: '2023-10-12',
    likes: 38,
    comments: 9,
    tags: ['思想探讨', '人物研究'],
  },
  {
    id: 3,
    title: '《大学》中的修身齐家治国平天下',
    content: '《大学》开篇即点明"大学之道，在明明德，在亲民，在止于至善"...',
    author: '古典文化',
    avatar: 'images/avatars/user3.png',
    publishTime: '2023-10-10',
    likes: 56,
    comments: 21,
    tags: ['经典导读', '读书笔记'],
  },
  {
    id: 4,
    title: '诗经中的爱情表达方式',
    content: '《诗经》中的爱情诗往往通过比兴手法，借物抒情，含蓄委婉...',
    author: '诗词爱好者',
    avatar: 'images/avatars/user4.png',
    publishTime: '2023-10-08',
    likes: 63,
    comments: 17,
    tags: ['诗词赏析'],
  },
  {
    id: 5,
    title: '读《道德经》有感',
    content: '老子的"无为而治"思想启发我们在现代社会中保持内心的平静...',
    author: '哲学思考者',
    avatar: 'images/avatars/user5.png',
    publishTime: '2023-10-05',
    likes: 49,
    comments: 24,
    tags: ['心得体会', '思想探讨'],
  },
])

// 学习小组
const studyGroups = ref([
  {
    id: 1,
    name: '论语读书会',
    description: '每周共读《论语》一章，深入探讨儒家思想',
    members: 128,
    avatar: 'images/groups/group1.png',
    topics: 56,
  },
  {
    id: 2,
    name: '诗词鉴赏小组',
    description: '品味古典诗词之美，领略文学艺术之精髓',
    members: 96,
    avatar: 'images/groups/group2.png',
    topics: 43,
  },
  {
    id: 3,
    name: '道家思想研究',
    description: '探讨老庄哲学，寻求生活智慧与心灵平静',
    members: 85,
    avatar: 'images/groups/group3.png',
    topics: 37,
  },
  {
    id: 4,
    name: '经典国学入门',
    description: '适合初学者的国学经典导读与基础知识学习',
    members: 156,
    avatar: 'images/groups/group4.png',
    topics: 62,
  },
])

// 问答区
const questions = ref([
  {
    id: 1,
    title: '《周易》中的"乾卦"具体代表什么含义？',
    content: '最近在学习《周易》，对乾卦的理解有些困惑，希望有人能详细解答。',
    author: '初学易经',
    avatar: 'images/avatars/user6.png',
    publishTime: '2023-10-14',
    answers: 7,
    tags: ['周易', '卦象解读'],
  },
  {
    id: 2,
    title: '儒家与道家在"无为"概念上有何区别？',
    content: '孔子和老子都提到"无为"，但似乎内涵有所不同，请各位指教。',
    author: '哲学探索',
    avatar: 'images/avatars/user7.png',
    publishTime: '2023-10-13',
    answers: 12,
    tags: ['儒道比较', '哲学概念'],
  },
  {
    id: 3,
    title: '如何理解《大学》中的"格物致知"？',
    content: '不太理解"格物致知"的实际操作方法，是研究事物还是内省自我？',
    author: '求知者',
    avatar: 'images/avatars/user8.png',
    publishTime: '2023-10-11',
    answers: 9,
    tags: ['四书', '儒家学说'],
  },
])

// 活跃用户
const activeUsers = ref([
  { id: 1, name: '文化传承者', avatar: 'images/avatars/user1.png', contributions: 86 },
  { id: 2, name: '国学爱好者', avatar: 'images/avatars/user2.png', contributions: 73 },
  { id: 3, name: '古典文化', avatar: 'images/avatars/user3.png', contributions: 65 },
  { id: 4, name: '诗词爱好者', avatar: 'images/avatars/user4.png', contributions: 58 },
  { id: 5, name: '哲学思考者', avatar: 'images/avatars/user5.png', contributions: 52 },
])

// 优质创作者
const topCreators = ref([
  {
    id: 1,
    name: '国学大师',
    avatar: 'images/avatars/creator1.png',
    followers: 1256,
    field: '儒家经典',
  },
  {
    id: 2,
    name: '诗词达人',
    avatar: 'images/avatars/creator2.png',
    followers: 986,
    field: '古典诗词',
  },
  {
    id: 3,
    name: '哲思随笔',
    avatar: 'images/avatars/creator3.png',
    followers: 845,
    field: '道家思想',
  },
])

// 读书会活动
const readingEvents = ref([
  {
    id: 1,
    title: '《论语》精读系列（三）：学而篇',
    date: '2023-10-20',
    time: '19:30-21:00',
    host: '文化传承者',
    participants: 42,
    maxParticipants: 50,
    online: true,
  },
  {
    id: 2,
    title: '诗经赏析：国风·周南',
    date: '2023-10-22',
    time: '15:00-16:30',
    host: '诗词达人',
    participants: 36,
    maxParticipants: 40,
    online: true,
  },
  {
    id: 3,
    title: '《道德经》导读（一）',
    date: '2023-10-25',
    time: '20:00-21:30',
    host: '哲思随笔',
    participants: 28,
    maxParticipants: 45,
    online: true,
  },
  {
    id: 4,
    title: '四书导读：从《大学》开始',
    date: '2023-10-28',
    time: '14:30-16:00',
    host: '国学大师',
    participants: 48,
    maxParticipants: 60,
    online: true,
  },
])

// 排序方式
const sortMethod = ref('hot') // 'hot' 或 'latest'

// 切换排序方式
const toggleSortMethod = () => {
  sortMethod.value = sortMethod.value === 'hot' ? 'latest' : 'hot'
}

// 排序后的笔记
const sortedNotes = computed(() => {
  if (sortMethod.value === 'hot') {
    return [...notes.value].sort((a, b) => b.likes - a.likes)
  } else {
    return [...notes.value].sort(
      (a, b) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime(),
    )
  }
})

// 发布笔记
const publishNote = () => {
  if (!noteTitle.value || !editorContent.value) {
    alert('标题和内容不能为空')
    return
  }

  isPublishing.value = true

  // 模拟发布过程
  setTimeout(() => {
    const newNote = {
      id: notes.value.length + 1,
      title: noteTitle.value,
      content: editorContent.value.substring(0, 100) + '...',
      author: '当前用户',
      avatar: 'images/avatars/current-user.png',
      publishTime: new Date().toISOString().split('T')[0],
      likes: 0,
      comments: 0,
      tags: selectedTags.value
        .map((tagId) => {
          const tag = availableTags.value.find((t) => t.id === tagId)
          return tag ? tag.name : ''
        })
        .filter(Boolean),
    }

    notes.value.unshift(newNote)

    // 重置表单
    noteTitle.value = ''
    editorContent.value = ''
    selectedTags.value = []
    isPublishing.value = false

    alert('发布成功！')
  }, 1000)
}

// 加入学习小组
const joinGroup = (groupId: number) => {
  const group = studyGroups.value.find((g) => g.id === groupId)
  if (group) {
    group.members++
    alert(`成功加入"${group.name}"！`)
  }
}

// 报名读书会
const joinReadingEvent = (eventId: number) => {
  const event = readingEvents.value.find((e) => e.id === eventId)
  if (event && event.participants < event.maxParticipants) {
    event.participants++
    alert(`成功报名"${event.title}"！`)
  } else {
    alert('很抱歉，该活动名额已满')
  }
}

// 提交问题
interface Question {
  title: string
  content: string
  tags: string[]
}

const newQuestion = ref<Question>({
  title: '',
  content: '',
  tags: [],
})

const submitQuestion = () => {
  if (!newQuestion.value.title || !newQuestion.value.content) {
    alert('问题标题和内容不能为空')
    return
  }

  const question = {
    id: questions.value.length + 1,
    title: newQuestion.value.title,
    content: newQuestion.value.content,
    author: '当前用户',
    avatar: 'images/avatars/current-user.png',
    publishTime: new Date().toISOString().split('T')[0],
    answers: 0,
    tags: newQuestion.value.tags,
  }

  questions.value.unshift(question)

  // 重置表单
  newQuestion.value = {
    title: '',
    content: '',
    tags: [],
  }

  alert('问题提交成功！')
}
</script>

<template>
  <div class="community-view">
    <!-- 顶部用户学习数据概览 -->
    <section class="user-stats-section">
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-number">{{ userStats.learningDays }}</div>
          <div class="stat-label">学习天数</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ userStats.booksRead }}</div>
          <div class="stat-label">阅读书籍</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ userStats.notesCount }}</div>
          <div class="stat-label">学习笔记</div>
        </div>
      </div>
    </section>

    <!-- 主要内容区 -->
    <div class="main-content">
      <!-- 左侧主要内容 -->
      <div class="left-content">
        <!-- 笔记编辑器 -->
        <section class="note-editor-section">
          <h2 class="section-title">发布学习笔记</h2>
          <div class="editor-container">
            <div class="input-group">
              <label for="note-title">标题</label>
              <input
                type="text"
                id="note-title"
                v-model="noteTitle"
                placeholder="请输入笔记标题..."
                class="title-input"
              />
            </div>

            <div class="input-group">
              <label>标签</label>
              <div class="tags-selector">
                <div
                  v-for="tag in availableTags"
                  :key="tag.id"
                  :class="['tag-option', { selected: selectedTags.includes(tag.id) }]"
                  @click="
                    selectedTags.includes(tag.id)
                      ? (selectedTags = selectedTags.filter((id) => id !== tag.id))
                      : selectedTags.push(tag.id)
                  "
                >
                  {{ tag.name }}
                </div>
              </div>
            </div>

            <div class="input-group">
              <label>内容</label>
              <!-- 暂时使用普通文本框代替富文本编辑器 -->
              <textarea
                v-model="editorContent"
                placeholder="请输入笔记内容..."
                rows="8"
                class="content-textarea"
              ></textarea>
              <!-- TinyMCE编辑器需要安装相关依赖 -->
              <!--
              <TinymceEditor v-model="editorContent" :init="editorConfig" />
              -->
            </div>

            <div class="button-group">
              <button class="publish-button" @click="publishNote" :disabled="isPublishing">
                {{ isPublishing ? '发布中...' : '发布笔记' }}
              </button>
            </div>
          </div>
        </section>

        <!-- 笔记流展示区 -->
        <section class="notes-section">
          <div class="section-header">
            <h2 class="section-title">学习笔记</h2>
            <div class="sort-control">
              <span>排序：</span>
              <button
                :class="['sort-button', { active: sortMethod === 'hot' }]"
                @click="sortMethod = 'hot'"
              >
                热度
              </button>
              <button
                :class="['sort-button', { active: sortMethod === 'latest' }]"
                @click="sortMethod = 'latest'"
              >
                最新
              </button>
            </div>
          </div>

          <div class="notes-list">
            <div v-for="note in sortedNotes" :key="note.id" class="note-card">
              <div class="note-header">
                <div class="author-info">
                  <img :src="note.avatar" :alt="note.author" class="avatar" />
                  <span class="author-name">{{ note.author }}</span>
                </div>
                <div class="note-time">{{ note.publishTime }}</div>
              </div>

              <div class="note-body">
                <h3 class="note-title">{{ note.title }}</h3>
                <div class="note-content">{{ note.content }}</div>
                <div class="note-tags">
                  <span v-for="(tag, index) in note.tags" :key="index" class="note-tag">
                    {{ tag }}
                  </span>
                </div>
              </div>

              <div class="note-footer">
                <div class="note-action">
                  <i class="like-icon"></i>
                  <span>{{ note.likes }}</span>
                </div>
                <div class="note-action">
                  <i class="comment-icon"></i>
                  <span>{{ note.comments }}</span>
                </div>
                <div class="note-action">
                  <i class="share-icon"></i>
                  <span>分享</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 学习小组模块 -->
        <section class="study-groups-section">
          <h2 class="section-title">学习小组</h2>
          <div class="groups-grid">
            <div v-for="group in studyGroups" :key="group.id" class="group-card">
              <div class="group-avatar">
                <img :src="group.avatar" :alt="group.name" />
              </div>
              <div class="group-info">
                <h3 class="group-name">{{ group.name }}</h3>
                <p class="group-description">{{ group.description }}</p>
                <div class="group-stats">
                  <span>{{ group.members }}位成员</span>
                  <span>{{ group.topics }}个主题</span>
                </div>
              </div>
              <button class="join-button" @click="joinGroup(group.id)">加入</button>
            </div>
          </div>
        </section>

        <!-- 问答区 -->
        <section class="qa-section">
          <h2 class="section-title">问答社区</h2>

          <!-- 提问表单 -->
          <div class="ask-question-form">
            <h3>我要提问</h3>
            <div class="input-group">
              <label for="question-title">问题标题</label>
              <input
                type="text"
                id="question-title"
                v-model="newQuestion.title"
                placeholder="请输入问题标题..."
              />
            </div>
            <div class="input-group">
              <label for="question-content">问题详情</label>
              <textarea
                id="question-content"
                v-model="newQuestion.content"
                placeholder="请详细描述您的问题..."
                rows="4"
              ></textarea>
            </div>
            <div class="input-group">
              <label>标签</label>
              <div class="question-tags-input">
                <input
                  type="text"
                  placeholder="输入标签，用逗号分隔"
                  @keydown.enter="
                    (e) => {
                      const target = e.target as HTMLInputElement
                      target.value.split(',').forEach((tag: string) => {
                        if (tag.trim() && !newQuestion.tags.includes(tag.trim())) {
                          newQuestion.tags.push(tag.trim())
                        }
                      })
                      target.value = ''
                    }
                  "
                />
                <div class="selected-tags">
                  <span v-for="(tag, index) in newQuestion.tags" :key="index" class="selected-tag">
                    {{ tag }}
                    <span class="remove-tag" @click="newQuestion.tags.splice(index, 1)">×</span>
                  </span>
                </div>
              </div>
            </div>
            <button class="submit-question-button" @click="submitQuestion">提交问题</button>
          </div>

          <!-- 问题列表 -->
          <div class="questions-list">
            <div v-for="question in questions" :key="question.id" class="question-card">
              <div class="question-header">
                <div class="author-info">
                  <img :src="question.avatar" :alt="question.author" class="avatar" />
                  <span class="author-name">{{ question.author }}</span>
                </div>
                <div class="question-time">{{ question.publishTime }}</div>
              </div>

              <div class="question-body">
                <h3 class="question-title">{{ question.title }}</h3>
                <div class="question-content">{{ question.content }}</div>
                <div class="question-tags">
                  <span v-for="(tag, index) in question.tags" :key="index" class="question-tag">
                    {{ tag }}
                  </span>
                </div>
              </div>

              <div class="question-footer">
                <div class="answers-count">{{ question.answers }}个回答</div>
                <button class="answer-button">我来回答</button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- 右侧边栏 -->
      <div class="right-sidebar">
        <!-- 活跃用户 -->
        <section class="sidebar-section active-users-section">
          <h3 class="sidebar-title">活跃用户</h3>
          <div class="users-list">
            <div v-for="user in activeUsers" :key="user.id" class="user-item">
              <img :src="user.avatar" :alt="user.name" class="user-avatar" />
              <div class="user-info">
                <div class="user-name">{{ user.name }}</div>
                <div class="user-contributions">贡献：{{ user.contributions }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- 优质创作者 -->
        <section class="sidebar-section top-creators-section">
          <h3 class="sidebar-title">优质创作者</h3>
          <div class="creators-list">
            <div v-for="creator in topCreators" :key="creator.id" class="creator-item">
              <img :src="creator.avatar" :alt="creator.name" class="creator-avatar" />
              <div class="creator-info">
                <div class="creator-name">{{ creator.name }}</div>
                <div class="creator-field">{{ creator.field }}</div>
                <div class="creator-followers">{{ creator.followers }}位关注者</div>
              </div>
              <button class="follow-button">关注</button>
            </div>
          </div>
        </section>

        <!-- 读书会活动日历 -->
        <section class="sidebar-section reading-events-section">
          <h3 class="sidebar-title">线上读书会</h3>
          <div class="events-list">
            <div v-for="event in readingEvents" :key="event.id" class="event-item">
              <div class="event-date">{{ event.date }}</div>
              <div class="event-info">
                <div class="event-title">{{ event.title }}</div>
                <div class="event-time">{{ event.time }}</div>
                <div class="event-host">主讲：{{ event.host }}</div>
                <div class="event-participants">
                  {{ event.participants }}/{{ event.maxParticipants }}人
                </div>
              </div>
              <button
                class="join-event-button"
                :disabled="event.participants >= event.maxParticipants"
                @click="joinReadingEvent(event.id)"
              >
                {{ event.participants >= event.maxParticipants ? '已满' : '报名' }}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 全局样式 */
.community-view {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: '楷体', 'KaiTi', serif;
  color: #333;
}

/* 顶部用户学习数据概览 */
.user-stats-section {
  background-color: #f0e6dc;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stats-container {
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.stat-item {
  padding: 15px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #8a1e1e;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 1rem;
  color: #666;
}

/* 主要内容区布局 */
.main-content {
  display: flex;
  gap: 30px;
}

.left-content {
  flex: 1;
  min-width: 0;
}

.right-sidebar {
  width: 300px;
}

/* 通用部分样式 */
.section-title {
  font-size: 1.5rem;
  color: #8a1e1e;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0e6dc;
}

/* 笔记编辑器 */
.note-editor-section {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.editor-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-weight: bold;
  color: #555;
}

.title-input,
.content-textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  width: 100%;
}

.content-textarea {
  min-height: 200px;
  resize: vertical;
  font-family: '楷体', 'KaiTi', serif;
}

.tags-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-option {
  padding: 5px 12px;
  background-color: #f0e6dc;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-option:hover {
  background-color: #e0d6cc;
}

.tag-option.selected {
  background-color: #8a1e1e;
  color: white;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

.publish-button {
  padding: 10px 20px;
  background-color: #8a1e1e;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.publish-button:hover {
  background-color: #6b1717;
}

.publish-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 笔记流展示区 */
.notes-section {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.sort-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-button {
  padding: 5px 10px;
  background-color: #f0e6dc;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sort-button.active {
  background-color: #8a1e1e;
  color: white;
}

.notes-list {
  display: flex;
  flex-direction: column;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f9f5f2;
  border-bottom: 1px solid #eee;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-weight: bold;
}

.note-time {
  color: #888;
  font-size: 0.9rem;
}

.note-body {
  padding: 15px;
}

.note-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
}

.note-content {
  margin-bottom: 15px;
  line-height: 1.6;
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.note-tag {
  padding: 3px 10px;
  background-color: #f0e6dc;
  border-radius: 12px;
  font-size: 0.8rem;
}

.note-footer {
  display: flex;
  padding: 10px 15px;
  border-top: 1px solid #eee;
  background-color: #f9f5f2;
}

.note-action {
  display: flex;
  align-items: center;
  margin-right: 20px;
  color: #666;
  cursor: pointer;
}

.note-action:hover {
  color: #8a1e1e;
}

.like-icon,
.comment-icon,
.share-icon {
  margin-right: 5px;
}

/* 学习小组模块 */
.study-groups-section {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.group-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.group-card:hover {
  transform: translateY(-5px);
}

.group-avatar {
  height: 120px;
  overflow: hidden;
}

.group-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.group-info {
  padding: 15px;
}

.group-name {
  font-size: 1.1rem;
  margin-bottom: 8px;
  color: #333;
}

.group-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
  line-height: 1.4;
  height: 60px;
  overflow: hidden;
}

.group-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 10px;
}

.join-button {
  width: 100%;
  padding: 8px;
  background-color: #8a1e1e;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.join-button:hover {
  background-color: #6b1717;
}

/* 问答区 */
.qa-section {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ask-question-form {
  background-color: #f9f5f2;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

.ask-question-form h3 {
  margin-bottom: 15px;
  color: #8a1e1e;
}

.ask-question-form .input-group {
  margin-bottom: 15px;
}

.ask-question-form input,
.ask-question-form textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.question-tags-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-tag {
  display: flex;
  align-items: center;
  padding: 3px 8px;
  background-color: #8a1e1e;
  color: white;
  border-radius: 12px;
  font-size: 0.8rem;
}

.remove-tag {
  margin-left: 5px;
  cursor: pointer;
}

.submit-question-button {
  padding: 10px 20px;
  background-color: #8a1e1e;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-question-button:hover {
  background-color: #6b1717;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.question-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f9f5f2;
  border-bottom: 1px solid #eee;
}

.question-body {
  padding: 15px;
}

.question-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.question-content {
  margin-bottom: 15px;
  line-height: 1.6;
  color: #555;
}

.question-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.question-tag {
  padding: 3px 10px;
  background-color: #f0e6dc;
  border-radius: 12px;
  font-size: 0.8rem;
}

.question-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f9f5f2;
  border-top: 1px solid #eee;
}

.answers-count {
  color: #666;
}

.answer-button {
  padding: 5px 15px;
  background-color: #8a1e1e;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* 右侧边栏 */
.sidebar-section {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sidebar-title {
  font-size: 1.2rem;
  color: #8a1e1e;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0e6dc;
}

/* 活跃用户 */
.users-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: bold;
  margin-bottom: 3px;
}

.user-contributions {
  font-size: 0.8rem;
  color: #888;
}

/* 优质创作者 */
.creators-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.creator-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.creator-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.creator-info {
  flex: 1;
}

.creator-name {
  font-weight: bold;
  margin-bottom: 3px;
}

.creator-field {
  font-size: 0.8rem;
  color: #8a1e1e;
  margin-bottom: 3px;
}

.creator-followers {
  font-size: 0.8rem;
  color: #888;
}

.follow-button {
  padding: 5px 10px;
  background-color: #8a1e1e;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8rem;
}

/* 读书会活动 */
.events-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.event-item {
  display: flex;
  gap: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.event-item:last-child {
  border-bottom: none;
}

.event-date {
  min-width: 60px;
  height: 60px;
  background-color: #f0e6dc;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #8a1e1e;
}

.event-info {
  flex: 1;
}

.event-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.event-time,
.event-host {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 3px;
}

.event-participants {
  font-size: 0.8rem;
  color: #8a1e1e;
}

.join-event-button {
  padding: 5px 10px;
  background-color: #8a1e1e;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  align-self: center;
  font-size: 0.8rem;
}

.join-event-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 900px) {
  .main-content {
    flex-direction: column;
  }

  .right-sidebar {
    width: 100%;
  }

  .groups-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 600px) {
  .stats-container {
    flex-direction: column;
    gap: 15px;
  }

  .groups-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
