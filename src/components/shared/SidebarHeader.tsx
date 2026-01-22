/**
 * Sidebar Header Component
 * 
 * 侧边栏头部组件，用于统一管理侧边栏标题和图标显示
 * 
 * @module SidebarHeader
 * @description 
 * 该组件提供了侧边栏头部的标准化展示，包括：
 * - 可选的图标展示
 * - 标题文本展示
 * - 响应式布局（折叠/展开状态）
 * - 统一的样式风格
 * 
 * @performance
 * 使用 React.memo 进行组件记忆化，仅在 props 变化时重新渲染
 * 
 * @author Aerotrace Development Team
 * @version 1.0.0
 */

import React from 'react'
import { Typography } from 'antd'
import type { ReactNode } from 'react'

const { Title } = Typography

/**
 * 侧边栏头部组件的属性接口
 * 
 * @interface SidebarHeaderProps
 * @property {boolean} collapsed - 侧边栏是否处于折叠状态
 * @property {ReactNode} [icon] - 可选的图标元素
 * @property {string} title - 侧边栏标题文本
 */
export interface SidebarHeaderProps {
  /** 是否折叠 */
  collapsed: boolean
  /** 图标（可选） */
  icon?: ReactNode
  /** 标题文本 */
  title: string
}

/**
 * 侧边栏头部组件
 * 
 * @component SidebarHeader
 * @description 
 * 根据折叠状态动态调整布局：
 * - 折叠时：仅显示图标（如果有），文字居中
 * - 展开时：显示图标和标题，左对齐
 * 
 * @param {SidebarHeaderProps} props - 组件属性对象
 * @returns {JSX.Element} 渲染的侧边栏头部元素
 */
export const SidebarHeader: React.FC<SidebarHeaderProps> = React.memo(({ collapsed, icon, title }) => {
  // 如果没有图标，文字居中显示
  const hasIcon = !!icon
  const justifyContent = collapsed ? 'center' : (hasIcon ? 'flex-start' : 'center')
  
  return (
    <div style={{ 
      height: 64, 
      margin: '16px', 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: justifyContent,
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      paddingBottom: 16
    }}>
      {icon && (
        <div style={{ fontSize: '24px', color: '#fff' }}>
          {icon}
        </div>
      )}
      {!collapsed && (
        <Title level={4} style={{ 
          margin: hasIcon ? '0 0 0 12px' : '0', 
          color: '#fff', 
          fontSize: '16px',
          textAlign: hasIcon ? 'left' : 'center'
        }}>
          {title}
        </Title>
      )}
    </div>
  )
})

SidebarHeader.displayName = 'SidebarHeader'
