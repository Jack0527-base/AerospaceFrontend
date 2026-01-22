/**
 * 关于我们页面组件
 * 
 * 功能：
 * - 展示公司信息和团队介绍
 * - 提供联系方式和版本信息
 * - 支持主题切换和语言切换
 * 
 * 设计特点：
 * - 简洁统一的风格，与其他页面保持一致
 * - 预留内容空间，便于后续扩展
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
  Card,
  Row,
  Col,
  Divider,
  theme,
  ConfigProvider
} from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  DashboardOutlined,
  SunOutlined,
  MoonOutlined,
  ThunderboltOutlined,
  UserOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  MailOutlined,
  CopyrightOutlined
} from '@ant-design/icons'
import { getI18nText, getCurrentLanguage, type Language } from '@/lib/i18n'
import { menuStyles } from '@/styles/menu-styles'
import { 
  siderStyles, 
  headerStyles, 
  getHeaderBackground,
  getContentBackground,
  getCardBackground,
  getBorderColor,
  getBoxShadow
} from '@/styles/theme-styles'

const { Header, Sider, Content } = Layout
const { Title, Text, Paragraph } = Typography

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

export default function AboutUsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<ThemeData>(defaultLightTheme)
  const [currentLang, setCurrentLang] = useState<Language>(getCurrentLanguage())

  const {
    token: { borderRadiusLG },
  } = theme.useToken()

  // 检查登录状态
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
  }, [isAuthenticated, router])

  // 加载主题和语言偏好
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('themeMode')
      const lang = getCurrentLanguage()
      
      setCurrentLang(lang)
      
      if (savedTheme === 'dark') {
        setCurrentTheme(defaultDarkTheme)
      } else {
        setCurrentTheme(defaultLightTheme)
      }
    }
  }, [])

  const isDark = currentTheme.algorithm === 'dark'
  const t = getI18nText(currentLang)

  // 处理导航
  const handleNavigation = useCallback((path: string) => {
    if (path.startsWith('settings/')) {
      const type = path.split('/')[1]
      router.push(`/settings?type=${type}`)
    } else if (path === 'detect') {
      router.push('/insulator-detection')
    } else {
      router.push(`/${path}`)
    }
  }, [router])

  // 处理菜单项点击
  const handleMenuClick = useCallback(({ key }: { key: string }) => {
    if (key === 'dashboard') {
      router.push('/dashboard')
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

  const handleQuickThemeSwitch = useCallback(() => {
    const newTheme = currentTheme.algorithm === 'light' ? defaultDarkTheme : defaultLightTheme
    setCurrentTheme(newTheme)
    localStorage.setItem('themeMode', newTheme.algorithm)
  }, [currentTheme.algorithm])

  // 侧边栏菜单项
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
  ], [t])

  // 使用useMemo缓存主题配置
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
        itemSelectedBg: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.12)',
        itemHoverBg: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.08)',
      },
    },
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  }), [currentTheme, isDark])

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <style jsx>{menuStyles}</style>
      <ConfigProvider theme={themeConfig}>
        <Layout style={{ height: '100vh', overflow: 'hidden' }}>
          {/* 侧边栏 */}
          <Sider 
            trigger={null} 
            collapsible 
            collapsed={collapsed}
            breakpoint="lg"
            collapsedWidth={collapsed ? 0 : 80}
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
            <div style={{ 
              height: 64, 
              margin: '16px', 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              paddingBottom: 16
            }}>
              <QuestionCircleOutlined style={{ fontSize: '24px', color: '#fff' }} />
              {!collapsed && (
                <Title level={4} style={{ margin: '0 0 0 12px', color: '#fff', fontSize: '16px' }}>
                  {t.aboutUsTitle}
                </Title>
              )}
            </div>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['aboutus']}
              selectedKeys={['aboutus']}
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
              borderBottom: `1px solid ${getBorderColor(isDark)}`,
              backdropFilter: 'blur(12px)'
            }}>
              {/* 左侧：折叠按钮 + 面包屑 */}
              <Space>
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
                
                <Breadcrumb
                  items={[
                    {
                      href: '/dashboard',
                      title: <HomeOutlined />
                    },
                    {
                      title: t.aboutUsTitle
                    }
                  ]}
                />
              </Space>

              {/* 右侧：快速主题切换 */}
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
            </Header>

            {/* 主要内容区域 */}
            <Content style={{ 
              margin: '24px',
              padding: '24px',
              background: getContentBackground(isDark),
              borderRadius: borderRadiusLG,
              backdropFilter: 'blur(16px)',
              border: `1px solid ${getBorderColor(isDark)}`,
              boxShadow: getBoxShadow(isDark, 'content'),
              overflow: 'auto',
              height: 'calc(100vh - 112px)'
            }}>
              {/* 页面标题 */}
              <div style={{ marginBottom: '32px' }}>
                <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                  <QuestionCircleOutlined style={{ marginRight: '12px', color: currentTheme.colorPrimary }} />
                  {t.aboutUsTitle}
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  {t.aboutUsSubtitle}
                </Text>
              </div>

              {/* 内容卡片区域 */}
              <Row gutter={[24, 24]}>
                {/* 公司信息卡片 */}
                <Col xs={24} lg={12}>
                  <Card 
                    style={{ 
                      minHeight: '300px',
                      background: getCardBackground(isDark),
                      border: `1px solid ${getBorderColor(isDark)}`,
                      backdropFilter: 'blur(12px)',
                      borderRadius: borderRadiusLG,
                      boxShadow: getBoxShadow(isDark, 'card')
                    }}
                    title={
                      <Space>
                        <InfoCircleOutlined style={{ color: currentTheme.colorPrimary }} />
                        <span>{t.companyName}</span>
                      </Space>
                    }
                  >
                    <Paragraph style={{ 
                      color: isDark ? '#bfbfbf' : '#00000073',
                      lineHeight: '1.8',
                      marginBottom: 0,
                      minHeight: '200px'
                    }}>
                      {/* 预留内容空间 - 可在此处添加公司简介 */}
                    </Paragraph>
                  </Card>
                </Col>

                {/* 团队介绍卡片 */}
                <Col xs={24} lg={12}>
                  <Card 
                    style={{ 
                      minHeight: '300px',
                      background: getCardBackground(isDark),
                      border: `1px solid ${getBorderColor(isDark)}`,
                      backdropFilter: 'blur(12px)',
                      borderRadius: borderRadiusLG,
                      boxShadow: getBoxShadow(isDark, 'card')
                    }}
                    title={
                      <Space>
                        <TeamOutlined style={{ color: currentTheme.colorPrimary }} />
                        <span>{t.teamIntroduction}</span>
                      </Space>
                    }
                  >
                    <Paragraph style={{ 
                      color: isDark ? '#bfbfbf' : '#00000073',
                      lineHeight: '1.8',
                      marginBottom: 0,
                      minHeight: '200px'
                    }}>
                      {/* 预留内容空间 - 可在此处添加团队介绍 */}
                    </Paragraph>
                  </Card>
                </Col>

                {/* 联系我们卡片 */}
                <Col xs={24} lg={12}>
                  <Card 
                    style={{ 
                      minHeight: '300px',
                      background: getCardBackground(isDark),
                      border: `1px solid ${getBorderColor(isDark)}`,
                      backdropFilter: 'blur(12px)',
                      borderRadius: borderRadiusLG,
                      boxShadow: getBoxShadow(isDark, 'card')
                    }}
                    title={
                      <Space>
                        <MailOutlined style={{ color: currentTheme.colorPrimary }} />
                        <span>{t.contactUs}</span>
                      </Space>
                    }
                  >
                    <Paragraph style={{ 
                      color: isDark ? '#bfbfbf' : '#00000073',
                      lineHeight: '1.8',
                      marginBottom: 0,
                      minHeight: '200px'
                    }}>
                      {/* 预留内容空间 - 可在此处添加联系方式 */}
                    </Paragraph>
                  </Card>
                </Col>

                {/* 版本信息卡片 */}
                <Col xs={24} lg={12}>
                  <Card 
                    style={{ 
                      minHeight: '300px',
                      background: getCardBackground(isDark),
                      border: `1px solid ${getBorderColor(isDark)}`,
                      backdropFilter: 'blur(12px)',
                      borderRadius: borderRadiusLG,
                      boxShadow: getBoxShadow(isDark, 'card')
                    }}
                    title={
                      <Space>
                        <CopyrightOutlined style={{ color: currentTheme.colorPrimary }} />
                        <span>{t.version}</span>
                      </Space>
                    }
                  >
                    <Paragraph style={{ 
                      color: isDark ? '#bfbfbf' : '#00000073',
                      lineHeight: '1.8',
                      marginBottom: 0
                    }}>
                      <Text strong style={{ fontSize: '16px' }}>
                        {t.version}: 1.0.0
                      </Text>
                      <Divider style={{ margin: '16px 0' }} />
                      <Text type="secondary">
                        {t.copyright} © {new Date().getFullYear()}
                      </Text>
                    </Paragraph>
                  </Card>
                </Col>
              </Row>
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </>
  )
}
