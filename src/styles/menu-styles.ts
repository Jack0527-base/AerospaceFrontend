/**
 * Menu Styles Module
 * 
 * 菜单样式配置模块，统一管理侧边栏菜单的样式定义
 * 
 * @module menu-styles
 * @description 
 * 该模块提供了以下功能：
 * - 侧边栏导航菜单的样式定义
 * - 设置页面专用菜单的样式定义
 * - 统一的菜单样式管理，避免代码重复
 * - 支持暗色主题的菜单样式定制
 * 
 * @author Aerotrace Development Team
 * @version 1.0.0
 */

/**
 * 侧边栏导航菜单样式定义
 * 
 * @constant {string} menuStyles
 * @description 
 * 定义了侧边栏导航菜单的所有样式规则，包括：
 * - 菜单项和子菜单标题的默认背景（透明）
 * - 菜单项的悬停效果（半透明白色背景）
 * - 选中菜单项的样式（高亮背景）
 * - 子菜单的展开和选中状态样式
 * 
 * @readonly
 * @example
 * // 在组件中使用
 * <style jsx>{menuStyles}</style>
 */
export const menuStyles = `
  :global(.custom-menu.ant-menu-dark .ant-menu-item),
  :global(.custom-menu.ant-menu-dark .ant-menu-submenu-title) {
    background-color: transparent !important;
  }
  :global(.custom-menu.ant-menu-dark .ant-menu-item:hover),
  :global(.custom-menu.ant-menu-dark .ant-menu-submenu-title:hover) {
    background-color: rgba(255, 255, 255, 0.08) !important;
  }
  :global(.custom-menu.ant-menu-dark .ant-menu-item-selected) {
    background-color: rgba(255, 255, 255, 0.12) !important;
  }
  :global(.custom-menu.ant-menu-dark .ant-menu-submenu-selected > .ant-menu-submenu-title),
  :global(.custom-menu.ant-menu-dark .ant-menu-submenu-open > .ant-menu-submenu-title),
  :global(.custom-menu.ant-menu-dark .ant-menu-submenu-active > .ant-menu-submenu-title),
  :global(.custom-menu.ant-menu-dark .ant-menu-submenu-title:active),
  :global(.custom-menu.ant-menu-dark .ant-menu-submenu-title:focus),
  :global(.custom-menu.ant-menu-dark .ant-menu-submenu-title:focus-visible),
  :global(.custom-menu.ant-menu-dark .ant-menu-submenu-inline > .ant-menu-submenu-title),
  :global(.custom-menu.ant-menu-dark .ant-menu-submenu-inline.ant-menu-submenu-active > .ant-menu-submenu-title),
  :global(.custom-menu.ant-menu-dark .ant-menu-submenu-inline.ant-menu-submenu-open > .ant-menu-submenu-title),
  :global(.custom-menu.ant-menu-dark .ant-menu-submenu-inline.ant-menu-submenu-selected > .ant-menu-submenu-title),
  :global(.custom-menu.ant-menu-dark .ant-menu-submenu .ant-menu-submenu-title),
  :global(.custom-menu.ant-menu-dark .ant-menu-submenu.ant-menu-submenu-active .ant-menu-submenu-title),
  :global(.custom-menu.ant-menu-dark .ant-menu-submenu.ant-menu-submenu-open .ant-menu-submenu-title),
  :global(.custom-menu.ant-menu-dark .ant-menu-submenu.ant-menu-submenu-selected .ant-menu-submenu-title) {
    background-color: transparent !important;
  }
  :global(.custom-menu.ant-menu-dark .ant-menu-submenu-title:hover) {
    background-color: rgba(255, 255, 255, 0.08) !important;
  }
  :global(.custom-menu.ant-menu-dark .ant-menu-sub) {
    background-color: transparent !important;
  }
  :global(.custom-menu.ant-menu-dark .ant-menu-sub .ant-menu-item) {
    background-color: transparent !important;
  }
  :global(.custom-menu.ant-menu-dark .ant-menu-sub .ant-menu-item:hover) {
    background-color: rgba(255, 255, 255, 0.08) !important;
  }
  :global(.custom-menu.ant-menu-dark .ant-menu-sub .ant-menu-item-selected),
  :global(.custom-menu.ant-menu-dark .ant-menu-sub .ant-menu-item-active) {
    background-color: rgba(255, 255, 255, 0.12) !important;
  }
  :global(.custom-menu.ant-menu-dark .ant-menu-submenu-open .ant-menu-sub) {
    background-color: transparent !important;
  }
  :global(.custom-menu.ant-menu-dark .ant-menu-submenu-open .ant-menu-sub .ant-menu-item) {
    background-color: transparent !important;
  }
  :global(.custom-menu.ant-menu-dark .ant-menu-submenu-open .ant-menu-sub .ant-menu-item:hover) {
    background-color: rgba(255, 255, 255, 0.08) !important;
  }
  :global(.custom-menu.ant-menu-dark .ant-menu-submenu-open .ant-menu-sub .ant-menu-item-selected),
  :global(.custom-menu.ant-menu-dark .ant-menu-submenu-open .ant-menu-sub .ant-menu-item-active) {
    background-color: rgba(255, 255, 255, 0.12) !important;
  }
`

/**
 * 设置页面专用菜单样式定义
 * 
 * @constant {string} settingsMenuStyles
 * @description 
 * 定义了设置页面专用菜单的样式规则，样式结构与侧边栏菜单类似
 * 但使用不同的 CSS 类名（custom-settings-menu）以区分应用场景
 * 
 * @readonly
 * @example
 * // 在设置页面组件中使用
 * <style jsx>{settingsMenuStyles}</style>
 */
export const settingsMenuStyles = `
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-item),
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-submenu-title) {
    background-color: transparent !important;
  }
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-item:hover),
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-submenu-title:hover) {
    background-color: rgba(255, 255, 255, 0.08) !important;
  }
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-item-selected) {
    background-color: rgba(255, 255, 255, 0.12) !important;
  }
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-submenu-selected > .ant-menu-submenu-title),
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-submenu-open > .ant-menu-submenu-title),
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-submenu-active > .ant-menu-submenu-title),
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-submenu-title:active),
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-submenu-title:focus),
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-submenu-title:focus-visible),
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-submenu-inline > .ant-menu-submenu-title),
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-submenu-inline.ant-menu-submenu-active > .ant-menu-submenu-title),
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-submenu-inline.ant-menu-submenu-open > .ant-menu-submenu-title),
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-submenu-inline.ant-menu-submenu-selected > .ant-menu-submenu-title),
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-submenu .ant-menu-submenu-title),
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-submenu.ant-menu-submenu-active .ant-menu-submenu-title),
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-submenu.ant-menu-submenu-open .ant-menu-submenu-title),
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-submenu.ant-menu-submenu-selected .ant-menu-submenu-title) {
    background-color: transparent !important;
  }
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-submenu-title:hover) {
    background-color: rgba(255, 255, 255, 0.08) !important;
  }
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-sub) {
    background-color: transparent !important;
  }
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-sub .ant-menu-item) {
    background-color: transparent !important;
  }
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-sub .ant-menu-item:hover) {
    background-color: rgba(255, 255, 255, 0.08) !important;
  }
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-sub .ant-menu-item-selected),
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-sub .ant-menu-item-active) {
    background-color: rgba(255, 255, 255, 0.12) !important;
  }
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-submenu-open .ant-menu-sub) {
    background-color: transparent !important;
  }
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-submenu-open .ant-menu-sub .ant-menu-item) {
    background-color: transparent !important;
  }
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-submenu-open .ant-menu-sub .ant-menu-item:hover) {
    background-color: rgba(255, 255, 255, 0.08) !important;
  }
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-submenu-open .ant-menu-sub .ant-menu-item-selected),
  :global(.custom-settings-menu.ant-menu-dark .ant-menu-submenu-open .ant-menu-sub .ant-menu-item-active) {
    background-color: rgba(255, 255, 255, 0.12) !important;
  }
`
