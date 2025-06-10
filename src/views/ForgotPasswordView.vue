<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 找回方式切换
const resetType = ref('phone') // phone 或 email

// 表单数据
const resetForm = ref({
  phone: '',
  smsCode: '',
  email: '',
  newPassword: '',
  confirmPassword: '',
  verificationCode: '',
  step: 1, // 1: 验证身份, 2: 设置新密码, 3: 完成
})

// 手机号验证码发送状态
const smsSent = ref(false)
const countdown = ref(60)
const countdownTimer = ref<number | null>(null)

// 错误信息
const formErrors = ref({
  phone: '',
  smsCode: '',
  email: '',
  verificationCode: '',
  newPassword: '',
  confirmPassword: '',
})

// 判断当前步骤表单是否可提交
const canSubmit = computed(() => {
  if (resetForm.value.step === 1) {
    if (resetType.value === 'phone') {
      return resetForm.value.phone && resetForm.value.smsCode
    } else {
      return resetForm.value.email && resetForm.value.verificationCode
    }
  } else if (resetForm.value.step === 2) {
    return (
      resetForm.value.newPassword &&
      resetForm.value.confirmPassword &&
      resetForm.value.newPassword === resetForm.value.confirmPassword
    )
  }
  return false
})

// 发送验证码
const sendSmsCode = () => {
  // 验证手机号
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(resetForm.value.phone)) {
    formErrors.value.phone = '请输入正确的手机号'
    return
  }

  // 清除错误
  formErrors.value.phone = ''

  // 模拟发送验证码
  smsSent.value = true
  countdown.value = 60

  // 启动倒计时
  countdownTimer.value = window.setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer.value as number)
      smsSent.value = false
    }
  }, 1000)

  // 实际项目中这里应该调用发送验证码的API
  alert(`验证码已发送至 ${resetForm.value.phone}`)
}

// 发送邮箱验证码
const sendEmailCode = () => {
  // 验证邮箱
  const emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/
  if (!emailReg.test(resetForm.value.email)) {
    formErrors.value.email = '请输入正确的邮箱'
    return
  }

  // 清除错误
  formErrors.value.email = ''

  // 模拟发送验证码
  alert(`验证码已发送至 ${resetForm.value.email}`)
}

// 验证身份
const verifyIdentity = () => {
  // 表单验证
  let hasError = false

  if (resetType.value === 'phone') {
    // 手机号验证
    if (!resetForm.value.phone) {
      formErrors.value.phone = '请输入手机号'
      hasError = true
    } else if (!/^1[3-9]\d{9}$/.test(resetForm.value.phone)) {
      formErrors.value.phone = '请输入正确的手机号'
      hasError = true
    } else {
      formErrors.value.phone = ''
    }

    // 验证码验证
    if (!resetForm.value.smsCode) {
      formErrors.value.smsCode = '请输入验证码'
      hasError = true
    } else if (!/^\d{6}$/.test(resetForm.value.smsCode)) {
      formErrors.value.smsCode = '验证码格式错误'
      hasError = true
    } else {
      formErrors.value.smsCode = ''
    }
  } else {
    // 邮箱验证
    if (!resetForm.value.email) {
      formErrors.value.email = '请输入邮箱'
      hasError = true
    } else if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(resetForm.value.email)) {
      formErrors.value.email = '请输入正确的邮箱'
      hasError = true
    } else {
      formErrors.value.email = ''
    }

    // 验证码验证
    if (!resetForm.value.verificationCode) {
      formErrors.value.verificationCode = '请输入验证码'
      hasError = true
    } else {
      formErrors.value.verificationCode = ''
    }
  }

  if (hasError) return

  // 模拟验证成功
  resetForm.value.step = 2
}

// 重置密码
const resetPassword = () => {
  // 表单验证
  let hasError = false

  // 密码验证
  if (!resetForm.value.newPassword) {
    formErrors.value.newPassword = '请输入新密码'
    hasError = true
  } else if (resetForm.value.newPassword.length < 6) {
    formErrors.value.newPassword = '密码长度不能少于6个字符'
    hasError = true
  } else {
    formErrors.value.newPassword = ''
  }

  // 确认密码验证
  if (!resetForm.value.confirmPassword) {
    formErrors.value.confirmPassword = '请确认密码'
    hasError = true
  } else if (resetForm.value.confirmPassword !== resetForm.value.newPassword) {
    formErrors.value.confirmPassword = '两次输入的密码不一致'
    hasError = true
  } else {
    formErrors.value.confirmPassword = ''
  }

  if (hasError) return

  // 模拟重置成功
  resetForm.value.step = 3
}

// 切换找回方式
const switchResetType = (type: string) => {
  resetType.value = type

  // 清除错误信息
  formErrors.value = {
    phone: '',
    smsCode: '',
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
  }
}

// 返回登录页
const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="forgot-container">
    <div class="forgot-card">
      <div class="forgot-header">
        <h2>找回密码</h2>
        <p>重置您的国学经典账号密码</p>
      </div>

      <!-- 步骤指示器 -->
      <div class="steps">
        <div class="step" :class="{ active: resetForm.step >= 1, completed: resetForm.step > 1 }">
          <div class="step-number">1</div>
          <div class="step-text">验证身份</div>
        </div>
        <div class="step-line" :class="{ active: resetForm.step > 1 }"></div>
        <div class="step" :class="{ active: resetForm.step >= 2, completed: resetForm.step > 2 }">
          <div class="step-number">2</div>
          <div class="step-text">设置新密码</div>
        </div>
        <div class="step-line" :class="{ active: resetForm.step > 2 }"></div>
        <div class="step" :class="{ active: resetForm.step >= 3 }">
          <div class="step-number">3</div>
          <div class="step-text">完成</div>
        </div>
      </div>

      <!-- 步骤1: 验证身份 -->
      <div v-if="resetForm.step === 1">
        <!-- 找回方式选择 -->
        <div class="reset-tabs">
          <div
            class="reset-tab"
            :class="{ active: resetType === 'phone' }"
            @click="switchResetType('phone')"
          >
            手机号找回
          </div>
          <div
            class="reset-tab"
            :class="{ active: resetType === 'email' }"
            @click="switchResetType('email')"
          >
            邮箱找回
          </div>
        </div>

        <!-- 手机号找回表单 -->
        <form v-if="resetType === 'phone'" @submit.prevent="verifyIdentity" class="reset-form">
          <div class="form-group">
            <label for="phone">手机号</label>
            <input
              type="tel"
              id="phone"
              v-model="resetForm.phone"
              placeholder="请输入注册时使用的手机号"
              :class="{ error: formErrors.phone }"
              maxlength="11"
            />
            <div v-if="formErrors.phone" class="error-message">{{ formErrors.phone }}</div>
          </div>

          <div class="form-group sms-code-group">
            <label for="smsCode">验证码</label>
            <div class="sms-code-input">
              <input
                type="text"
                id="smsCode"
                v-model="resetForm.smsCode"
                placeholder="请输入验证码"
                :class="{ error: formErrors.smsCode }"
                maxlength="6"
              />
              <button
                type="button"
                class="sms-code-button"
                @click="sendSmsCode"
                :disabled="smsSent"
              >
                {{ smsSent ? `重新发送(${countdown}s)` : '获取验证码' }}
              </button>
            </div>
            <div v-if="formErrors.smsCode" class="error-message">{{ formErrors.smsCode }}</div>
          </div>

          <button type="submit" class="reset-button" :disabled="!canSubmit">下一步</button>
        </form>

        <!-- 邮箱找回表单 -->
        <form v-else @submit.prevent="verifyIdentity" class="reset-form">
          <div class="form-group">
            <label for="email">邮箱</label>
            <input
              type="email"
              id="email"
              v-model="resetForm.email"
              placeholder="请输入注册时使用的邮箱"
              :class="{ error: formErrors.email }"
            />
            <div v-if="formErrors.email" class="error-message">{{ formErrors.email }}</div>
          </div>

          <div class="form-group sms-code-group">
            <label for="verificationCode">验证码</label>
            <div class="sms-code-input">
              <input
                type="text"
                id="verificationCode"
                v-model="resetForm.verificationCode"
                placeholder="请输入验证码"
                :class="{ error: formErrors.verificationCode }"
              />
              <button type="button" class="sms-code-button" @click="sendEmailCode">
                获取验证码
              </button>
            </div>
            <div v-if="formErrors.verificationCode" class="error-message">
              {{ formErrors.verificationCode }}
            </div>
          </div>

          <button type="submit" class="reset-button" :disabled="!canSubmit">下一步</button>
        </form>
      </div>

      <!-- 步骤2: 设置新密码 -->
      <div v-else-if="resetForm.step === 2">
        <form @submit.prevent="resetPassword" class="reset-form">
          <div class="form-group">
            <label for="newPassword">新密码</label>
            <input
              type="password"
              id="newPassword"
              v-model="resetForm.newPassword"
              placeholder="请设置新密码（不少于6位）"
              :class="{ error: formErrors.newPassword }"
            />
            <div v-if="formErrors.newPassword" class="error-message">
              {{ formErrors.newPassword }}
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">确认密码</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="resetForm.confirmPassword"
              placeholder="请再次输入新密码"
              :class="{ error: formErrors.confirmPassword }"
            />
            <div v-if="formErrors.confirmPassword" class="error-message">
              {{ formErrors.confirmPassword }}
            </div>
          </div>

          <button type="submit" class="reset-button" :disabled="!canSubmit">重置密码</button>
        </form>
      </div>

      <!-- 步骤3: 完成 -->
      <div v-else class="success-container">
        <div class="success-icon">✓</div>
        <h3>密码重置成功</h3>
        <p>您的密码已成功重置，请使用新密码登录</p>
        <button class="reset-button" @click="goToLogin">返回登录</button>
      </div>

      <div class="forgot-footer">
        <p>想起密码了? <a href="#" @click.prevent="goToLogin">立即登录</a></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.forgot-container {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f9f5f2;
  background-image: url('/images/login-bg.png');
  background-size: cover;
  background-position: center;
}

.forgot-card {
  width: 100%;
  max-width: 480px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.forgot-header {
  text-align: center;
  margin-bottom: 25px;
}

.forgot-header h2 {
  font-size: 24px;
  color: #842029;
  margin-bottom: 5px;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.forgot-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

/* 步骤指示器样式 */
.steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 10px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e0e0e0;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.step-text {
  font-size: 12px;
  color: #666;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background-color: #842029;
  color: white;
}

.step.active .step-text {
  color: #842029;
  font-weight: bold;
}

.step.completed .step-number {
  background-color: #4caf50;
  color: white;
}

.step-line {
  flex: 1;
  height: 2px;
  background-color: #e0e0e0;
  margin: 0 10px;
  margin-bottom: 30px;
  transition: all 0.3s ease;
}

.step-line.active {
  background-color: #4caf50;
}

/* 找回方式选择 */
.reset-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.reset-tab {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
  font-size: 14px;
}

.reset-tab.active {
  color: #842029;
  border-bottom: 2px solid #842029;
}

.reset-form {
  margin-bottom: 20px;
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

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  border-color: #842029;
  outline: none;
}

.form-group input.error {
  border-color: #f56c6c;
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 5px;
}

.sms-code-group .sms-code-input {
  display: flex;
  gap: 10px;
}

.sms-code-input input {
  flex: 1;
}

.sms-code-button {
  white-space: nowrap;
  padding: 0 15px;
  background-color: #842029;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.sms-code-button:hover {
  background-color: #6b1717;
}

.sms-code-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.reset-button {
  width: 100%;
  padding: 12px 0;
  background-color: #842029;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.reset-button:hover {
  background-color: #6b1717;
}

.reset-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.forgot-footer {
  text-align: center;
  font-size: 14px;
  margin-top: 20px;
}

.forgot-footer a {
  color: #842029;
  text-decoration: none;
}

/* 成功页面样式 */
.success-container {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  width: 60px;
  height: 60px;
  background-color: #4caf50;
  border-radius: 50%;
  color: white;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.success-container h3 {
  color: #333;
  margin-bottom: 10px;
}

.success-container p {
  color: #666;
  margin-bottom: 20px;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .forgot-container {
    padding: 10px;
    min-height: calc(100vh - 56px);
  }

  .forgot-card {
    padding: 20px;
    max-width: 100%;
  }

  .forgot-header h2 {
    font-size: 20px;
  }

  .reset-tab {
    padding: 10px 0;
    font-size: 13px;
  }

  .form-group input,
  .reset-button {
    padding: 12px 15px;
    font-size: 16px; /* 增大字体大小，更适合触屏操作 */
  }

  .sms-code-group .sms-code-input {
    flex-direction: column;
    gap: 10px;
  }

  .sms-code-button {
    width: 100%;
    padding: 12px 0;
  }

  .steps {
    padding: 0;
  }

  .step-text {
    font-size: 10px;
  }
}
</style>
