<script setup lang="ts">
import { ref, onMounted } from 'vue'
import imageErrorHandler from '../utils/imageErrorHandler'

// 失败图片列表
const failedImages = ref<string[]>([])

// 选择的图片类型
const selectedType = ref('default')

// 图片类型列表
const imageTypes = Object.keys(imageErrorHandler.IMAGE_TYPES)

// 获取页面中所有加载失败的图片
const refreshFailedImagesList = () => {
  failedImages.value = Array.from(document.querySelectorAll('img[data-original-src]'))
    .map((img) => img.getAttribute('data-original-src'))
    .filter(Boolean) as string[]
}

// 批量生成所有失败图片的占位图
const generateAllPlaceholders = () => {
  if (failedImages.value.length > 0) {
    imageErrorHandler.batchGeneratePlaceholders(failedImages.value, selectedType.value)
  }
}

// 生成单个图片的占位图
const generateSinglePlaceholder = (url: string, index: number) => {
  const fileName = url.split('/').pop() || `image-${index}`
  imageErrorHandler.generatePlaceholderImage(
    selectedType.value,
    `图片${index + 1}\n${fileName}`,
    `placeholder-${index + 1}`,
  )
}

// 初始化
onMounted(() => {
  // 延迟一点，确保页面已完全加载
  setTimeout(refreshFailedImagesList, 1000)

  // 添加错误事件监听，刷新失败图片列表
  document.addEventListener(
    'error',
    (event) => {
      if (event.target instanceof HTMLImageElement) {
        setTimeout(refreshFailedImagesList, 200)
      }
    },
    true,
  )
})
</script>

<template>
  <div class="image-error-handler" v-if="failedImages.length > 0">
    <div class="handler-header">
      <h3>图片错误处理工具</h3>
      <span class="badge">{{ failedImages.length }}</span>
    </div>

    <div class="handler-content">
      <div class="control-panel">
        <div class="form-group">
          <label for="placeholderType">占位图类型：</label>
          <select id="placeholderType" v-model="selectedType">
            <option v-for="type in imageTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>

        <button class="generate-all-button" @click="generateAllPlaceholders">生成所有占位图</button>

        <button class="refresh-button" @click="refreshFailedImagesList">刷新列表</button>
      </div>

      <div class="failed-images-list">
        <div v-for="(url, index) in failedImages" :key="url" class="failed-image-item">
          <div class="image-url">{{ url }}</div>
          <button class="generate-button" @click="generateSinglePlaceholder(url, index)">
            生成
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-error-handler {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  overflow: hidden;
  font-size: 14px;
}

.handler-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: var(--primary-color);
  color: white;
}

.handler-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.badge {
  background-color: white;
  color: var(--primary-color);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.handler-content {
  padding: 15px;
}

.control-panel {
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

select {
  width: 100%;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.generate-all-button,
.refresh-button {
  width: 100%;
  padding: 8px;
  margin-top: 8px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.refresh-button {
  background-color: #666;
}

.generate-all-button:hover {
  background-color: var(--primary-hover);
}

.refresh-button:hover {
  background-color: #555;
}

.failed-images-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 4px;
}

.failed-image-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.failed-image-item:last-child {
  border-bottom: none;
}

.image-url {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 75%;
}

.generate-button {
  background-color: #eee;
  border: 1px solid #ddd;
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.generate-button:hover {
  background-color: #e0e0e0;
}
</style>
