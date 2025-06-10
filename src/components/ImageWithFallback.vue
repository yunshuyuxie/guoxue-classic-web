<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import imageErrorHandler from '../utils/imageErrorHandler'

// 组件属性定义
interface Props {
  src: string
  alt?: string
  type?: string
  width?: string | number
  height?: string | number
  class?: string
  lazy?: boolean
  retryOnClick?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  type: 'default',
  width: 'auto',
  height: 'auto',
  class: '',
  lazy: true,
  retryOnClick: true,
})

// 状态变量
const imgSrc = ref(props.src)
const imgLoaded = ref(false)
const imgError = ref(false)
const originalSrc = ref(props.src)
const imgRef = ref<HTMLImageElement | null>(null)

// 处理图片加载错误
const handleError = () => {
  imgError.value = true

  if (imgRef.value) {
    // 使用错误处理工具生成本地占位图
    imageErrorHandler.handleImageError(imgRef.value, props.type, originalSrc.value)

    // 保存原始图片地址，以便需要时重试
    if (imgRef.value.getAttribute('data-original-src') !== originalSrc.value) {
      imgRef.value.setAttribute('data-original-src', originalSrc.value)
    }
  }
}

// 处理图片加载成功
const handleLoad = () => {
  imgLoaded.value = true
  imgError.value = false
}

// 重试加载原始图片
const retry = () => {
  if (props.retryOnClick && imgError.value) {
    imgSrc.value = originalSrc.value
    imgError.value = false
    imgLoaded.value = false
  }
}

// 生成自动下载占位图
const generateAndDownload = () => {
  const placeholderText = `图片加载失败\n${props.alt || '未知图片'}`
  const fileName = originalSrc.value.split('/').pop() || 'image'

  imageErrorHandler.generatePlaceholderImage(props.type, placeholderText, `placeholder-${fileName}`)
}

// 批量生成所有失败图片的占位图
const generateAll = () => {
  // 获取页面中所有加载失败的图片
  const failedImages = Array.from(document.querySelectorAll('img[data-original-src]'))
    .map((img) => img.getAttribute('data-original-src'))
    .filter(Boolean) as string[]

  if (failedImages.length > 0) {
    imageErrorHandler.batchGeneratePlaceholders(failedImages, props.type)
  }
}

// 监听src属性变化
watch(
  () => props.src,
  (newSrc) => {
    originalSrc.value = newSrc
    imgSrc.value = newSrc
    imgError.value = false
    imgLoaded.value = false
  },
)

onMounted(() => {
  // 如果图片已经在DOM中但加载失败，需要手动触发错误处理
  if (imgRef.value && imgRef.value.complete && imgRef.value.naturalWidth === 0) {
    handleError()
  }
})
</script>

<template>
  <div class="image-wrapper" :class="{ 'image-error': imgError, 'image-loaded': imgLoaded }">
    <img
      ref="imgRef"
      :src="imgSrc"
      :alt="alt"
      :width="width"
      :height="height"
      class="image-with-fallback"
      :class="[lazy ? 'lazy' : '']"
      @error="handleError"
      @load="handleLoad"
      @click="retry"
      :data-original-src="originalSrc"
      :data-image-type="type"
    />

    <!-- 加载中状态 -->
    <div v-if="!imgLoaded && !imgError" class="image-loading">
      <div class="spinner"></div>
    </div>

    <!-- 错误状态下显示额外操作 -->
    <div v-if="imgError" class="image-error-actions">
      <button class="retry-button" @click.stop="retry" title="重试加载">重试</button>
      <button class="download-button" @click.stop="generateAndDownload" title="下载占位图">
        下载
      </button>
      <button
        class="generate-all-button"
        @click.stop="generateAll"
        title="下载所有失败图片的占位图"
      >
        全部下载
      </button>
    </div>
  </div>
</template>

<style scoped>
.image-wrapper {
  position: relative;
  display: inline-block;
  overflow: hidden;
}

.image-with-fallback {
  display: block;
  transition: opacity 0.3s ease;
}

.image-with-fallback.lazy {
  opacity: 0;
}

.image-loaded .image-with-fallback.lazy {
  opacity: 1;
}

.image-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(132, 32, 41, 0.3);
  border-radius: 50%;
  border-top-color: #842029;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.image-error-actions {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-wrapper:hover .image-error-actions {
  opacity: 1;
}

.retry-button,
.download-button,
.generate-all-button {
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #842029;
  color: #842029;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
}

.retry-button:hover,
.download-button:hover,
.generate-all-button:hover {
  background-color: #842029;
  color: white;
}
</style>
