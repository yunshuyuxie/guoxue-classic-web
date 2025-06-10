/**
 * 图片错误处理工具
 * 自动处理图片加载失败情况，生成本地替代图片
 */

// 图片类别常量
const IMAGE_TYPES = {
  BOOK_COVER: 'book-cover',
  AVATAR: 'avatar',
  ARTICLE: 'article',
  BANNER: 'banner',
  QUOTE: 'quote',
  DEFAULT: 'default',
}

// 占位图配置
interface PlaceholderConfig {
  width: number
  height: number
  bgColor: string
  textColor: string
  text: string
  fontSize: number
}

// 不同类型的占位图配置
const PLACEHOLDER_CONFIGS: Record<string, PlaceholderConfig> = {
  [IMAGE_TYPES.BOOK_COVER]: {
    width: 200,
    height: 300,
    bgColor: '#f9e9d6',
    textColor: '#842029',
    text: '经典书籍',
    fontSize: 18,
  },
  [IMAGE_TYPES.AVATAR]: {
    width: 120,
    height: 120,
    bgColor: '#e6f7ff',
    textColor: '#842029',
    text: '用户头像',
    fontSize: 14,
  },
  [IMAGE_TYPES.ARTICLE]: {
    width: 800,
    height: 450,
    bgColor: '#f0f7ec',
    textColor: '#842029',
    text: '文章配图',
    fontSize: 24,
  },
  [IMAGE_TYPES.BANNER]: {
    width: 1200,
    height: 300,
    bgColor: '#eae2d8',
    textColor: '#842029',
    text: '国学经典',
    fontSize: 36,
  },
  [IMAGE_TYPES.QUOTE]: {
    width: 600,
    height: 400,
    bgColor: '#f5f5f5',
    textColor: '#842029',
    text: '经典名句',
    fontSize: 24,
  },
  [IMAGE_TYPES.DEFAULT]: {
    width: 300,
    height: 200,
    bgColor: '#f7f7f7',
    textColor: '#842029',
    text: '图片加载失败',
    fontSize: 16,
  },
}

/**
 * 生成图片占位符并下载到本地
 * @param type 图片类型
 * @param customText 自定义文本
 * @param filename 保存的文件名
 */
export function generatePlaceholderImage(
  type: string = IMAGE_TYPES.DEFAULT,
  customText?: string,
  filename?: string,
): string {
  // 获取配置
  const config = PLACEHOLDER_CONFIGS[type] || PLACEHOLDER_CONFIGS[IMAGE_TYPES.DEFAULT]
  const text = customText || config.text

  // 创建canvas
  const canvas = document.createElement('canvas')
  canvas.width = config.width
  canvas.height = config.height

  // 获取绘图上下文
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  // 绘制背景
  ctx.fillStyle = config.bgColor
  ctx.fillRect(0, 0, config.width, config.height)

  // 绘制边框
  ctx.strokeStyle = config.textColor
  ctx.lineWidth = 3
  ctx.strokeRect(5, 5, config.width - 10, config.height - 10)

  // 绘制文本
  ctx.fillStyle = config.textColor
  ctx.font = `${config.fontSize}px "STXihei", "Microsoft YaHei", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // 添加文本内容
  const lines = text.split('\n')
  const lineHeight = config.fontSize * 1.5
  const startY = config.height / 2 - ((lines.length - 1) * lineHeight) / 2

  lines.forEach((line, index) => {
    ctx.fillText(line, config.width / 2, startY + index * lineHeight)
  })

  // 导出为base64字符串
  const dataUrl = canvas.toDataURL('image/png')

  // 如果提供了文件名，则下载文件
  if (filename) {
    downloadImage(dataUrl, filename)
  }

  return dataUrl
}

/**
 * 下载图片到本地
 * @param dataUrl 图片的Data URL
 * @param filename 文件名
 */
function downloadImage(dataUrl: string, filename: string): void {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename.endsWith('.png') ? filename : `${filename}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 处理图片加载错误
 * @param imgElement 图片元素
 * @param type 图片类型
 * @param originalSrc 原始图片地址
 */
export function handleImageError(
  imgElement: HTMLImageElement,
  type: string = IMAGE_TYPES.DEFAULT,
  originalSrc?: string,
): void {
  // 生成占位图
  const imgSrc = originalSrc || imgElement.src
  const fileName = getFileNameFromUrl(imgSrc)

  // 提取文件名用于生成占位文本
  const textMatch = fileName.match(/([^\/]+)(?:\.\w+)?$/)
  const placeholderText = textMatch
    ? decodeURIComponent(textMatch[1]).replace(/[-_]/g, ' ')
    : '图片加载失败'

  // 生成占位图
  const placeholderSrc = generatePlaceholderImage(type, placeholderText)

  // 设置为图片源
  imgElement.src = placeholderSrc
  imgElement.setAttribute('data-original-src', imgSrc)
  imgElement.setAttribute('title', `原图加载失败: ${placeholderText}`)

  // 添加重试加载功能
  imgElement.onclick = () => {
    const originalSrc = imgElement.getAttribute('data-original-src')
    if (originalSrc) {
      imgElement.src = originalSrc
    }
  }
}

/**
 * 从URL中提取文件名
 * @param url 图片URL
 * @returns 文件名
 */
function getFileNameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.pathname.split('/').pop() || 'unknown'
  } catch {
    // 处理无效URL - 不使用debugger
    const parts = url.split('/')
    return parts.pop() || 'unknown'
  }
}

/**
 * 初始化全局图片错误处理
 */
export function initGlobalImageErrorHandler(): void {
  // 为所有图片添加错误处理
  document.addEventListener(
    'error',
    (event) => {
      const target = event.target as HTMLElement

      // 只处理图片元素
      if (target.tagName === 'IMG') {
        const imgElement = target as HTMLImageElement

        // 判断图片类型
        let type = IMAGE_TYPES.DEFAULT

        if (imgElement.classList.contains('book-cover')) {
          type = IMAGE_TYPES.BOOK_COVER
        } else if (imgElement.classList.contains('avatar')) {
          type = IMAGE_TYPES.AVATAR
        } else if (imgElement.classList.contains('article-img')) {
          type = IMAGE_TYPES.ARTICLE
        } else if (imgElement.classList.contains('banner')) {
          type = IMAGE_TYPES.BANNER
        } else if (imgElement.classList.contains('quote-img')) {
          type = IMAGE_TYPES.QUOTE
        }

        handleImageError(imgElement, type)
      }
    },
    true,
  )
}

/**
 * 批量生成占位图并保存到本地
 * @param urls 失败的图片URL数组
 * @param type 图片类型
 */
export function batchGeneratePlaceholders(
  urls: string[],
  type: string = IMAGE_TYPES.DEFAULT,
): void {
  urls.forEach((url, index) => {
    const fileName = getFileNameFromUrl(url)
    const text = `图片加载失败\n${fileName}`
    generatePlaceholderImage(type, text, `placeholder-${index + 1}-${fileName}`)
  })
}

// 导出常量和方法
export { IMAGE_TYPES }

export default {
  generatePlaceholderImage,
  handleImageError,
  initGlobalImageErrorHandler,
  batchGeneratePlaceholders,
  IMAGE_TYPES,
}
