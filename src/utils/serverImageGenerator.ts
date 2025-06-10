/**
 * 服务器端图片生成工具
 * 用于在服务器端处理图片加载失败情况，生成本地占位图片
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { createCanvas } from 'canvas'

// 图片类别常量
export const IMAGE_TYPES = {
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
 * 确保目录存在
 * @param dirPath 目录路径
 */
function ensureDirectoryExists(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
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
    // 处理无效URL
    const parts = url.split('/')
    return parts.pop() || 'unknown'
  }
}

/**
 * 生成图片占位符并保存到本地
 * @param type 图片类型
 * @param customText 自定义文本
 * @param outputPath 输出路径
 * @returns 保存的文件路径
 */
export function generatePlaceholderImageServer(
  type: string = IMAGE_TYPES.DEFAULT,
  customText?: string,
  outputPath?: string,
): string {
  // 获取配置
  const config = PLACEHOLDER_CONFIGS[type] || PLACEHOLDER_CONFIGS[IMAGE_TYPES.DEFAULT]
  const text = customText || config.text

  // 创建canvas
  const canvas = createCanvas(config.width, config.height)
  const ctx = canvas.getContext('2d')

  // 绘制背景
  ctx.fillStyle = config.bgColor
  ctx.fillRect(0, 0, config.width, config.height)

  // 绘制边框
  ctx.strokeStyle = config.textColor
  ctx.lineWidth = 3
  ctx.strokeRect(5, 5, config.width - 10, config.height - 10)

  // 绘制文本
  ctx.fillStyle = config.textColor
  ctx.font = `${config.fontSize}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // 添加文本内容
  const lines = text.split('\n')
  const lineHeight = config.fontSize * 1.5
  const startY = config.height / 2 - ((lines.length - 1) * lineHeight) / 2

  lines.forEach((line, index) => {
    ctx.fillText(line, config.width / 2, startY + index * lineHeight)
  })

  // 生成输出路径
  let saveFilePath = 'placeholder.png'
  if (outputPath) {
    // 确保输出目录存在
    const dir = dirname(outputPath)
    ensureDirectoryExists(dir)
    saveFilePath = outputPath
  }

  // 导出为PNG并保存
  const buffer = canvas.toBuffer('image/png')
  writeFileSync(saveFilePath, buffer)

  return saveFilePath
}

/**
 * 批量生成图片占位符
 * @param urls 失败的图片URL数组
 * @param outputDir 输出目录
 * @param type 图片类型
 * @returns 生成的文件路径数组
 */
export function batchGeneratePlaceholdersServer(
  urls: string[],
  outputDir: string = 'public/images/placeholders',
  type: string = IMAGE_TYPES.DEFAULT,
): string[] {
  // 确保输出目录存在
  ensureDirectoryExists(outputDir)

  // 生成每个URL的占位图
  return urls.map((url, index) => {
    const fileName = getFileNameFromUrl(url)
    const text = `图片加载失败\n${fileName}`
    const outputPath = join(outputDir, `placeholder-${index + 1}-${fileName}.png`)

    return generatePlaceholderImageServer(type, text, outputPath)
  })
}

/**
 * 处理图片URL并生成占位图片
 * @param imageUrl 图片URL
 * @param outputDir 输出目录
 * @param type 图片类型
 * @returns 生成的文件路径
 */
export function handleImageUrlServer(
  imageUrl: string,
  outputDir: string = 'public/images/placeholders',
  type: string = IMAGE_TYPES.DEFAULT,
): string {
  // 确保输出目录存在
  ensureDirectoryExists(outputDir)

  // 从URL中提取文件名
  const fileName = getFileNameFromUrl(imageUrl)

  // 创建输出路径
  const outputPath = join(outputDir, `${fileName}.png`)

  // 生成并保存占位图
  return generatePlaceholderImageServer(type, `图片加载失败\n${fileName}`, outputPath)
}

// 导出默认对象
export default {
  generatePlaceholderImageServer,
  batchGeneratePlaceholdersServer,
  handleImageUrlServer,
  IMAGE_TYPES,
}
