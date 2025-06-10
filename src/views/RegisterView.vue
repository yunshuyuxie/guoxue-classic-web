<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 注册表单数据
const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: '',
  phone: '',
  smsCode: '',
  email: '',
  agreeTerms: false,
})

// 手机号验证码发送状态
const smsSent = ref(false)
const countdown = ref(60)
const countdownTimer = ref<number | null>(null)

// 错误信息
const formErrors = ref({
  username: '',
  password: '',
  confirmPassword: '',
  phone: '',
  smsCode: '',
  email: '',
  agreeTerms: '',
})

// 判断表单是否可提交
const canSubmit = computed(() => {
  return (
    registerForm.value.username &&
    registerForm.value.password &&
    registerForm.value.confirmPassword &&
    registerForm.value.phone &&
    registerForm.value.smsCode &&
    registerForm.value.agreeTerms
  )
})

// 发送验证码
const sendSmsCode = () => {
  // 验证手机号
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(registerForm.value.phone)) {
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
  alert(`验证码已发送至 ${registerForm.value.phone}`)
}

// 提交注册表单
const submitRegister = () => {
  // 表单验证
  let hasError = false

  // 用户名验证
  if (!registerForm.value.username) {
    formErrors.value.username = '请输入用户名'
    hasError = true
  } else if (registerForm.value.username.length < 3) {
    formErrors.value.username = '用户名长度不能少于3个字符'
    hasError = true
  } else {
    formErrors.value.username = ''
  }

  // 密码验证
  if (!registerForm.value.password) {
    formErrors.value.password = '请输入密码'
    hasError = true
  } else if (registerForm.value.password.length < 6) {
    formErrors.value.password = '密码长度不能少于6个字符'
    hasError = true
  } else {
    formErrors.value.password = ''
  }

  // 确认密码验证
  if (!registerForm.value.confirmPassword) {
    formErrors.value.confirmPassword = '请确认密码'
    hasError = true
  } else if (registerForm.value.confirmPassword !== registerForm.value.password) {
    formErrors.value.confirmPassword = '两次输入的密码不一致'
    hasError = true
  } else {
    formErrors.value.confirmPassword = ''
  }

  // 手机号验证
  if (!registerForm.value.phone) {
    formErrors.value.phone = '请输入手机号'
    hasError = true
  } else if (!/^1[3-9]\d{9}$/.test(registerForm.value.phone)) {
    formErrors.value.phone = '请输入正确的手机号'
    hasError = true
  } else {
    formErrors.value.phone = ''
  }

  // 验证码验证
  if (!registerForm.value.smsCode) {
    formErrors.value.smsCode = '请输入验证码'
    hasError = true
  } else if (!/^\d{6}$/.test(registerForm.value.smsCode)) {
    formErrors.value.smsCode = '验证码格式错误'
    hasError = true
  } else {
    formErrors.value.smsCode = ''
  }

  // 邮箱验证
  if (
    registerForm.value.email &&
    !/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(registerForm.value.email)
  ) {
    formErrors.value.email = '请输入正确的邮箱格式'
    hasError = true
  } else {
    formErrors.value.email = ''
  }

  // 协议验证
  if (!registerForm.value.agreeTerms) {
    formErrors.value.agreeTerms = '请阅读并同意用户协议和隐私政策'
    hasError = true
  } else {
    formErrors.value.agreeTerms = ''
  }

  if (hasError) return

  // 实际项目中这里应该调用注册API
  // 模拟注册成功
  alert('注册成功，即将跳转到登录页面')

  // 跳转到登录页面
  router.push('/login')
}

// 跳转到登录页面
const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2>注册国学经典账号</h2>
        <p>加入我们，开启国学学习之旅</p>
      </div>

      <form @submit.prevent="submitRegister" class="register-form">
        <div class="form-group">
          <label for="username">用户名 <span class="required">*</span></label>
          <input
            type="text"
            id="username"
            v-model="registerForm.username"
            placeholder="请设置用户名（3-20个字符）"
            :class="{ error: formErrors.username }"
          />
          <div v-if="formErrors.username" class="error-message">{{ formErrors.username }}</div>
        </div>

        <div class="form-group">
          <label for="password">密码 <span class="required">*</span></label>
          <input
            type="password"
            id="password"
            v-model="registerForm.password"
            placeholder="请设置密码（不少于6位）"
            :class="{ error: formErrors.password }"
          />
          <div v-if="formErrors.password" class="error-message">{{ formErrors.password }}</div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">确认密码 <span class="required">*</span></label>
          <input
            type="password"
            id="confirmPassword"
            v-model="registerForm.confirmPassword"
            placeholder="请再次输入密码"
            :class="{ error: formErrors.confirmPassword }"
          />
          <div v-if="formErrors.confirmPassword" class="error-message">
            {{ formErrors.confirmPassword }}
          </div>
        </div>

        <div class="form-group">
          <label for="phone">手机号 <span class="required">*</span></label>
          <input
            type="tel"
            id="phone"
            v-model="registerForm.phone"
            placeholder="请输入手机号"
            :class="{ error: formErrors.phone }"
            maxlength="11"
          />
          <div v-if="formErrors.phone" class="error-message">{{ formErrors.phone }}</div>
        </div>

        <div class="form-group sms-code-group">
          <label for="smsCode">验证码 <span class="required">*</span></label>
          <div class="sms-code-input">
            <input
              type="text"
              id="smsCode"
              v-model="registerForm.smsCode"
              placeholder="请输入验证码"
              :class="{ error: formErrors.smsCode }"
              maxlength="6"
            />
            <button type="button" class="sms-code-button" @click="sendSmsCode" :disabled="smsSent">
              {{ smsSent ? `重新发送(${countdown}s)` : '获取验证码' }}
            </button>
          </div>
          <div v-if="formErrors.smsCode" class="error-message">{{ formErrors.smsCode }}</div>
        </div>

        <div class="form-group">
          <label for="email">邮箱（选填）</label>
          <input
            type="email"
            id="email"
            v-model="registerForm.email"
            placeholder="请输入邮箱地址"
            :class="{ error: formErrors.email }"
          />
          <div v-if="formErrors.email" class="error-message">{{ formErrors.email }}</div>
        </div>

        <div class="form-terms">
          <label class="terms-label" :class="{ 'terms-error': formErrors.agreeTerms }">
            <input type="checkbox" v-model="registerForm.agreeTerms" />
            <span>我已阅读并同意 <a href="#">《用户协议》</a> 和 <a href="#">《隐私政策》</a></span>
          </label>
          <div v-if="formErrors.agreeTerms" class="error-message">{{ formErrors.agreeTerms }}</div>
        </div>

        <button type="submit" class="register-button" :disabled="!canSubmit">注册</button>
      </form>

      <div class="register-footer">
        <p>已有账号? <a href="#" @click.prevent="goToLogin">立即登录</a></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f9f5f2;
  background-image: url('/images/register-bg.png');
  background-size: cover;
  background-position: center;
}

.register-card {
  width: 100%;
  max-width: 480px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 25px;
}

.register-header h2 {
  font-size: 24px;
  color: #842029;
  margin-bottom: 5px;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.register-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.register-form {
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

.required {
  color: #f56c6c;
  margin-left: 2px;
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

.form-terms {
  margin-bottom: 20px;
}

.terms-label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  font-size: 13px;
}

.terms-label input {
  margin-right: 5px;
  margin-top: 3px;
}

.terms-label a {
  color: #842029;
  text-decoration: none;
}

.terms-error {
  color: #f56c6c;
}

.register-button {
  width: 100%;
  padding: 12px 0;
  background-color: #842029;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.register-button:hover {
  background-color: #6b1717;
}

.register-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.register-footer {
  text-align: center;
  font-size: 14px;
}

.register-footer a {
  color: #842029;
  text-decoration: none;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .register-container {
    padding: 10px;
    min-height: calc(100vh - 56px);
  }

  .register-card {
    padding: 20px;
    max-width: 100%;
  }

  .register-header h2 {
    font-size: 20px;
  }

  .form-group input,
  .register-button {
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
}
</style>
