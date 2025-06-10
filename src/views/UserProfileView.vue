<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// 用户角色选项
const roleOptions = [
  { value: 'student', label: '学生' },
  { value: 'teacher', label: '教师' },
  { value: 'enthusiast', label: '文化爱好者' },
  { value: 'researcher', label: '研究者' },
  { value: 'other', label: '其他' },
]

// 学习兴趣选项
const interestOptions = [
  { value: 'classics', label: '四书五经' },
  { value: 'poetry', label: '诗词歌赋' },
  { value: 'philosophy', label: '儒道思想' },
  { value: 'history', label: '历史典籍' },
  { value: 'art', label: '书画艺术' },
  { value: 'medicine', label: '中医典籍' },
  { value: 'military', label: '兵法谋略' },
]

// 隐私选项
const privacyOptions = [
  { value: 'public', label: '公开' },
  { value: 'friends', label: '仅好友可见' },
  { value: 'private', label: '仅自己可见' },
]

// 传统文化头像选项
const avatarOptions = [
  { id: 1, src: 'images/avatars/confucius.png', name: '孔子' },
  { id: 2, src: 'images/avatars/laozi.png', name: '老子' },
  { id: 3, src: 'images/avatars/zhuangzi.png', name: '庄子' },
  { id: 4, src: 'images/avatars/mencius.png', name: '孟子' },
  { id: 5, src: 'images/avatars/sunzi.png', name: '孙子' },
  { id: 6, src: 'images/avatars/mulan.png', name: '花木兰' },
  { id: 7, src: 'images/avatars/wangxifeng.png', name: '王熙凤' },
  { id: 8, src: 'images/avatars/linDaiyu.png', name: '林黛玉' },
]

// 编辑模式状态
const isEditMode = ref(false)

// 用户信息数据
const userProfile = reactive({
  username: '国学爱好者',
  nickname: '子曰诗云',
  avatar: 'images/avatars/confucius.png',
  selectedAvatarId: 1,
  role: 'enthusiast',
  interests: ['classics', 'poetry', 'philosophy'],
  bio: '温故而知新，可以为师矣。',
  email: 'user@example.com',
  phone: '138****1234',
  registerDate: '2023-05-15',
  lastLoginDate: '2023-10-10',
  privacySetting: 'public',
  notificationSettings: {
    emailNotification: true,
    pushNotification: true,
    activitySummary: true,
    newContent: true,
    commentReplies: true,
  },
})

// 表单验证错误
const formErrors = reactive({
  nickname: '',
  email: '',
  bio: '',
})

// 编辑表单数据
const editForm = reactive({ ...userProfile })

// 学习统计数据
const learningStats = reactive({
  readBooks: 28,
  completedCourses: 5,
  quizScore: 85,
  totalReadingTime: 120, // 小时
  favoriteCategories: ['诗词歌赋', '儒家经典'],
})

// 切换编辑模式
const toggleEditMode = () => {
  if (isEditMode.value) {
    // 退出编辑模式，重置表单
    Object.assign(editForm, userProfile)
  } else {
    // 进入编辑模式，复制当前数据到表单
    Object.assign(editForm, userProfile)
  }
  isEditMode.value = !isEditMode.value
}

// 保存用户信息
const saveUserProfile = () => {
  // 表单验证
  let hasError = false

  // 昵称验证
  if (!editForm.nickname) {
    formErrors.nickname = '请输入昵称'
    hasError = true
  } else if (editForm.nickname.length > 20) {
    formErrors.nickname = '昵称不能超过20个字符'
    hasError = true
  } else {
    formErrors.nickname = ''
  }

  // 邮箱验证
  if (editForm.email && !/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(editForm.email)) {
    formErrors.email = '请输入正确的邮箱格式'
    hasError = true
  } else {
    formErrors.email = ''
  }

  // 个人简介验证
  if (editForm.bio && editForm.bio.length > 200) {
    formErrors.bio = '个人简介不能超过200个字符'
    hasError = true
  } else {
    formErrors.bio = ''
  }

  if (hasError) return

  // 保存用户信息
  Object.assign(userProfile, editForm)

  // 退出编辑模式
  isEditMode.value = false

  // 模拟保存成功提示
  alert('个人资料已更新')
}

// 选择头像
const selectAvatar = (avatarId: number, avatarSrc: string) => {
  editForm.selectedAvatarId = avatarId
  editForm.avatar = avatarSrc
}

// 计算用户等级
const userLevel = computed(() => {
  const score =
    learningStats.readBooks * 2 + learningStats.completedCourses * 5 + learningStats.quizScore / 10
  if (score > 100) return { level: '大儒', progress: 90 }
  if (score > 80) return { level: '博士', progress: 75 }
  if (score > 60) return { level: '举人', progress: 60 }
  if (score > 40) return { level: '秀才', progress: 45 }
  if (score > 20) return { level: '童生', progress: 30 }
  return { level: '初学', progress: 15 }
})

// 格式化兴趣标签
const formattedInterests = computed(() => {
  return userProfile.interests.map((interest) => {
    const option = interestOptions.find((opt) => opt.value === interest)
    return option ? option.label : interest
  })
})
</script>

<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1>个人资料</h1>
      <button v-if="!isEditMode" class="edit-button" @click="toggleEditMode">编辑资料</button>
      <div v-else class="edit-actions">
        <button class="save-button" @click="saveUserProfile">保存</button>
        <button class="cancel-button" @click="toggleEditMode">取消</button>
      </div>
    </div>

    <!-- 查看模式 -->
    <div v-if="!isEditMode" class="profile-content">
      <div class="profile-main">
        <div class="user-card">
          <div class="avatar-container">
            <img :src="userProfile.avatar" :alt="userProfile.nickname" class="user-avatar" />
          </div>
          <div class="user-info">
            <h2>{{ userProfile.nickname }}</h2>
            <p class="username">@{{ userProfile.username }}</p>
            <div class="user-role">
              <span class="role-badge">{{
                roleOptions.find((role) => role.value === userProfile.role)?.label
              }}</span>
            </div>
            <p class="user-bio">{{ userProfile.bio }}</p>
            <div class="user-interests">
              <span class="interest-tag" v-for="interest in formattedInterests" :key="interest">
                {{ interest }}
              </span>
            </div>
          </div>
        </div>

        <div class="user-level">
          <div class="level-info">
            <span class="level-title">当前等级：{{ userLevel.level }}</span>
            <span class="level-progress">{{ userLevel.progress }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: userLevel.progress + '%' }"></div>
          </div>
          <p class="level-tip">继续学习提升等级，解锁更多内容</p>
        </div>

        <div class="stats-card">
          <h3>学习统计</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ learningStats.readBooks }}</div>
              <div class="stat-label">已读经典</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ learningStats.completedCourses }}</div>
              <div class="stat-label">完成课程</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ learningStats.quizScore }}</div>
              <div class="stat-label">测验得分</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ learningStats.totalReadingTime }}h</div>
              <div class="stat-label">总阅读时长</div>
            </div>
          </div>
        </div>

        <div class="account-info">
          <h3>账号信息</h3>
          <div class="info-item">
            <span class="info-label">邮箱</span>
            <span class="info-value">{{ userProfile.email }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">手机号</span>
            <span class="info-value">{{ userProfile.phone }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">注册时间</span>
            <span class="info-value">{{ userProfile.registerDate }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">上次登录</span>
            <span class="info-value">{{ userProfile.lastLoginDate }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">隐私设置</span>
            <span class="info-value">{{
              privacyOptions.find((p) => p.value === userProfile.privacySetting)?.label
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑模式 -->
    <div v-else class="profile-content edit-mode">
      <form @submit.prevent="saveUserProfile" class="edit-form">
        <div class="form-section">
          <h3>基本信息</h3>

          <div class="form-group">
            <label for="nickname">昵称</label>
            <input
              type="text"
              id="nickname"
              v-model="editForm.nickname"
              :class="{ error: formErrors.nickname }"
            />
            <div v-if="formErrors.nickname" class="error-message">{{ formErrors.nickname }}</div>
          </div>

          <div class="form-group">
            <label>选择头像</label>
            <div class="avatar-selection">
              <div
                v-for="avatar in avatarOptions"
                :key="avatar.id"
                class="avatar-option"
                :class="{ selected: editForm.selectedAvatarId === avatar.id }"
                @click="selectAvatar(avatar.id, avatar.src)"
              >
                <img :src="avatar.src" :alt="avatar.name" />
                <span class="avatar-name">{{ avatar.name }}</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="role">身份角色</label>
            <select id="role" v-model="editForm.role">
              <option v-for="option in roleOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>学习兴趣</label>
            <div class="interests-selection">
              <label
                v-for="interest in interestOptions"
                :key="interest.value"
                class="interest-checkbox"
              >
                <input type="checkbox" :value="interest.value" v-model="editForm.interests" />
                <span>{{ interest.label }}</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="bio">个人简介</label>
            <textarea
              id="bio"
              v-model="editForm.bio"
              rows="3"
              placeholder="介绍一下自己吧..."
              :class="{ error: formErrors.bio }"
            ></textarea>
            <div v-if="formErrors.bio" class="error-message">{{ formErrors.bio }}</div>
            <div class="char-count">{{ editForm.bio.length }}/200</div>
          </div>
        </div>

        <div class="form-section">
          <h3>联系方式</h3>

          <div class="form-group">
            <label for="email">邮箱</label>
            <input
              type="email"
              id="email"
              v-model="editForm.email"
              :class="{ error: formErrors.email }"
            />
            <div v-if="formErrors.email" class="error-message">{{ formErrors.email }}</div>
          </div>

          <div class="form-group">
            <label for="phone">手机号</label>
            <input type="tel" id="phone" v-model="editForm.phone" disabled />
            <div class="field-note">手机号为注册账号，不可修改</div>
          </div>
        </div>

        <div class="form-section">
          <h3>隐私设置</h3>

          <div class="form-group">
            <label for="privacy">个人资料可见性</label>
            <select id="privacy" v-model="editForm.privacySetting">
              <option v-for="option in privacyOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>通知设置</label>
            <div class="notification-settings">
              <label class="switch-label">
                <input type="checkbox" v-model="editForm.notificationSettings.emailNotification" />
                <span>邮件通知</span>
              </label>
              <label class="switch-label">
                <input type="checkbox" v-model="editForm.notificationSettings.pushNotification" />
                <span>推送通知</span>
              </label>
              <label class="switch-label">
                <input type="checkbox" v-model="editForm.notificationSettings.activitySummary" />
                <span>活动摘要</span>
              </label>
              <label class="switch-label">
                <input type="checkbox" v-model="editForm.notificationSettings.newContent" />
                <span>新内容提醒</span>
              </label>
              <label class="switch-label">
                <input type="checkbox" v-model="editForm.notificationSettings.commentReplies" />
                <span>评论回复</span>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.profile-header h1 {
  font-size: 24px;
  color: #842029;
  font-family: 'STKaiti', 'KaiTi', serif;
  margin: 0;
}

.edit-button,
.save-button,
.cancel-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-button {
  background-color: #f8f9fa;
  border: 1px solid #842029;
  color: #842029;
}

.edit-button:hover {
  background-color: #f1f3f5;
}

.edit-actions {
  display: flex;
  gap: 10px;
}

.save-button {
  background-color: #842029;
  border: 1px solid #842029;
  color: white;
}

.save-button:hover {
  background-color: #6b1717;
}

.cancel-button {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  color: #666;
}

.cancel-button:hover {
  background-color: #f1f3f5;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.user-card {
  display: flex;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 24px;
  gap: 24px;
}

.avatar-container {
  flex-shrink: 0;
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f8f9fa;
}

.user-info {
  flex: 1;
}

.user-info h2 {
  font-size: 22px;
  margin: 0 0 4px;
  color: #333;
}

.username {
  color: #666;
  font-size: 14px;
  margin: 0 0 12px;
}

.user-role {
  margin-bottom: 12px;
}

.role-badge {
  background-color: #f8f0f1;
  color: #842029;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  display: inline-block;
}

.user-bio {
  color: #333;
  margin: 0 0 16px;
  line-height: 1.6;
}

.user-interests {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.interest-tag {
  background-color: #f0f0f0;
  color: #666;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
}

.user-level {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.level-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.level-title {
  font-weight: bold;
  color: #842029;
}

.level-progress {
  color: #666;
}

.progress-bar {
  height: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background-color: #842029;
  border-radius: 5px;
  transition: width 0.5s ease;
}

.level-tip {
  font-size: 12px;
  color: #666;
  margin: 0;
  text-align: center;
}

.stats-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.stats-card h3 {
  font-size: 18px;
  margin: 0 0 16px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background-color: #f9f5f2;
  border-radius: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #842029;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.account-info {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.account-info h3 {
  font-size: 18px;
  margin: 0 0 16px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #666;
}

.info-value {
  color: #333;
  font-weight: 500;
}

/* 编辑表单样式 */
.edit-form {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 24px;
}

.form-section {
  margin-bottom: 30px;
}

.form-section h3 {
  font-size: 18px;
  margin: 0 0 20px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #842029;
  outline: none;
}

.form-group input.error,
.form-group textarea.error {
  border-color: #f56c6c;
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 5px;
}

.field-note {
  color: #999;
  font-size: 12px;
  margin-top: 5px;
}

.char-count {
  text-align: right;
  color: #999;
  font-size: 12px;
  margin-top: 5px;
}

.avatar-selection {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 10px;
}

.avatar-option {
  text-align: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.avatar-option img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.avatar-option.selected {
  background-color: #f8f0f1;
}

.avatar-option.selected img {
  border-color: #842029;
}

.avatar-name {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #666;
}

.interests-selection {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.interest-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.interest-checkbox input {
  margin-right: 8px;
  width: auto;
}

.notification-settings {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.switch-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.switch-label input {
  margin-right: 8px;
  width: auto;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .user-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: repeat(1, 1fr);
  }

  .avatar-selection {
    grid-template-columns: repeat(2, 1fr);
  }

  .interests-selection,
  .notification-settings {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .profile-container {
    padding: 10px;
  }

  .profile-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .edit-actions {
    width: 100%;
  }

  .save-button,
  .cancel-button {
    flex: 1;
  }

  .edit-button {
    width: 100%;
  }
}
</style>
