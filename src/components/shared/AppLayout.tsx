/**
 * 共享的应用布局组件
 * 提供统一的布局结构，包括侧边栏、头部和内容区域
 */

import React, { useMemo } from 'react'
import { Layout, ConfigProvider, theme } from 'antd'
import type { ReactNode } from 'react'
import type { ConfigProviderProps } from 'antd'
import { menuStyles } from '@/styles/menu-styles'
import { 
  siderStyles, 
  headerStyles, 
  getHeaderBackground, 
  getContentBackground,
  getBorderColor,
  getBoxShadow
} from '@/styles/theme-styles'

const { Header, Sider, Content } = Layout

export interface AppLayoutProps {
  /** 是否折叠侧边栏 */
  collapsed: boolean
  /** 切换折叠状态 */
  onCollapse: (collapsed: boolean) => void
  /** 侧边栏内容 */
  sidebar: ReactNode
  /** 头部内容 */
  header: ReactNode
  /** 主内容区域 */
  children: ReactNode
  /** 主题配置 */
  themeConfig: {
    isDark: boolean
    colorPrimary: string
    borderRadius: number
    colorBgLayout: string
    colorBgContainer: string
    locale: ConfigProviderProps['locale']
  }
}

/**
 * 应用布局组件
 * 提供统一的页面布局结构
 */
export const AppLayout: React.FC<AppLayoutProps> = React.memo(({
  collapsed,
  onCollapse,
  sidebar,
  header,
  children,
  themeConfig
}) => {
  // 使用useMemo缓存主题配置，避免每次渲染重新计算
  const themeToken = useMemo(() => ({
    token: {
      colorPrimary: themeConfig.colorPrimary,
      borderRadius: themeConfig.borderRadius,
      colorBgLayout: themeConfig.colorBgLayout,
      colorBgContainer: themeConfig.colorBgContainer,
      colorBgElevated: themeConfig.isDark ? '#262626' : '#ffffff',
      colorBorder: themeConfig.isDark ? '#303030' : '#e1e8ed',
      colorBorderSecondary: themeConfig.isDark ? '#252525' : '#f0f0f0',
      colorText: themeConfig.isDark ? '#ffffff' : '#000000d9',
      colorTextSecondary: themeConfig.isDark ? '#bfbfbf' : '#00000073',
      colorTextTertiary: themeConfig.isDark ? '#8c8c8c' : '#00000045',
      colorFillAlter: themeConfig.isDark ? '#1f1f1f' : '#fafafa',
      colorFillContent: themeConfig.isDark ? '#262626' : '#f5f5f5',
      colorBgTextHover: themeConfig.isDark ? '#2a2a2a' : '#f5f5f5',
    },
    algorithm: themeConfig.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  }), [
    themeConfig.colorPrimary,
    themeConfig.borderRadius,
    themeConfig.colorBgLayout,
    themeConfig.colorBgContainer,
    themeConfig.isDark,
  ])

  return (
    <>
      <style jsx>{menuStyles}</style>
      <ConfigProvider locale={themeConfig.locale} theme={themeToken}>
        <Layout style={{ height: '100vh', overflow: 'hidden' }}>
          {/* 侧边栏 */}
          <Sider 
            trigger={null} 
            collapsible 
            collapsed={collapsed}
            breakpoint="lg"
            collapsedWidth={collapsed ? 0 : siderStyles.collapsedWidth}
            width={siderStyles.width}
            style={{
              background: siderStyles.background,
              height: '100vh',
              overflow: 'auto',
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0,
              zIndex: 999
            }}
          >
            {sidebar}
          </Sider>

          <Layout style={{ marginLeft: collapsed ? 0 : siderStyles.width }}>
            {/* 顶部导航栏 */}
            <Header style={{ 
              display: 'flex', 
              alignItems: 'center',
              padding: headerStyles.padding,
              height: headerStyles.height,
              background: getHeaderBackground(themeConfig.isDark),
              justifyContent: 'space-between',
              boxShadow: getBoxShadow(themeConfig.isDark, 'header'),
              borderBottom: getBorderColor(themeConfig.isDark),
              backdropFilter: 'blur(12px)'
            }}>
              {header}
            </Header>

            {/* 内容区域 */}
            <Content style={{ 
              margin: '24px',
              padding: contentStyles.padding,
              background: getContentBackground(themeConfig.isDark),
              borderRadius: contentStyles.borderRadius,
              backdropFilter: 'blur(16px)',
              border: getBorderColor(themeConfig.isDark),
              boxShadow: getBoxShadow(themeConfig.isDark, 'content'),
              overflow: 'auto',
              height: `calc(100vh - ${headerStyles.height + 48}px)`
            }}>
              {children}
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </>
  )
})

AppLayout.displayName = 'AppLayout'
