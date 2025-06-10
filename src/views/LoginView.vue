<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 登录方式切换
const loginType = ref('password') // password 或 phone

// 表单数据
const loginForm = ref({
  username: '',
  password: '',
  phone: '',
  smsCode: '',
  rememberMe: false,
})

// 手机号验证码发送状态
const smsSent = ref(false)
const countdown = ref(60)
const countdownTimer = ref<number | null>(null)

// 错误信息
const formErrors = ref({
  username: '',
  password: '',
  phone: '',
  smsCode: '',
})

// 判断表单是否可提交
const canSubmit = computed(() => {
  if (loginType.value === 'password') {
    return loginForm.value.username && loginForm.value.password
  } else {
    return loginForm.value.phone && loginForm.value.smsCode
  }
})

// 发送验证码
const sendSmsCode = () => {
  // 验证手机号
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(loginForm.value.phone)) {
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
  alert(`验证码已发送至 ${loginForm.value.phone}`)
}

// 提交登录表单
const submitLogin = () => {
  // 表单验证
  let hasError = false

  if (loginType.value === 'password') {
    if (!loginForm.value.username) {
      formErrors.value.username = '请输入用户名'
      hasError = true
    } else {
      formErrors.value.username = ''
    }

    if (!loginForm.value.password) {
      formErrors.value.password = '请输入密码'
      hasError = true
    } else {
      formErrors.value.password = ''
    }
  } else {
    if (!loginForm.value.phone) {
      formErrors.value.phone = '请输入手机号'
      hasError = true
    } else if (!/^1[3-9]\d{9}$/.test(loginForm.value.phone)) {
      formErrors.value.phone = '请输入正确的手机号'
      hasError = true
    } else {
      formErrors.value.phone = ''
    }

    if (!loginForm.value.smsCode) {
      formErrors.value.smsCode = '请输入验证码'
      hasError = true
    } else if (!/^\d{6}$/.test(loginForm.value.smsCode)) {
      formErrors.value.smsCode = '验证码格式错误'
      hasError = true
    } else {
      formErrors.value.smsCode = ''
    }
  }

  if (hasError) return

  // 实际项目中这里应该调用登录API
  // 模拟登录成功
  localStorage.setItem('isLoggedIn', 'true')

  // 重定向到首页或之前的页面
  router.push('/')
}

// 切换登录方式
const switchLoginType = (type: string) => {
  loginType.value = type

  // 清除错误信息
  formErrors.value = {
    username: '',
    password: '',
    phone: '',
    smsCode: '',
  }
}

// 跳转到注册页面
const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>欢迎登录国学经典</h2>
        <p>传承经典，滋养心灵</p>
      </div>

      <!-- 登录方式选择 -->
      <div class="login-tabs">
        <div
          class="login-tab"
          :class="{ active: loginType === 'password' }"
          @click="switchLoginType('password')"
        >
          账号密码登录
        </div>
        <div
          class="login-tab"
          :class="{ active: loginType === 'phone' }"
          @click="switchLoginType('phone')"
        >
          手机号快捷登录
        </div>
      </div>

      <!-- 账号密码登录表单 -->
      <form v-if="loginType === 'password'" @submit.prevent="submitLogin" class="login-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            type="text"
            id="username"
            v-model="loginForm.username"
            placeholder="请输入用户名/邮箱"
            :class="{ error: formErrors.username }"
          />
          <div v-if="formErrors.username" class="error-message">{{ formErrors.username }}</div>
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input
            type="password"
            id="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
            :class="{ error: formErrors.password }"
          />
          <div v-if="formErrors.password" class="error-message">{{ formErrors.password }}</div>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="loginForm.rememberMe" />
            <span>记住我</span>
          </label>
          <a href="#" class="forgot-password">忘记密码?</a>
        </div>

        <button type="submit" class="login-button" :disabled="!canSubmit">登录</button>
      </form>

      <!-- 手机号登录表单 -->
      <form v-else @submit.prevent="submitLogin" class="login-form">
        <div class="form-group">
          <label for="phone">手机号</label>
          <input
            type="tel"
            id="phone"
            v-model="loginForm.phone"
            placeholder="请输入手机号"
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
              v-model="loginForm.smsCode"
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

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="loginForm.rememberMe" />
            <span>记住我</span>
          </label>
        </div>

        <button type="submit" class="login-button" :disabled="!canSubmit">登录</button>
      </form>

      <div class="login-footer">
        <p>还没有账号? <a href="#" @click.prevent="goToRegister">立即注册</a></p>
        <div class="other-login">
          <p>其他登录方式</p>
          <div class="social-logins">
            <span class="social-icon wechat"></span>
            <span class="social-icon weibo"></span>
            <span class="social-icon qq"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
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

.login-card {
  width: 100%;
  max-width: 420px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 25px;
}

.login-header h2 {
  font-size: 24px;
  color: #842029;
  margin-bottom: 5px;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.login-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.login-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.login-tab {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
  font-size: 14px;
}

.login-tab.active {
  color: #842029;
  border-bottom: 2px solid #842029;
}

.login-form {
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 13px;
}

.remember-me {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.remember-me input {
  margin-right: 5px;
}

.forgot-password {
  color: #842029;
  text-decoration: none;
}

.login-button {
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

.login-button:hover {
  background-color: #6b1717;
}

.login-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.login-footer {
  text-align: center;
  font-size: 14px;
}

.login-footer a {
  color: #842029;
  text-decoration: none;
}

.other-login {
  margin-top: 20px;
}

.other-login p {
  color: #999;
  position: relative;
  margin-bottom: 15px;
}

.other-login p::before,
.other-login p::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 60px;
  height: 1px;
  background-color: #eee;
}

.other-login p::before {
  left: 30px;
}

.other-login p::after {
  right: 30px;
}

.social-logins {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 24px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.social-icon:hover {
  background-color: #e0e0e0;
}

.wechat {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2307C160' d='M9.5,4C5.36,4 2,6.69 2,10C2,11.89 3.08,13.56 4.78,14.66L4,17L6.5,15.5C7.39,15.81 8.37,16 9.41,16C9.15,15.37 9,14.7 9,14C9,10.69 12.13,8 16,8C16.19,8 16.38,8 16.56,8.03C15.41,5.74 12.7,4 9.5,4M7,9A1,1 0 0,1 8,10A1,1 0 0,1 7,11A1,1 0 0,1 6,10A1,1 0 0,1 7,9M12,9A1,1 0 0,1 13,10A1,1 0 0,1 12,11A1,1 0 0,1 11,10A1,1 0 0,1 12,9M16,10C12.69,10 10,12.13 10,14.5C10,16.87 12.69,19 16,19C16.67,19 17.31,18.9 17.91,18.7L20,20L19.36,18.1C20.64,17.1 22,15.87 22,14.5C22,12.13 19.31,10 16,10M14,12.5A1,1 0 0,1 15,13.5A1,1 0 0,1 14,14.5A1,1 0 0,1 13,13.5A1,1 0 0,1 14,12.5M18,12.5A1,1 0 0,1 19,13.5A1,1 0 0,1 18,14.5A1,1 0 0,1 17,13.5A1,1 0 0,1 18,12.5Z' /%3E%3C/svg%3E");
}

.weibo {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23E6162D' d='M9.82,13.78C7.46,14.85 7.4,17.2 9.55,18C12,18.91 14,17.3 14.46,15.5C14.75,14.38 14.05,13.25 12.33,12.95C10.95,12.72 9.44,13.22 9.5,13.5C9.06,13.34 7.5,13.12 8,12.5C8.5,11.89 8.41,10.27 7,10.7C5.5,11.15 4.5,12.32 5,13.5C5.5,14.68 9.82,13.78 9.82,13.78M14.42,7.5C16.7,9.57 15.91,12.41 15.91,12.41C15.91,12.41 16.03,10.44 14.4,9C12.76,7.56 9.69,7.97 9.69,7.97C9.69,7.97 12.14,5.43 14.42,7.5M18.16,1.62C20.91,4.19 21.31,7.86 21.31,7.86C21.31,7.86 19.86,5.12 17.5,3.75C15.13,2.37 12.12,3.62 12.12,3.62C12.12,3.62 15.42,-0.96 18.16,1.62M14.97,4.6C15.73,4.6 16.34,5.21 16.34,5.97C16.34,6.72 15.73,7.33 14.97,7.33C14.2,7.33 13.61,6.72 13.61,5.97C13.61,5.21 14.2,4.6 14.97,4.6M9.04,18.15C6.8,18.89 4.3,19.12 3.28,17.43C2.43,16 3.39,14.14 5.75,12.92C8.11,11.71 10.89,11.35 12.04,12.71C13.16,14.04 11.71,17.26 9.04,18.15Z' /%3E%3C/svg%3E");
}

.qq {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%231E9BF7' d='M11.613,3.326c-3.432,0-6.177,2.086-6.177,4.685c0,1.61,0.414,2.732,1.04,3.783c-0.222,0.475-0.506,0.996-0.786,1.392c-0.414,0.586-0.452,1.043-0.106,1.334c0.317,0.266,0.857,0.123,1.396-0.06c0.476-0.162,1.073-0.483,1.444-0.723c0.775,0.318,1.58,0.537,2.598,0.553c-0.458,1.227-1.21,1.824-2.222,2.044c-0.681,0.148-1.442,0.148-1.924,0.016c-0.555-0.153-0.571-0.465-0.492-0.93c0.03-0.176,0.06-0.352,0.06-0.612c0-0.176-0.146-0.352-0.352-0.352c-0.03,0-0.046,0-0.077,0c-0.03,0.016-0.07,0.016-0.1,0.03c-0.891,0.339-1.486,1.01-1.486,1.774c0,1.105,1.602,1.948,3.617,1.948c2.177,0,4.116-1.001,4.62-2.351c0.046-0.123,0.076-0.261,0.076-0.4c0-0.321-0.146-0.642-0.39-0.979c1.464-0.512,2.446-1.424,3-2.537c0.354,0.24,0.955,0.552,1.413,0.705c0.538,0.183,1.08,0.326,1.396,0.06c0.346-0.291,0.307-0.748-0.106-1.334c-0.282-0.397-0.559-0.902-0.786-1.393c0.63-1.05,1.04-2.172,1.04-3.782C17.79,5.413,15.045,3.326,11.613,3.326z' /%3E%3C/svg%3E");
}

/* 移动端适配 */
@media (max-width: 480px) {
  .login-container {
    padding: 10px;
    min-height: calc(100vh - 56px);
  }

  .login-card {
    padding: 20px;
    max-width: 100%;
  }

  .login-header h2 {
    font-size: 20px;
  }

  .login-tab {
    padding: 10px 0;
    font-size: 13px;
  }

  .form-group input,
  .login-button {
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

  .other-login p::before,
  .other-login p::after {
    width: 40px;
  }

  .other-login p::before {
    left: 10px;
  }

  .other-login p::after {
    right: 10px;
  }
}
</style>
