"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { 
  Layout, 
  Menu, 
  Avatar, 
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
  RocketOutlined,
  ApiOutlined,
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

// 导入新的组件
import { 
  StatisticCard, 
  WelcomeCard, 
  SystemStatusCard
} from '@/components/dashboard'
import { AvatarUpload } from '@/components/avatar-upload'
import { getI18nText, getCurrentLanguage, setLanguage, type Language } from '@/lib/i18n'

const { Header, Sider, Content } = Layout
const { Title } = Typography

type Locale = ConfigProviderProps['locale']

type ThemeData = {
  borderRadius: number;
  colorPrimary: string;
  colorBgLayout: string;
  colorBgContainer: string;
  algorithm: 'light' | 'dark';
}

const defaultLightTheme: ThemeData = {
  borderRadius: 6,
  colorPrimary: '#1890ff',
  colorBgLayout: '#f0f4f8',
  colorBgContainer: '#ffffff',
  algorithm: 'light',
}

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
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  // 获取系统状态数据
  const fetchSystemStatus = async () => {
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
  }

  // 主要的useEffect用于身份验证检查和初始化
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

  useEffect(() => {
    // 从localStorage恢复主题和语言设置
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

  // 获取系统状态数据
  useEffect(() => {
    if (isAuthenticated) {
      fetchSystemStatus()
      
      // 每30秒更新一次系统状态
      const interval = setInterval(fetchSystemStatus, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])
  
  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleNavigation = (path: string) => {
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
  }

  // 处理菜单项点击
  const handleMenuClick = ({ key }: { key: string }) => {
    console.log('Menu clicked:', key)
    if (key === 'dashboard') {
      // 已经在仪表盘页面，不需要跳转
      return
    } else if (key === 'detect') {
      router.push('/insulator-detection')
    } else if (key === 'nest-detection') {
      router.push('/nest-detection')
    } else if (key === 'aboutus') {
      window.open('https://aboutus.rth2.xyz/about.html', '_blank')
    } else if (key.startsWith('settings/')) {
      const type = key.split('/')[1]
      router.push(`/settings?type=${type}`)
    }
  }

  const handleLanguageChange = (e: RadioChangeEvent) => {
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
  }

  const handleQuickThemeSwitch = () => {
    const newTheme = currentTheme.algorithm === 'light' ? defaultDarkTheme : defaultLightTheme
    setCurrentTheme(newTheme)
    localStorage.setItem('themeMode', newTheme.algorithm)
  }

  const t = getI18nText(currentLang)
  const isDark = currentTheme.algorithm === 'dark'

  // 用户下拉菜单
  const userMenuItems = [
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
  ]
  
  if (!isAuthenticated) {
    return null
  }

  // 侧边栏菜单项
  const sideMenuItems = [
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
  ]
  
  return (
    <>
      <style jsx>{`
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
        :global(.custom-menu.ant-menu-dark .ant-menu-submenu-open > .ant-menu-submenu-title) {
          background-color: transparent !important;
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
      `}</style>
      <ConfigProvider
        locale={locale}
        theme={{
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
          algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        <Layout style={{ height: '100vh', overflow: 'hidden' }}>
          {/* 侧边栏 - 208px (200+8×1) */}
          <Sider 
            trigger={null} 
            collapsible 
            collapsed={collapsed}
            breakpoint="lg"
            collapsedWidth={collapsed ? 0 : 80}
            width={208}
            style={{
              background: 'linear-gradient(180deg, #1890ff 0%, #096dd9 30%, #0050b3 70%, #003a8c 100%)',
              height: '100vh',
              overflow: 'auto',
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0,
              zIndex: 999
            }}
          >
            <div style={{ 
              height: 64, 
              margin: '16px', 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              paddingBottom: 16
            }}>
              {!collapsed && (
                <Title level={4} style={{ margin: 0, color: '#fff', fontSize: '16px' }}>
                  循翼 Aerotrace
                </Title>
              )}
            </div>
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

          <Layout style={{ marginLeft: collapsed ? 0 : 208 }}>
            {/* 顶部导航栏 - 64px (48+8×2) */}
            <Header style={{ 
              display: 'flex', 
              alignItems: 'center',
              padding: '0 24px',
              height: 64,
              background: isDark
                ? 'linear-gradient(90deg, rgba(26,26,26,0.95) 0%, rgba(42,42,42,0.9) 50%, rgba(26,26,26,0.95) 100%)'
                : 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 50%, rgba(255,255,255,0.95) 100%)',
              justifyContent: 'space-between',
              boxShadow: isDark
                ? '0 2px 8px rgba(0,0,0,0.4)' 
                : '0 2px 8px rgba(24, 144, 255, 0.08)',
              borderBottom: isDark
                ? '1px solid rgba(255,255,255,0.1)' 
                : '1px solid rgba(24, 144, 255, 0.08)',
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
            <Content style={{ padding: '24px', height: 'calc(100vh - 64px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* 面包屑导航 */}
              <Breadcrumb
                style={{ marginBottom: 16 }}
                items={[
                  { title: <HomeOutlined /> },
                  { title: (<><DashboardOutlined /><span>Dashboard</span></>) },
                  { title: t.overview },
                ]}
              />
              
              {/* 主要内容区域 - 完美贴合剩余空间 */}
              <div
                style={{
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(42,42,42,0.8) 25%, rgba(58,58,58,0.6) 50%, rgba(42,42,42,0.8) 75%, rgba(26,26,26,0.95) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.7) 25%, rgba(240,248,255,0.5) 50%, rgba(248,250,252,0.7) 75%, rgba(255,255,255,0.9) 100%)',
                  flex: 1,
                  padding: 24,
                  borderRadius: borderRadiusLG,
                  backdropFilter: 'blur(16px)',
                  border: isDark
                    ? '1px solid rgba(255,255,255,0.1)' 
                    : '1px solid rgba(24, 144, 255, 0.12)',
                  boxShadow: isDark
                    ? '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)' 
                    : '0 8px 32px rgba(24, 144, 255, 0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
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
                        background: isDark
                          ? 'linear-gradient(135deg, rgba(38,38,38,0.9) 0%, rgba(58,58,58,0.7) 50%, rgba(38,38,38,0.9) 100%)'
                          : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.8) 50%, rgba(255,255,255,0.95) 100%)',
                        border: isDark
                          ? '1px solid rgba(255,255,255,0.12)' 
                          : '1px solid rgba(24, 144, 255, 0.12)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: borderRadiusLG,
                        boxShadow: isDark
                          ? '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)' 
                          : '0 4px 16px rgba(24, 144, 255, 0.1), inset 0 1px 0 rgba(255,255,255,0.9)'
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
                        onSelect={(date: Dayjs) => {
                          console.log('Selected date:', date.format('YYYY-MM-DD'))
                        }}
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