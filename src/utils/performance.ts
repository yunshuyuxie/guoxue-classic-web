/**
 * 性能监控工具类
 * 用于监控应用的各项性能指标
 */

// 是否开启性能监控
const isPerformanceEnabled =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true'

/**
 * 标记性能点
 * @param markName 标记名称
 */
export function markPerformance(markName: string): void {
  if (!isPerformanceEnabled) return
  if (window.performance && window.performance.mark) {
    window.performance.mark(markName)
  }
}

/**
 * 测量两个标记点之间的性能
 * @param measureName 测量名称
 * @param startMarkName 开始标记名称
 * @param endMarkName 结束标记名称
 */
export function measurePerformance(
  measureName: string,
  startMarkName: string,
  endMarkName: string,
): void {
  if (!isPerformanceEnabled) return
  if (window.performance && window.performance.measure) {
    try {
      window.performance.measure(measureName, startMarkName, endMarkName)
      const measures = window.performance.getEntriesByName(measureName)
      if (measures.length) {
        console.log(`${measureName}: ${measures[0].duration.toFixed(2)}ms`)
      }
    } catch (error) {
      console.error('Performance measurement error:', error)
    }
  }
}

/**
 * 测量组件渲染性能
 * @param componentName 组件名称
 * @returns 返回开始和结束函数
 */
export function measureComponentRender(componentName: string): {
  start: () => void
  end: () => void
} {
  const startMark = `${componentName}-render-start`
  const endMark = `${componentName}-render-end`
  const measureName = `${componentName}-render-time`

  return {
    start: () => markPerformance(startMark),
    end: () => {
      markPerformance(endMark)
      measurePerformance(measureName, startMark, endMark)
    },
  }
}

/**
 * 报告关键Web性能指标
 */
export function reportWebVitals(): void {
  if (!isPerformanceEnabled) return

  // 确保浏览器支持Performance API
  if (!window.performance || !window.performance.timing) {
    return
  }

  // 等待页面完全加载
  window.addEventListener('load', () => {
    // 延迟一点，确保数据已可用
    setTimeout(() => {
      const timing = window.performance.timing

      // 计算性能指标
      const perfData = {
        // DNS查找时间
        dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
        // TCP连接时间
        tcpConnection: timing.connectEnd - timing.connectStart,
        // 服务器响应时间
        serverResponse: timing.responseStart - timing.requestStart,
        // 内容下载时间
        contentDownload: timing.responseEnd - timing.responseStart,
        // DOM解析时间
        domParsing: timing.domInteractive - timing.responseEnd,
        // 资源加载时间
        resourceLoad: timing.loadEventStart - timing.domContentLoadedEventEnd,
        // 首次渲染时间
        firstPaint: timing.domLoading - timing.navigationStart,
        // 首次内容渲染时间
        firstContentfulPaint: timing.domInteractive - timing.navigationStart,
        // DOM完成时间
        domComplete: timing.domComplete - timing.navigationStart,
        // 页面加载总时间
        pageLoad: timing.loadEventEnd - timing.navigationStart,
      }

      console.log('=== 页面性能指标 ===')
      Object.entries(perfData).forEach(([key, value]) => {
        console.log(`${key}: ${value}ms`)
      })

      // 这里可以添加将数据发送到分析服务的代码
    }, 0)
  })
}

/**
 * 监听内存使用情况
 */
export function monitorMemoryUsage(): void {
  if (!isPerformanceEnabled) return

  // 确认浏览器支持内存API
  interface PerformanceMemory {
    jsHeapSizeLimit: number
    totalJSHeapSize: number
    usedJSHeapSize: number
  }

  interface PerformanceWithMemory extends Performance {
    memory?: PerformanceMemory
  }

  const performance = window.performance as PerformanceWithMemory
  if (performance && performance.memory) {
    setInterval(() => {
      const memory = performance.memory
      if (memory) {
        console.log('=== 内存使用情况 ===')
        console.log(`已用堆大小: ${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`)
        console.log(`堆大小限制: ${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`)
        console.log(`堆总大小: ${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`)
      }
    }, 30000) // 每30秒检查一次
  }
}

// 导出性能监控工具
export default {
  markPerformance,
  measurePerformance,
  measureComponentRender,
  reportWebVitals,
  monitorMemoryUsage,
}
