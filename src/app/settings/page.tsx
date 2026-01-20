"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { 
  Layout, 
  Menu, 
  Button, 
  Space, 
  Typography, 
  Breadcrumb, 
  Card,
  Form,
  Input,
  Select,
  Radio,
  theme,
  ConfigProvider,
  message,
  Divider,
  Row,
  Col,
  Spin
} from 'antd'
import type { ConfigProviderProps } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
  SunOutlined,
  MoonOutlined,
  UserOutlined,
  SaveOutlined,
  GlobalOutlined,
  LoadingOutlined
} from '@ant-design/icons'
import { AvatarUpload } from '@/components/avatar-upload'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography
const { Option } = Select

type Locale = ConfigProviderProps['locale']

// 国际化文本
const i18nTexts = {
  zh: {
    // 菜单项
    dashboard: '仪表盘',
    carRecognition: '绝缘子检测',
    systemSettings: '系统设置',
    userSettings: '用户设置',
    generalSettings: '通用设置',
    aboutUs: '关于我们',
    
    // 页面标题和描述
    userSettingsDesc: '管理您的个人信息和头像',
    generalSettingsDesc: '配置系统外观和语言偏好',
    
    // 表单标签
    personalInfo: '个人信息',
    avatarTip: '点击头像可以更换',
    username: '用户名',
    displayName: '显示名称',
    email: '邮箱',
    passwordSettings: '密码设置',
    currentPassword: '当前密码',
    newPassword: '新密码',
    confirmPassword: '确认新密码',
    saveSettings: '保存设置',
    
    // 占位符
    currentPasswordPlaceholder: '如需修改密码请输入当前密码',
    newPasswordPlaceholder: '请输入新密码（至少6位）',
    confirmPasswordPlaceholder: '请再次输入新密码',
    
    // 外观设置
    appearanceSettings: '外观设置',
    themeMode: '主题模式',
    lightMode: '浅色模式',
    darkMode: '深色模式',
    languageSettings: '语言设置',
    
    // 验证消息
    usernameRequired: '请输入用户名',
    displayNameRequired: '请输入显示名称',
    emailRequired: '请输入邮箱',
    emailInvalid: '请输入有效的邮箱地址',
    currentPasswordRequired: '修改密码时请输入当前密码',
    newPasswordRequired: '请输入新密码',
    passwordTooShort: '密码长度不能少于6位',
    confirmPasswordRequired: '请确认新密码',
    passwordMismatch: '两次输入的密码不一致',
    
    // 成功消息
    userInfoUpdated: '用户信息更新成功!',
    userInfoAndPasswordUpdated: '用户信息和密码更新成功!',
    generalSettingsSaved: '通用设置已保存!',
    languageChanged: '语言已切换！'
  },
  en: {
    // 菜单项
    dashboard: 'Dashboard',
    carRecognition: 'License Plate Recognition',
    systemSettings: 'System Settings',
    userSettings: 'User Settings',
    generalSettings: 'General Settings',
    aboutUs: 'About Us',
    
    // 页面标题和描述
    userSettingsDesc: 'Manage your personal information and avatar',
    generalSettingsDesc: 'Configure system appearance and language preferences',
    
    // 表单标签
    personalInfo: 'Personal Information',
    avatarTip: 'Click avatar to change',
    username: 'Username',
    displayName: 'Display Name',
    email: 'Email',
    passwordSettings: 'Password Settings',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    saveSettings: 'Save Settings',
    
    // 占位符
    currentPasswordPlaceholder: 'Enter current password to change password',
    newPasswordPlaceholder: 'Enter new password (at least 6 characters)',
    confirmPasswordPlaceholder: 'Re-enter new password',
    
    // 外观设置
    appearanceSettings: 'Appearance Settings',
    themeMode: 'Theme Mode',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    languageSettings: 'Language Settings',
    
    // 验证消息
    usernameRequired: 'Please enter username',
    displayNameRequired: 'Please enter display name',
    emailRequired: 'Please enter email',
    emailInvalid: 'Please enter a valid email address',
    currentPasswordRequired: 'Please enter current password when changing password',
    newPasswordRequired: 'Please enter new password',
    passwordTooShort: 'Password must be at least 6 characters',
    confirmPasswordRequired: 'Please confirm new password',
    passwordMismatch: 'The two passwords do not match',
    
    // 成功消息
    userInfoUpdated: 'User information updated successfully!',
    userInfoAndPasswordUpdated: 'User information and password updated successfully!',
    generalSettingsSaved: 'General settings saved!',
    languageChanged: 'Language switched!'
  }
}

// 主题配置 - 与dashboard保持一致
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

// Loading 组件
function SettingsLoading() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <Spin 
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        tip="加载设置页面..."
      />
    </div>
  )
}

// 原有的设置页面内容组件
function SettingsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, user, updateUser } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<ThemeData>(defaultLightTheme)
  const [currentLang, setCurrentLang] = useState<'zh' | 'en'>('zh')
  const [locale, setLocale] = useState<Locale>(zhCN)
  const [userForm] = Form.useForm()
  const [systemForm] = Form.useForm()

  // 从URL参数获取当前设置类型，默认为用户设置
  const settingsType = searchParams.get('type') || 'user'

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  // 获取当前语言的文本
  const t = i18nTexts[currentLang]

  // 检查登录状态
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // 加载语言偏好
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language') as 'zh' | 'en'
      if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
        setCurrentLang(savedLang)
        setLocale(savedLang === 'zh' ? zhCN : enUS)
      }
    }
  }, [])

  // 加载主题偏好
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('themeMode')
      if (savedTheme === 'dark') {
        setCurrentTheme(defaultDarkTheme)
      } else {
        setCurrentTheme(defaultLightTheme)
      }
    }
  }, [])

  // 初始化表单数据
  useEffect(() => {
    if (user) {
      userForm.setFieldsValue({
        username: user.username,
        name: user.name,
        email: user.email
      })
    }
  }, [user, userForm])

  const isDark = currentTheme.algorithm === 'dark'

  const handleLanguageChange = (value: 'zh' | 'en') => {
    setCurrentLang(value)
    setLocale(value === 'zh' ? zhCN : enUS)
    localStorage.setItem('language', value)
    message.success(i18nTexts[value].languageChanged)
  }

  const handleNavigation = (path: string) => {
    if (path.startsWith('settings/')) {
      const type = path.split('/')[1]
      router.push(`/settings?type=${type}`)
    } else {
      router.push(`/${path}`)
    }
  }

  const handleQuickThemeSwitch = () => {
    const newTheme = currentTheme.algorithm === 'light' ? defaultDarkTheme : defaultLightTheme
    setCurrentTheme(newTheme)
    localStorage.setItem('themeMode', newTheme.algorithm)
  }

  // 主侧边栏菜单项 - 包含设置子菜单
  const sideMenuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: t.dashboard,
      onClick: () => handleNavigation('dashboard')
    },
    {
      key: 'detect',
      icon: <ThunderboltOutlined />,
      label: t.carRecognition,
      onClick: () => handleNavigation('detect')
    },
    {
      key: 'nest-detection',
      icon: <HomeOutlined />,
      label: '鸟巢检测',
      onClick: () => handleNavigation('nest-detection')
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
          onClick: () => handleNavigation('settings/user')
        },
        {
          key: 'settings/general',
          icon: <GlobalOutlined />,
          label: t.generalSettings,
          onClick: () => handleNavigation('settings/general')
        }
      ]
    },
    {
      key: 'aboutus',
      icon: <QuestionCircleOutlined />,
      label: t.aboutUs,
      onClick: () => handleNavigation('aboutus')
    }
  ]

  const handleUserFormSubmit = (values: any) => {
    // 更新基本用户信息
    updateUser({
      username: values.username,
      name: values.name,
      email: values.email
    })

    // 如果填写了密码相关字段，处理密码修改
    if (values.currentPassword && values.newPassword && values.confirmPassword) {
      // 这里应该调用API来修改密码
      console.log('密码修改请求:', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      })
      
      // 密码修改成功后清空密码字段
      userForm.setFieldsValue({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      message.success(t.userInfoAndPasswordUpdated)
    } else {
      message.success(t.userInfoUpdated)
    }
  }

  const handleSystemFormSubmit = (values: any) => {
    console.log('系统设置:', values)
    message.success(t.generalSettingsSaved)
  }

  // 渲染用户设置内容
  const renderUserSettings = () => (
    <Card 
      title={t.personalInfo}
      style={{ 
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
    >
      <div style={{ marginBottom: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <AvatarUpload size={80} showUpload={true} />
        <div style={{ marginTop: '12px' }}>
          <Text type="secondary">{t.avatarTip}</Text>
        </div>
          </div>

      <Divider />
      
      <Form
        form={userForm}
        layout="vertical"
        onFinish={handleUserFormSubmit}
        style={{ maxWidth: '500px', margin: '0 auto' }}
      >
        <Form.Item
          label={t.username}
          name="username"
          rules={[{ required: true, message: t.usernameRequired }]}
        >
          <Input prefix={<UserOutlined />} />
        </Form.Item>

        <Form.Item
          label={t.displayName}
          name="name"
          rules={[{ required: true, message: t.displayNameRequired }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t.email}
          name="email"
          rules={[
            { required: true, message: t.emailRequired },
            { type: 'email', message: t.emailInvalid }
          ]}
        >
          <Input />
        </Form.Item>

        <Divider>{t.passwordSettings}</Divider>

        <Form.Item
          label={t.currentPassword}
          name="currentPassword"
          rules={[
            {
              validator: (_, value) => {
                if (userForm.getFieldValue('newPassword') && !value) {
                  return Promise.reject(new Error(t.currentPasswordRequired))
                }
                return Promise.resolve()
              }
            }
          ]}
        >
          <Input.Password placeholder={t.currentPasswordPlaceholder} />
        </Form.Item>

        <Form.Item
          label={t.newPassword}
          name="newPassword"
          rules={[
            {
              validator: (_, value) => {
                if (userForm.getFieldValue('currentPassword') && !value) {
                  return Promise.reject(new Error(t.newPasswordRequired))
                }
                if (value && value.length < 6) {
                  return Promise.reject(new Error(t.passwordTooShort))
                }
                return Promise.resolve()
              }
            }
          ]}
        >
          <Input.Password placeholder={t.newPasswordPlaceholder} />
        </Form.Item>

        <Form.Item
          label={t.confirmPassword}
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            {
              validator: (_, value) => {
                const newPassword = userForm.getFieldValue('newPassword')
                if (newPassword && !value) {
                  return Promise.reject(new Error(t.confirmPasswordRequired))
                }
                if (newPassword && value && newPassword !== value) {
                  return Promise.reject(new Error(t.passwordMismatch))
                }
                return Promise.resolve()
              }
            }
          ]}
        >
          <Input.Password placeholder={t.confirmPasswordPlaceholder} />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SaveOutlined />}
            style={{ width: '100%' }}
          >
            {t.saveSettings}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )

  // 渲染通用设置内容
  const renderGeneralSettings = () => (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card 
          title={t.appearanceSettings}
          style={{ 
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
        >
          <Form layout="vertical">
            <Form.Item label={t.themeMode}>
              <Radio.Group value={isDark ? 'dark' : 'light'} onChange={(e) => {
                const newTheme = e.target.value === 'dark' ? defaultDarkTheme : defaultLightTheme
                setCurrentTheme(newTheme)
                localStorage.setItem('themeMode', newTheme.algorithm)
              }}>
                <Radio value="light">{t.lightMode}</Radio>
                <Radio value="dark">{t.darkMode}</Radio>
              </Radio.Group>
            </Form.Item>
            
            <Form.Item label={t.languageSettings}>
              <Select 
                value={currentLang} 
                onChange={handleLanguageChange}
                style={{ width: '200px' }}
              >
                <Option value="zh">中文 (简体)</Option>
                <Option value="en">English</Option>
              </Select>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  )

  // 获取当前选中的菜单键
  const getSelectedKeys = () => {
    if (settingsType === 'general') {
      return ['settings/general']
    }
    return ['settings/user']
  }

  // 获取展开的菜单键
  const getOpenKeys = () => {
    return ['settings']
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <style jsx>{`
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
        :global(.custom-settings-menu.ant-menu-dark .ant-menu-submenu-open > .ant-menu-submenu-title) {
          background-color: transparent !important;
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
          {/* 主侧边栏 - 208px (200+8×1) */}
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
              <ThunderboltOutlined style={{ fontSize: '24px', color: '#fff' }} />
              {!collapsed && (
                <Title level={4} style={{ margin: '0 0 0 12px', color: '#fff', fontSize: '16px' }}>
                  绝缘子检测
                </Title>
              )}
            </div>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={getSelectedKeys()}
              openKeys={getOpenKeys()}
              items={sideMenuItems}
              style={{ 
                borderRight: 0,
                background: 'transparent'
              }}
              className="custom-settings-menu"
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
                      title: t.systemSettings
                    },
                    {
                      title: settingsType === 'general' ? t.generalSettings : t.userSettings
                    }
                  ]}
                />
              </Space>

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

            {/* 设置内容区域 */}
            <Content style={{ 
              margin: '24px',
              padding: '24px',
              background: isDark
                ? 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(42,42,42,0.8) 25%, rgba(58,58,58,0.6) 50%, rgba(42,42,42,0.8) 75%, rgba(26,26,26,0.95) 100%)'
                : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.7) 25%, rgba(240,248,255,0.5) 50%, rgba(248,250,252,0.7) 75%, rgba(255,255,255,0.9) 100%)',
              borderRadius: borderRadiusLG,
              backdropFilter: 'blur(16px)',
              border: isDark
                ? '1px solid rgba(255,255,255,0.1)' 
                : '1px solid rgba(24, 144, 255, 0.12)',
              boxShadow: isDark
                ? '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)' 
                : '0 8px 32px rgba(24, 144, 255, 0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
              overflow: 'auto',
              height: 'calc(100vh - 112px)'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                  {settingsType === 'general' ? (
                    <>
                      <GlobalOutlined style={{ marginRight: '12px', color: currentTheme.colorPrimary }} />
                      {t.generalSettings}
                    </>
                  ) : (
                    <>
                      <UserOutlined style={{ marginRight: '12px', color: currentTheme.colorPrimary }} />
                      {t.userSettings}
                    </>
                  )}
                </Title>
                <Text type="secondary">
                  {settingsType === 'general' ? t.generalSettingsDesc : t.userSettingsDesc}
                </Text>
          </div>

              {settingsType === 'user' && renderUserSettings()}
              {settingsType === 'general' && renderGeneralSettings()}
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </>
  )
}

// 主导出组件 - 使用 Suspense 包装
export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsLoading />}>
      <SettingsPageContent />
    </Suspense>
  )
} 