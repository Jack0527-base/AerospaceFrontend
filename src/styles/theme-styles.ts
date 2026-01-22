/**
 * Theme Styles Module
 * 
 * 主题样式配置模块，统一管理应用的主题相关样式常量
 * 
 * @module theme-styles
 * @description 
 * 该模块提供了以下功能：
 * - 侧边栏、头部、内容区域的样式常量定义
 * - 根据主题模式动态生成背景、边框、阴影等样式
 * - 统一的样式管理，避免代码重复
 * 
 * @author Aerotrace Development Team
 * @version 1.0.0
 */

/**
 * 侧边栏样式配置常量
 * 
 * @constant {Object} siderStyles
 * @property {string} background - 侧边栏背景渐变样式
 * @property {number} width - 侧边栏展开时的宽度（像素）
 * @property {number} collapsedWidth - 侧边栏折叠时的宽度（像素）
 * 
 * @readonly
 */
export const siderStyles = {
  background: 'linear-gradient(180deg, #1890ff 0%, #096dd9 30%, #0050b3 70%, #003a8c 100%)',
  width: 208,
  collapsedWidth: 80,
} as const

/**
 * 头部导航栏样式配置常量
 * 
 * @constant {Object} headerStyles
 * @property {number} height - 头部导航栏高度（像素）
 * @property {string} padding - 头部导航栏内边距
 * 
 * @readonly
 */
export const headerStyles = {
  height: 64,
  padding: '0 24px',
} as const

/**
 * 内容区域样式配置常量
 * 
 * @constant {Object} contentStyles
 * @property {string} padding - 内容区域内边距
 * @property {string} borderRadius - 内容区域圆角半径
 * 
 * @readonly
 */
export const contentStyles = {
  padding: '24px',
  borderRadius: '8px',
} as const

/**
 * 获取头部导航栏背景渐变样式
 * 
 * @function getHeaderBackground
 * @description 
 * 根据当前主题模式（明暗）返回对应的头部导航栏背景渐变样式
 * 
 * @param {boolean} isDark - 是否为暗色主题模式
 * @returns {string} CSS 渐变背景样式字符串
 * 
 * @example
 * const bg = getHeaderBackground(true) // 返回暗色主题背景
 */
export function getHeaderBackground(isDark: boolean): string {
  return isDark
    ? 'linear-gradient(90deg, rgba(26,26,26,0.95) 0%, rgba(42,42,42,0.9) 50%, rgba(26,26,26,0.95) 100%)'
    : 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 50%, rgba(255,255,255,0.95) 100%)'
}

/**
 * 获取内容区域背景渐变样式
 * 
 * @function getContentBackground
 * @description 
 * 根据当前主题模式（明暗）返回对应的内容区域背景渐变样式
 * 
 * @param {boolean} isDark - 是否为暗色主题模式
 * @returns {string} CSS 渐变背景样式字符串
 * 
 * @example
 * const bg = getContentBackground(false) // 返回亮色主题背景
 */
export function getContentBackground(isDark: boolean): string {
  return isDark
    ? 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(42,42,42,0.8) 25%, rgba(58,58,58,0.6) 50%, rgba(42,42,42,0.8) 75%, rgba(26,26,26,0.95) 100%)'
    : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.7) 25%, rgba(240,248,255,0.5) 50%, rgba(248,250,252,0.7) 75%, rgba(255,255,255,0.9) 100%)'
}

/**
 * 获取卡片背景渐变样式
 * 
 * @function getCardBackground
 * @description 
 * 根据当前主题模式（明暗）返回对应的卡片背景渐变样式
 * 
 * @param {boolean} isDark - 是否为暗色主题模式
 * @returns {string} CSS 渐变背景样式字符串
 * 
 * @example
 * const bg = getCardBackground(true) // 返回暗色主题卡片背景
 */
export function getCardBackground(isDark: boolean): string {
  return isDark
    ? 'linear-gradient(135deg, rgba(38,38,38,0.9) 0%, rgba(58,58,58,0.7) 50%, rgba(38,38,38,0.9) 100%)'
    : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.8) 50%, rgba(255,255,255,0.95) 100%)'
}

/**
 * 获取边框颜色样式
 * 
 * @function getBorderColor
 * @description 
 * 根据当前主题模式（明暗）返回对应的边框颜色样式
 * 
 * @param {boolean} isDark - 是否为暗色主题模式
 * @returns {string} CSS 颜色值字符串（RGBA格式）
 * 
 * @example
 * const borderColor = getBorderColor(false) // 返回亮色主题边框颜色
 */
export function getBorderColor(isDark: boolean): string {
  return isDark ? 'rgba(255,255,255,0.12)' : 'rgba(24, 144, 255, 0.12)'
}

/**
 * 获取阴影样式
 * 
 * @function getBoxShadow
 * @description 
 * 根据当前主题模式和元素类型返回对应的阴影样式
 * 支持不同类型的元素（头部、内容区域、卡片）使用不同的阴影效果
 * 
 * @param {boolean} isDark - 是否为暗色主题模式
 * @param {'header' | 'content' | 'card'} [type='content'] - 元素类型，默认为 'content'
 * @returns {string} CSS 阴影样式字符串
 * 
 * @example
 * const shadow = getBoxShadow(true, 'card') // 返回暗色主题卡片阴影
 * const shadow2 = getBoxShadow(false) // 返回亮色主题内容区域阴影
 */
export function getBoxShadow(isDark: boolean, type: 'header' | 'content' | 'card' = 'content'): string {
  if (isDark) {
    switch (type) {
      case 'header':
        return '0 2px 8px rgba(0,0,0,0.4)'
      case 'card':
        return '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
      default:
        return '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)'
    }
  } else {
    switch (type) {
      case 'header':
        return '0 2px 8px rgba(24, 144, 255, 0.08)'
      case 'card':
        return '0 4px 16px rgba(24, 144, 255, 0.1), inset 0 1px 0 rgba(255,255,255,0.9)'
      default:
        return '0 8px 32px rgba(24, 144, 255, 0.12), inset 0 1px 0 rgba(255,255,255,0.9)'
    }
  }
}
