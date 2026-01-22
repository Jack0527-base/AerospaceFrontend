/**
 * Dashboard Page Component
 * 
 * 仪表盘主页面组件，提供系统概览、统计数据展示和导航功能
 * 
 * @module DashboardPage
 * @description 
 * 该组件实现了以下核心功能：
 * - 系统概览数据展示（今日检测、平均置信度、在线设备、已巡检线路）
 * - 实时系统状态监控（CPU、内存、磁盘使用率）
 * - 多语言支持（中文/英文）
 * - 主题切换（明暗模式）
 * - 用户认证状态管理
 * - 侧边栏导航菜单
 * 
 * @performance
 * 性能优化策略：
 * - 使用 React.useMemo 缓存计算结果（国际化文本、主题配置、菜单项）
 * - 使用 React.useCallback 缓存事件处理函数，减少子组件不必要的重渲染
 * - 组件懒加载和代码分割
 * - 使用共享组件库减少代码重复
 * - 系统状态数据定时轮询（30秒间隔），避免频繁请求
 * 
 * @author Aerotrace Development Team
 * @version 1.0.0
 */

"use client"

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { 
  Layout, 
  Menu, 
  Button, 
  Space, 
  Typography, 
  Breadcrumb, 
  Row, 
  Col,
  theme,
  ConfigProvider,
  Dropdown,
  Radio,
  Calendar,
  Card
} from 'antd'
import type { RadioChangeEvent, ConfigProviderProps } from 'antd'
import type { Dayjs } from 'dayjs'
import type { SystemStatusState, SystemStatusResponse } from '@/types/system'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  DashboardOutlined,
  SunOutlined,
  MoonOutlined,
  DownOutlined,
  CloudServerOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  FileSearchOutlined,
  PercentageOutlined,
  LineChartOutlined
} from '@ant-design/icons'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

// 导入共享组件
// 注意：对于频繁使用的组件，使用静态导入以优化性能
// 动态导入主要用于大型组件或条件渲染的组件
import { 
  StatisticCard, 
  WelcomeCard, 
  SystemStatusCard
} from '@/components/dashboard'
import { AvatarUpload } from '@/components/avatar-upload'
import { SidebarHeader } from '@/components/shared/SidebarHeader'
import { getI18nText, getCurrentLanguage, setLanguage, type Language } from '@/lib/i18n'
import { menuStyles } from '@/styles/menu-styles'
import { 
  siderStyles, 
  headerStyles, 
  getHeaderBackground, 
  getContentBackground,
  getBorderColor,
  getBoxShadow,
  getCardBackground
} from '@/styles/theme-styles'

const { Header, Sider, Content } = Layout
const { Title } = Typography

/**
 * Ant Design 国际化语言配置类型
 */
type Locale = ConfigProviderProps['locale']

/**
 * 主题配置数据结构
 * 
 * @interface ThemeData
 * @property {number} borderRadius - 组件圆角半径（像素）
 * @property {string} colorPrimary - 主题主色调（十六进制颜色值）
 * @property {string} colorBgLayout - 布局背景色
 * @property {string} colorBgContainer - 容器背景色
 * @property {'light' | 'dark'} algorithm - 主题算法模式（亮色/暗色）
 */
type ThemeData = {
  borderRadius: number;
  colorPrimary: string;
  colorBgLayout: string;
  colorBgContainer: string;
  algorithm: 'light' | 'dark';
}

/**
 * 默认亮色主题配置
 * 
 * @constant {ThemeData} defaultLightTheme
 * @description 定义应用默认的亮色主题样式参数
 */
const defaultLightTheme: ThemeData = {
  borderRadius: 6,
  colorPrimary: '#1890ff',
  colorBgLayout: '#f0f4f8',
  colorBgContainer: '#ffffff',
  algorithm: 'light',
}

/**
 * 默认暗色主题配置
 * 
 * @constant {ThemeData} defaultDarkTheme
 * @description 定义应用默认的暗色主题样式参数
 */
const defaultDarkTheme: ThemeData = {
  borderRadius: 6,
  colorPrimary: '#177ddc',
  colorBgLayout: '#0a0a0a',
  colorBgContainer: '#1a1a1a',
  algorithm: 'dark',
}

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, user, logout, updateUser } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<ThemeData>(defaultLightTheme)
  const [locale, setLocale] = useState<Locale>(zhCN)
  const [currentLang, setCurrentLang] = useState<Language>(getCurrentLanguage())
  
  // 添加系统状态数据状态
  const [systemStatus, setSystemStatus] = useState<SystemStatusState>({
    cpu: 0,
    memory: 0,
    disk: 0,
    loading: true
  })

  const {
    token: { borderRadiusLG },
  } = theme.useToken()

  /**
   * 获取系统状态数据
   * 
   * @function fetchSystemStatus
   * @description 
   * 异步获取服务器系统资源使用情况（CPU、内存、磁盘使用率）
   * 通过调用 /api/system/status 接口获取实时数据
   * 
   * @async
   * @returns {Promise<void>}
   * 
   * @errorHandling
   * 当API请求失败时，使用默认值（CPU: 25%, Memory: 65%, Disk: 40%）
   * 确保UI始终能够正常显示，避免因网络问题导致页面异常
   * 
   * @performance
   * 使用 useCallback 缓存函数引用，避免在每次渲染时重新创建函数
   * 减少子组件不必要的重渲染
   */
  const fetchSystemStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/system/status')
      const result: SystemStatusResponse = await response.json()
      
      if (result.success && result.data) {
        setSystemStatus({
          cpu: result.data.cpu || 0,
          memory: result.data.memory || 0,
          disk: result.data.disk || 0,
          loading: false
        })
      } else {
        // 使用默认值
        setSystemStatus({
          cpu: 25,
          memory: 65,
          disk: 40,
          loading: false
        })
      }
    } catch (error) {
      console.error('获取系统状态失败:', error)
      // 使用默认值
      setSystemStatus({
        cpu: 25,
        memory: 65,
        disk: 40,
        loading: false
      })
    }
  }, [])

  /**
   * 身份验证状态检查与用户数据初始化
   * 
   * @effect useEffect
   * @description 
   * 在组件挂载时执行以下操作：
   * 1. 验证用户认证状态，未登录则重定向到登录页
   * 2. 从 localStorage 恢复用户头像数据
   * 3. 同步用户状态到全局状态管理
   * 
   * @dependencies [isAuthenticated, router, user, updateUser]
   * @sideEffect 可能触发路由跳转或状态更新
   */
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // 从localStorage恢复头像
    if (typeof window !== 'undefined' && user) {
      const savedAvatar = localStorage.getItem('userAvatar')
      if (savedAvatar && savedAvatar !== user.avatar) {
        updateUser({ avatar: savedAvatar })
      }
    }
  }, [isAuthenticated, router, user, updateUser])

  /**
   * 主题与语言设置初始化
   * 
   * @effect useEffect
   * @description 
   * 从浏览器本地存储（localStorage）恢复用户的主题和语言偏好设置
   * 设置 Ant Design 组件的国际化配置和 dayjs 的本地化设置
   * 
   * @dependencies [] - 仅在组件挂载时执行一次
   * @sideEffect 更新主题状态、语言状态和 Ant Design locale 配置
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode')
    const lang = getCurrentLanguage()
    
    if (savedTheme === 'dark') {
      setCurrentTheme(defaultDarkTheme)
    }
    
    setCurrentLang(lang)
    if (lang === 'en') {
      setLocale(enUS)
      dayjs.locale('en')
    } else {
      setLocale(zhCN)
      dayjs.locale('zh-cn')
    }
  }, [])

  /**
   * 系统状态数据定时轮询
   * 
   * @effect useEffect
   * @description 
   * 在用户已认证的情况下，启动定时器每30秒自动获取一次系统状态数据
   * 确保系统监控数据的实时性和准确性
   * 
   * @dependencies [isAuthenticated, fetchSystemStatus]
   * @sideEffect 创建定时器，组件卸载时自动清理，避免内存泄漏
   * 
   * @performance
   * 轮询间隔设置为30秒，平衡数据实时性和服务器负载
   */
  useEffect(() => {
    if (isAuthenticated) {
      fetchSystemStatus()
      const interval = setInterval(fetchSystemStatus, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated, fetchSystemStatus])
  
  /**
   * 用户登出处理函数
   * 
   * @function handleLogout
   * @description 
   * 执行用户登出操作：清除认证状态，并重定向到登录页面
   * 
   * @returns {void}
   * 
   * @performance
   * 使用 useCallback 缓存函数引用，避免不必要的重渲染
   */
  const handleLogout = useCallback(() => {
    logout()
    router.push('/login')
  }, [logout, router])

  /**
   * 路由导航处理函数
   * 
   * @function handleNavigation
   * @description 
   * 根据传入的路径参数执行相应的路由跳转操作
   * 支持内部路由跳转和外部链接打开
   * 
   * @param {string} path - 目标路由路径或路由标识符
   * @returns {void}
   * 
   * @example
   * handleNavigation('detect') // 跳转到绝缘子检测页面
   * handleNavigation('aboutus') // 打开关于我们外部链接
   * 
   * @performance
   * 使用 useCallback 缓存函数引用，减少子组件重渲染
   */
  const handleNavigation = useCallback((path: string) => {
    switch(path) {
      case 'detect':
        router.push('/insulator-detection')
        break
      case 'nest-detection':
        router.push('/nest-detection')
        break
      case 'settings/user':
        router.push('/settings?type=user')
        break
      case 'settings/general':
        router.push('/settings?type=general')
        break
      case 'aboutus':
        window.open('https://aboutus.rth2.xyz/about.html', '_blank')
        break
      default:
        break
    }
  }, [router])

  /**
   * 侧边栏菜单项点击事件处理函数
   * 
   * @function handleMenuClick
   * @description 
   * 处理侧边栏导航菜单的点击事件，根据菜单项的 key 值执行相应的路由跳转
   * 
   * @param {Object} params - 菜单点击事件参数对象
   * @param {string} params.key - 被点击菜单项的唯一标识符
   * @returns {void}
   * 
   * @performance
   * 使用 useCallback 缓存函数引用，避免每次渲染时重新创建
   */
  const handleMenuClick = useCallback(({ key }: { key: string }) => {
    console.log('Menu clicked:', key)
    if (key === 'dashboard') {
      // 已经在仪表盘页面，不需要跳转
      return
    } else if (key === 'detect') {
      router.push('/insulator-detection')
    } else if (key === 'nest-detection') {
      router.push('/nest-detection')
    } else if (key === 'aboutus') {
      router.push('/aboutus')
    } else if (key.startsWith('settings/')) {
      const type = key.split('/')[1]
      router.push(`/settings?type=${type}`)
    }
  }, [router])

  /**
   * 语言切换处理函数
   * 
   * @function handleLanguageChange
   * @description 
   * 处理用户语言切换操作，更新应用语言设置并同步到本地存储
   * 同时更新 Ant Design 组件库和 dayjs 的本地化配置
   * 
   * @param {RadioChangeEvent} e - Ant Design Radio 组件的变更事件对象
   * @returns {void}
   * 
   * @performance
   * 使用 useCallback 缓存函数引用，优化事件处理性能
   */
  const handleLanguageChange = useCallback((e: RadioChangeEvent) => {
    const lang = e.target.value as Language
    setCurrentLang(lang)
    setLanguage(lang) // 保存到localStorage
    
    if (lang === 'en') {
      setLocale(enUS)
      dayjs.locale('en')
    } else {
      setLocale(zhCN)
      dayjs.locale('zh-cn')
    }
  }, [])

  /**
   * 主题快速切换处理函数
   * 
   * @function handleQuickThemeSwitch
   * @description 
   * 在明暗主题之间快速切换，更新主题状态并持久化到本地存储
   * 
   * @returns {void}
   * 
   * @performance
   * 使用 useCallback 缓存函数引用，依赖项仅包含 currentTheme.algorithm
   * 确保主题切换时函数引用保持稳定
   */
  const handleQuickThemeSwitch = useCallback(() => {
    const newTheme = currentTheme.algorithm === 'light' ? defaultDarkTheme : defaultLightTheme
    setCurrentTheme(newTheme)
    localStorage.setItem('themeMode', newTheme.algorithm)
  }, [currentTheme.algorithm])

  /**
   * 国际化文本对象
   * 
   * @constant {Object} t
   * @description 根据当前语言设置获取对应的国际化文本
   * 
   * @performance
   * 使用 useMemo 缓存计算结果，仅在 currentLang 变化时重新计算
   */
  const t = useMemo(() => getI18nText(currentLang), [currentLang])
  
  /**
   * 主题模式标识
   * 
   * @constant {boolean} isDark
   * @description 判断当前是否为暗色主题模式
   * 
   * @performance
   * 使用 useMemo 缓存计算结果，避免重复计算
   */
  const isDark = useMemo(() => currentTheme.algorithm === 'dark', [currentTheme.algorithm])

  /**
   * 用户下拉菜单配置项
   * 
   * @constant {Array} userMenuItems
   * @description 定义用户头像下拉菜单的菜单项配置
   * 包含用户设置和退出登录两个选项
   * 
   * @performance
   * 使用 useMemo 缓存菜单项数组，避免每次渲染时重新创建
   * 依赖项包含 t.userSettings, t.logout, handleNavigation, handleLogout
   */
  const userMenuItems = useMemo(() => [
    {
      key: 'settings',
      icon: <UserOutlined />,
      label: t.userSettings,
      onClick: () => handleNavigation('settings/user')
    },
    {
      key: 'divider',
      type: 'divider' as const
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t.logout,
      onClick: handleLogout
    }
  ], [t.userSettings, t.logout, handleNavigation, handleLogout])
  
  if (!isAuthenticated) {
    return null
  }

  /**
   * 侧边栏导航菜单配置项
   * 
   * @constant {Array} sideMenuItems
   * @description 定义侧边栏导航菜单的所有菜单项配置
   * 包括仪表盘、检测功能、设置和关于我们等菜单项
   * 
   * @performance
   * 使用 useMemo 缓存菜单项数组，仅在相关国际化文本变化时重新创建
   * 减少不必要的数组重建，提升渲染性能
   */
  const sideMenuItems = useMemo(() => [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: t.dashboard,
    },
    {
      key: 'detect',
      icon: <ThunderboltOutlined />,
      label: t.carRecognition,
    },
    {
      key: 'nest-detection',
      icon: <HomeOutlined />,
      label: t.nestDetection,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t.systemSettings,
      children: [
        {
          key: 'settings/user',
          icon: <UserOutlined />,
          label: t.userSettings,
        },
        {
          key: 'settings/general',
          icon: <GlobalOutlined />,
          label: t.generalSettings,
        }
      ]
    },
    {
      key: 'aboutus',
      icon: <QuestionCircleOutlined />,
      label: t.aboutUs,
    }
  ], [t.dashboard, t.carRecognition, t.nestDetection, t.systemSettings, t.userSettings, t.generalSettings, t.aboutUs])

  /**
   * Ant Design 主题配置对象
   * 
   * @constant {Object} themeConfig
   * @description 
   * 根据当前主题模式生成 Ant Design 组件的主题配置
   * 包括颜色、圆角、边框、阴影等视觉样式参数
   * 
   * @performance
   * 使用 useMemo 缓存主题配置对象，仅在主题相关参数变化时重新计算
   * 避免每次渲染时重新创建大型配置对象，提升性能
   */
  const themeConfig = useMemo(() => ({
    token: {
      colorPrimary: currentTheme.colorPrimary,
      borderRadius: currentTheme.borderRadius,
      colorBgLayout: currentTheme.colorBgLayout,
      colorBgContainer: currentTheme.colorBgContainer,
      colorBgElevated: isDark ? '#262626' : '#ffffff',
      colorBorder: isDark ? '#303030' : '#e1e8ed',
      colorBorderSecondary: isDark ? '#252525' : '#f0f0f0',
      colorText: isDark ? '#ffffff' : '#000000d9',
      colorTextSecondary: isDark ? '#bfbfbf' : '#00000073',
      colorTextTertiary: isDark ? '#8c8c8c' : '#00000045',
      colorFillAlter: isDark ? '#1f1f1f' : '#fafafa',
      colorFillContent: isDark ? '#262626' : '#f5f5f5',
      colorBgTextHover: isDark ? '#2a2a2a' : '#f5f5f5',
    },
    components: {
      Menu: {
        itemBg: 'transparent',
        subMenuItemBg: 'transparent',
        itemActiveBg: 'transparent',
        itemSelectedBg: 'rgba(255, 255, 255, 0.12)',
        itemHoverBg: 'rgba(255, 255, 255, 0.08)',
        subMenuBg: 'transparent',
      },
    },
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  }), [
    currentTheme.colorPrimary,
    currentTheme.borderRadius,
    currentTheme.colorBgLayout,
    currentTheme.colorBgContainer,
    isDark,
  ])
  
  return (
    <>
      {/* 使用共享的菜单样式 */}
      <style jsx>{menuStyles}</style>
      <ConfigProvider locale={locale} theme={themeConfig}>
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
            {/* 使用共享的侧边栏头部组件 */}
            <SidebarHeader
              collapsed={collapsed}
              title="循翼 Aerotrace"
            />
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['dashboard']}
              items={sideMenuItems}
              onClick={handleMenuClick}
              style={{ 
                borderRight: 0,
                background: 'transparent'
              }}
              className="custom-menu"
            />
          </Sider>

          <Layout style={{ marginLeft: collapsed ? 0 : siderStyles.width }}>
            {/* 顶部导航栏 */}
            <Header style={{ 
              display: 'flex', 
              alignItems: 'center',
              padding: headerStyles.padding,
              height: headerStyles.height,
              background: getHeaderBackground(isDark),
              justifyContent: 'space-between',
              boxShadow: getBoxShadow(isDark, 'header'),
              borderBottom: getBorderColor(isDark),
              backdropFilter: 'blur(12px)'
            }}>
              {/* 左侧：折叠按钮 */}
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                size="large"
                style={{
                  fontSize: '16px',
                  width: 40,
                  height: 40,
                  color: isDark ? '#ffffff' : '#1890ff'
                }}
              />

              {/* 右侧：语言切换 + 快速主题切换 + 用户信息 */}
              <Space size="middle">
                {/* 语言切换 */}
                <Radio.Group 
                  value={currentLang} 
                  onChange={handleLanguageChange}
                  size="small"
                  buttonStyle="solid"
                >
                  <Radio.Button value="zh">中文</Radio.Button>
                  <Radio.Button value="en">EN</Radio.Button>
                </Radio.Group>

                {/* 快速主题切换圆形按钮 */}
                <Button
                  type="primary"
                  shape="circle"
                  size="large"
                  icon={isDark ? <SunOutlined /> : <MoonOutlined />}
                  onClick={handleQuickThemeSwitch}
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: isDark ? '#faad14' : currentTheme.colorPrimary,
                    borderColor: isDark ? '#faad14' : currentTheme.colorPrimary,
                    boxShadow: isDark
                      ? '0 4px 12px rgba(250, 173, 20, 0.4)' 
                      : `0 4px 12px ${currentTheme.colorPrimary}40`
                  }}
                />

                {/* 用户下拉菜单 */}
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  arrow
                >
                  <Button type="text" size="large" style={{ padding: '4px 8px', height: 'auto', display: 'flex', alignItems: 'center' }}>
                    <Space align="center">
                      <AvatarUpload 
                        size={32}
                        showUpload={false}
                        style={{ backgroundColor: currentTheme.colorPrimary }}
                      />
                      <span style={{ 
                        color: isDark ? '#ffffff' : '#000000d9',
                        fontSize: '14px',
                        fontWeight: 500
                      }}>
                        {user?.username || (currentLang === 'zh' ? '用户' : 'User')}
                      </span>
                      <DownOutlined style={{ 
                        fontSize: '12px',
                        color: isDark ? '#ffffff' : '#000000d9'
                      }} />
                    </Space>
                  </Button>
                </Dropdown>
              </Space>
            </Header>

            {/* 内容区域 */}
            <Content style={{ 
              padding: '24px', 
              height: `calc(100vh - ${headerStyles.height}px)`, 
              overflow: 'hidden', 
              display: 'flex', 
              flexDirection: 'column' 
            }}>
              {/* 面包屑导航 */}
              <Breadcrumb
                style={{ marginBottom: 16 }}
                items={[
                  { title: <HomeOutlined /> },
                  { title: (<><DashboardOutlined /><span>Dashboard</span></>) },
                  { title: t.overview },
                ]}
              />
              
              {/* 主要内容区域 */}
              <div
                style={{
                  background: getContentBackground(isDark),
                  flex: 1,
                  padding: 24,
                  borderRadius: borderRadiusLG,
                  backdropFilter: 'blur(16px)',
                  border: getBorderColor(isDark),
                  boxShadow: getBoxShadow(isDark, 'content'),
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* 欢迎卡片 - 使用新组件 */}
                <div style={{ marginBottom: 16, flexShrink: 0 }}>
                  <WelcomeCard
                    username={user?.username}
                    email={user?.email}
                    welcomeText={t.welcomeBack}
                    adminText={t.admin}
                    onlineText={t.online}
                    isDark={isDark}
                    colorPrimary={currentTheme.colorPrimary}
                  />
                </div>
                
                {/* 统计卡片行 - 使用新组件 */}
                <Row gutter={16} style={{ marginBottom: 16, flexShrink: 0 }}>
                  <Col span={6}>
                    <StatisticCard
                      title={t.todayRecognition}
                      value={30}
                      prefix={<FileSearchOutlined />}
                      valueStyle={{ color: '#3f8600' }}
                      isDark={isDark}
                    />
                  </Col>
                  <Col span={6}>
                    <StatisticCard
                      title={t.averageConfidence}
                      value={95.5}
                      precision={1}
                      suffix="%"
                      prefix={<PercentageOutlined />}
                      valueStyle={{ color: '#cf1322' }}
                      isDark={isDark}
                    />
                  </Col>
                  <Col span={6}>
                    <StatisticCard
                      title={t.onlineDevices}
                      value={1}
                      prefix={<CloudServerOutlined />}
                      valueStyle={{ color: currentTheme.colorPrimary }}
                      isDark={isDark}
                    />
                  </Col>
                  <Col span={6}>
                    <StatisticCard
                      title={t.inspectedLines}
                      value={12}
                      prefix={<LineChartOutlined />}
                      valueStyle={{ color: '#722ed1' }}
                      isDark={isDark}
                    />
                  </Col>
                </Row>
              
                {/* 功能卡片行 - 使用新组件 */}
                <Row gutter={16} style={{ flex: 1, minHeight: 0 }}>
                  <Col span={12}>
                    <SystemStatusCard
                      title={t.systemStatus}
                      cpuUsageText={t.cpuUsage}
                      memoryUsageText={t.memoryUsage}
                      diskUsageText={t.diskUsage}
                      cpuPercent={systemStatus.cpu}
                      memoryPercent={systemStatus.memory}
                      diskPercent={systemStatus.disk}
                      isDark={isDark}
                    />
                  </Col>
                  
                  <Col span={12}>
                    <Card
                      title={currentLang === 'zh' ? '日历' : 'Calendar'}
                      style={{
                        height: '100%',
                        background: getCardBackground(isDark),
                        border: getBorderColor(isDark),
                        backdropFilter: 'blur(12px)',
                        borderRadius: borderRadiusLG,
                        boxShadow: getBoxShadow(isDark, 'card')
                      }}
                      bodyStyle={{ 
                        padding: '16px',
                        height: 'calc(100% - 57px)',
                        overflow: 'hidden'
                      }}
                    >
                      <Calendar
                        fullscreen={false}
                        value={dayjs()}
                        onSelect={useCallback((date: Dayjs) => {
                          // 日期选择回调函数
                          // 当前仅用于日志记录，可根据业务需求扩展功能
                          console.log('Selected date:', date.format('YYYY-MM-DD'))
                        }, [])}
                        style={{
                          height: '100%'
                        }}
                      />
                    </Card>
                  </Col>
                </Row>
              </div>
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </>
  )
} 