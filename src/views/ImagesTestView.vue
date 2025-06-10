<script setup lang="ts">
import { ref } from 'vue'
import imageErrorHandler from '../utils/imageErrorHandler'

// 测试图片列表
const errorImages = [
  'images/books/lunyu.png',
  'images/books/daxue.png',
  'images/books/zhongyong.png',
  'images/books/mengzi.png',
]

// 测试类型
const imageTypes = Object.keys(imageErrorHandler.IMAGE_TYPES)
const selectedType = ref('default')

// 生成所有测试图片的占位图
const generateAllPlaceholders = () => {
  imageErrorHandler.batchGeneratePlaceholders(errorImages, selectedType.value)
}

// 生成单个图片的占位图
const generateSinglePlaceholder = (url: string, index: number) => {
  const fileName = url.split('/').pop() || `image-${index}`
  imageErrorHandler.generatePlaceholderImage(
    selectedType.value,
    `测试图片 ${index + 1}\n${fileName}`,
    `test-placeholder-${index + 1}`,
  )
}
</script>

<template>
  <div class="images-test-container">
    <h1>图片错误处理测试</h1>

    <div class="options-panel">
      <h2>测试选项</h2>
      <div class="form-group">
        <label for="imageType">选择占位图类型：</label>
        <select id="imageType" v-model="selectedType">
          <option v-for="type in imageTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </div>

      <div class="actions">
        <button class="primary-button" @click="generateAllPlaceholders">
          生成所有图片的占位图
        </button>
      </div>
    </div>

    <div class="test-sections">
      <section class="test-section">
        <h2>方法1：使用普通img标签 (全局错误处理)</h2>
        <div class="images-grid">
          <div v-for="(url, index) in errorImages" :key="url" class="image-item">
            <h3>测试图片 {{ index + 1 }}</h3>
            <img :src="url" :alt="`测试图片 ${index + 1}`" :class="selectedType" />
            <div class="image-info">
              <p>URL: {{ url }}</p>
              <button @click="generateSinglePlaceholder(url, index)" class="action-button">
                生成占位图
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="test-section">
        <h2>方法2：使用ImageWithFallback组件</h2>
        <div class="images-grid">
          <div v-for="(url, index) in errorImages" :key="url" class="image-item">
            <h3>测试图片 {{ index + 1 }}</h3>
            <ImageWithFallback
              :src="url"
              :alt="`测试图片 ${index + 1}`"
              :type="selectedType"
              width="300"
              height="200"
            />
            <div class="image-info">
              <p>URL: {{ url }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.images-test-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 30px;
}

.options-panel {
  background-color: #f9f5f0;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

select {
  padding: 8px;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.actions {
  margin-top: 20px;
}

.primary-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.primary-button:hover {
  background-color: var(--primary-hover);
}

.test-sections {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.test-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.test-section h2 {
  color: var(--primary-color);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.image-item {
  display: flex;
  flex-direction: column;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.image-item h3 {
  padding: 10px;
  margin: 0;
  background-color: #f5f5f5;
  font-size: 16px;
}

.image-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.image-info {
  padding: 10px;
  font-size: 12px;
  color: #666;
}

.image-info p {
  margin: 0 0 10px 0;
  word-break: break-all;
}

.action-button {
  background-color: #eee;
  border: 1px solid #ddd;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.action-button:hover {
  background-color: #e0e0e0;
}

@media (max-width: 768px) {
  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}
</style>
