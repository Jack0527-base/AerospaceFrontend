"use client"

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { backendApi } from '@/lib/api-client'
import type { DetectResponse, PlateInfo } from '@/types/api'
// 注意：PlateInfo类型暂时保留，后续可改为CrackInfo
import { 
  Layout, 
  Menu, 
  Button, 
  Space, 
  Typography, 
  Breadcrumb, 
  Upload,
  Card,
  Tabs,
  Alert,
  List,
  Tag,
  Divider,
  theme,
  ConfigProvider,
  message,
  Row,
  Col
} from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
  UploadOutlined,
  InboxOutlined,
  SunOutlined,
  MoonOutlined,
  FileImageOutlined,
  ApiOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloudUploadOutlined,
  UserOutlined,
  GlobalOutlined
} from '@ant-design/icons'
import { getI18nText, getCurrentLanguage, type Language } from '@/lib/i18n'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography
const { Dragger } = Upload
const { TabPane } = Tabs

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

export default function NestDetectionPage() {
  const router = useRouter()
  const { isAuthenticated, user, updateUser } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<ThemeData>(defaultLightTheme)
  const [currentLang, setCurrentLang] = useState<Language>(getCurrentLanguage())
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectionResults, setDetectionResults] = useState<PlateInfo[]>([]) // 暂时使用PlateInfo类型，后续可改为CrackInfo
  const [error, setError] = useState('')
  const [requestData, setRequestData] = useState<any>(null)
  const [responseData, setResponseData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('1')
  const [imageSize, setImageSize] = useState<{ width: number; height: number; naturalWidth: number; naturalHeight: number } | null>(null)
  const resultImageRef = useRef<HTMLImageElement>(null)
  const visualizationImageRef = useRef<HTMLImageElement>(null)
  const previewImageRef = useRef<HTMLImageElement>(null)
  const [previewImageSize, setPreviewImageSize] = useState<{ width: number; height: number; naturalWidth: number; naturalHeight: number } | null>(null)

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  // 检查登录状态
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

  // 加载主题和语言偏好
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 从localStorage恢复主题设置 - 与dashboard保持一致
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

  // 组件卸载时清理内存
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const isDark = currentTheme.algorithm === 'dark'
  const t = getI18nText(currentLang)

  const handleNavigation = (path: string) => {
    if (path.startsWith('settings/')) {
      const type = path.split('/')[1]
      router.push(`/settings?type=${type}`)
    } else if (path === 'detect') {
      router.push('/insulator-detection')
    } else {
      router.push(`/${path}`)
    }
  }

  // 处理菜单项点击
  const handleMenuClick = ({ key }: { key: string }) => {
    console.log('Menu clicked:', key)
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
  }

  const handleQuickThemeSwitch = () => {
    const newTheme = currentTheme.algorithm === 'light' ? defaultDarkTheme : defaultLightTheme
    setCurrentTheme(newTheme)
    // 与dashboard保持一致的localStorage键名
    localStorage.setItem('themeMode', newTheme.algorithm)
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

  // 简化并优化文件上传处理
  const handleFileSelect = (file: File) => {
    console.log('文件选择:', file.name, file.size, file.type)
    
    setSelectedFile(file)
    setError('')
    setDetectionResults([])
    setRequestData(null)
    setResponseData(null)
    setActiveTab('1')
    
    // 生成预览URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    
    // 根据文件大小给出不同提示
    if (file.size > 3 * 1024 * 1024) {
      message.warning(`文件较大 (${(file.size / 1024 / 1024).toFixed(1)}MB)，识别时将自动优化处理以确保最佳识别效果`)
    } else {
      message.success(`图片 "${file.name}" 上传成功，可以开始识别了`)
    }
    
    console.log('文件已设置到state:', file)
  }

  // 处理文件拖拽上传
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      
      // 验证文件类型
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        message.error('只能上传图片文件!')
        return
      }
      
      // 设置最大文件大小为50MB（压缩后会小于2MB）
      const isLt50M = file.size / 1024 / 1024 < 50
      if (!isLt50M) {
        message.error('图片大小不能超过 50MB!')
        return
      }
      
      handleFileSelect(file)
    }
  }

  // 处理文件拖拽悬停
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  // 处理点击上传
  const handleClickUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*,.jpg,.jpeg,.png'
    input.style.display = 'none'
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      const files = target.files
      if (files && files.length > 0) {
        const file = files[0]
        
        // 验证文件类型
        const isImage = file.type.startsWith('image/')
        if (!isImage) {
          message.error('只能上传图片文件!')
          return
        }
        
        // 设置最大文件大小为50MB（压缩后会小于2MB）
        const isLt50M = file.size / 1024 / 1024 < 50
        if (!isLt50M) {
          message.error('图片大小不能超过 50MB!')
          return
        }
        
        handleFileSelect(file)
      }
      
      // 清理input元素
      document.body.removeChild(input)
    }
    
    document.body.appendChild(input)
    input.click()
  }

  // 鸟巢检测
  const handleDetection = async () => {
    console.log('开始检测，当前选中文件:', selectedFile)
    
    if (!selectedFile) {
      message.error('请先选择图片文件')
      return
    }

    // 验证文件是否有效
    if (!(selectedFile instanceof File)) {
      message.error('文件格式无效，请重新选择')
      setSelectedFile(null)
      setPreviewUrl('')
      return
    }

    setIsDetecting(true)
    setError('')
    setDetectionResults([])
    setActiveTab('1')

    try {
      console.log('开始鸟巢检测，文件信息:', {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type
      })
      
      // 将文件转换为Base64（Roboflow API需要）
      const base64 = await backendApi.utils.fileToBase64(selectedFile)
      // 移除data:image/xxx;base64,前缀，只保留base64数据
      const base64Data = base64.split(',')[1] || base64
      
      // 记录请求数据
      setRequestData({
        method: 'POST',
        url: 'https://serverless.roboflow.com/birdnest-aqzoi-gelsg/1',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
          api_key: 'cW6r5HCK2OL5sVo7ymUO'
        },
        body: {
          file: selectedFile.name,
          size: `${(selectedFile.size / 1024).toFixed(2)} KB`,
          type: selectedFile.type,
          base64Length: base64Data.length,
          timestamp: new Date().toISOString()
        }
      })
      
      // 使用Roboflow API进行鸟巢检测
      const response: DetectResponse = await backendApi.nestDetection.byImage(selectedFile)
      
      console.log('检测响应:', response)
      
      // 记录响应数据
      setResponseData(response)

      if (response.isSuccess && response.infos) {
        setDetectionResults(response.infos)
        console.log(`检测成功！识别到 ${response.infos.length} 个鸟巢`)
      } else {
        const errorMessage = response.messages?.[0]?.description || '鸟巢检测失败'
        setError(errorMessage)
        message.error(errorMessage)
        console.error('检测失败:', errorMessage)
      }
    } catch (error: any) {
      console.error('检测过程中出错:', error)
      
      let errorMsg = '检测过程中出现错误'
      
      // 针对不同类型的错误提供不同的处理
      if (error.message?.includes('认证失败') || error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        errorMsg = '认证失败，请稍后重试'
        message.error(errorMsg)
      } else if (error.message?.includes('识别失败')) {
        errorMsg = '图片中未能识别出鸟巢，请确保：\n1. 图片中包含清晰可见的鸟巢\n2. 鸟巢没有被遮挡\n3. 图片光线充足、对比度良好'
        message.error(errorMsg)
      } else if (error.message?.includes('文件太大') || error.message?.includes('400')) {
        errorMsg = '图片处理失败，请尝试使用更小或质量更好的图片文件'
        message.error(errorMsg)
      } else if (error.message?.includes('压缩失败') || error.message?.includes('图片加载失败')) {
        errorMsg = '图片处理失败，请检查图片格式是否正确（支持JPG、PNG格式）'
        message.error(errorMsg)
      } else if (error.message?.includes('Network') || error.message?.includes('网络')) {
        errorMsg = '网络连接失败，请检查网络连接后重试'
        message.error(errorMsg)
      } else if (error.message?.includes('timeout') || error.message?.includes('超时')) {
        errorMsg = '请求超时，请重试'
        message.error(errorMsg)
      } else {
        errorMsg = error.message || '检测过程中出现未知错误'
        message.error(errorMsg)
      }
      
      setError(errorMsg)
      setResponseData({
        isSuccess: false,
        error: errorMsg,
        timestamp: new Date().toISOString(),
        messages: [{
          code: 'DETECTION_ERROR',
          description: errorMsg
        }]
      })
    } finally {
      setIsDetecting(false)
    }
  }

  // 清空结果
  const handleClear = () => {
    // 清理内存中的URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    
    setSelectedFile(null)
    setPreviewUrl('')
    setDetectionResults([])
    setError('')
    setRequestData(null)
    setResponseData(null)
    setActiveTab('1')
    setPreviewImageSize(null)
    
    console.log('已清空所有数据')
    message.info('已清空所有数据')
  }

  if (!isAuthenticated) {
    return null
  }

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
              <HomeOutlined style={{ fontSize: '24px', color: '#fff' }} />
              {!collapsed && (
                <Title level={4} style={{ margin: '0 0 0 12px', color: '#fff', fontSize: '16px' }}>
                  {t.nestDetectionTitle}
                </Title>
              )}
            </div>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['nest-detection']}
              selectedKeys={['nest-detection']}
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
                      title: t.nestDetectionTitle
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
                  <HomeOutlined style={{ marginRight: '12px', color: currentTheme.colorPrimary }} />
                  {t.nestDetectionTitle}
                </Title>
                <Text type="secondary">{t.nestDetectionSubtitle}</Text>
              </div>

              {/* 左右对称布局 */}
              <Row gutter={24} style={{ height: 'calc(100% - 80px)' }}>
                {/* 左侧：上传区域 */}
                <Col xs={24} lg={12} style={{ height: '100%' }}>
                  <Card 
                    style={{ 
                      height: '100%', 
                      display: 'flex',
                      flexDirection: 'column',
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
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      padding: '24px'
                    }}
                  >
                    {!previewUrl ? (
                      <div 
                        style={{ 
                          width: '100%',
                          height: '100%',
                          minHeight: '400px',
                          background: isDark ? '#1a1a1a' : '#fafafa',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={handleClickUpload}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragOver}
                      >
                        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                          <CloudUploadOutlined style={{ 
                            fontSize: '64px', 
                            color: currentTheme.colorPrimary,
                            marginBottom: '16px',
                            display: 'block'
                          }} />
                          <p style={{ 
                            fontSize: '18px', 
                            margin: '16px 0',
                            fontWeight: 500,
                            color: isDark ? '#ffffff' : '#000000d9'
                          }}>
                            {t.clickOrDrag}
                          </p>
                          <p style={{
                            color: isDark ? '#8c8c8c' : '#666',
                            fontSize: '14px',
                            margin: 0
                          }}>
                            {t.supportedFormats}
                            <br />
                            <span style={{ fontSize: '12px', color: isDark ? '#666' : '#999' }}>
                              {t.largeFileNotice}
                            </span>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div style={{ 
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%'
                      }}>
                        {/* 文件信息显示 */}
                        {selectedFile && (
                          <div style={{
                            width: '100%',
                            padding: '12px',
                            background: isDark ? '#262626' : '#f0f8ff',
                            border: isDark ? '1px solid #303030' : '1px solid #d6e4ff',
                            borderRadius: '6px',
                            marginBottom: '16px',
                            fontSize: '13px'
                          }}>
                            <div style={{ marginBottom: '4px' }}>
                              <Text strong>{t.fileName}：</Text>
                              <Text>{selectedFile.name}</Text>
                            </div>
                            <div style={{ marginBottom: '4px' }}>
                              <Text strong>{t.fileSize}：</Text>
                              <Text>{(selectedFile.size / 1024).toFixed(2)} KB</Text>
                            </div>
                            <div>
                              <Text strong>{t.fileType}：</Text>
                              <Text>{selectedFile.type}</Text>
                            </div>
                          </div>
                        )}
                        
                        <div style={{
                          position: 'relative',
                          display: 'inline-block',
                          width: '100%',
                          marginBottom: '20px'
                        }}>
                          <img
                            ref={previewImageRef}
                            src={previewUrl}
                            alt="预览"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '500px',
                              borderRadius: '8px',
                              objectFit: 'contain',
                              display: 'block'
                            }}
                            onLoad={(e) => {
                              // 图片加载完成后，获取实际尺寸用于缩放计算
                              const img = e.currentTarget
                              const displayWidth = img.clientWidth
                              const displayHeight = img.clientHeight
                              const naturalWidth = img.naturalWidth
                              const naturalHeight = img.naturalHeight
                              
                              setPreviewImageSize({
                                width: displayWidth,
                                height: displayHeight,
                                naturalWidth: naturalWidth,
                                naturalHeight: naturalHeight
                              })
                            }}
                          />
                          {/* 在预览图片上绘制检测框 */}
                          {previewImageSize && detectionResults.length > 0 && detectionResults.map((result, index) => {
                            if (!result.rect || result.rect.x === null || result.rect.y === null || 
                                result.rect.width === null || result.rect.height === null) {
                              return null
                            }
                            
                            // 计算缩放比例：显示尺寸 / 原始尺寸
                            let scaleX = 1
                            let scaleY = 1
                            
                            if (previewImageSize.naturalWidth > 0 && previewImageSize.naturalHeight > 0) {
                              scaleX = previewImageSize.width / previewImageSize.naturalWidth
                              scaleY = previewImageSize.height / previewImageSize.naturalHeight
                            } else if (previewImageRef.current) {
                              const img = previewImageRef.current
                              if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                                scaleX = img.clientWidth / img.naturalWidth
                                scaleY = img.clientHeight / img.naturalHeight
                              }
                            }
                            
                            // 应用缩放比例
                            const x = result.rect.x * scaleX
                            const y = result.rect.y * scaleY
                            const width = result.rect.width * scaleX
                            const height = result.rect.height * scaleY
                            
                            // 根据class和color字段判断类型
                            const className = (result.class || '').toLowerCase()
                            const isNest = className === 'nest' || className === 'birdnest' || className.includes('nest')
                            // 如果不是鸟巢，则默认为其他物体
                            const isOther = !isNest || result.color === 'red'
                            
                            // 其他物体用红色，鸟巢用蓝色
                            const boxColor = isNest ? '#1890ff' : '#ff4d4f'
                            const confidence = result.confidence || 0
                            
                            return (
                              <div
                                key={index}
                                style={{
                                  position: 'absolute',
                                  left: `${x}px`,
                                  top: `${y}px`,
                                  width: `${width}px`,
                                  height: `${height}px`,
                                  border: `1px solid ${boxColor}`,
                                  borderRadius: '2px',
                                  pointerEvents: 'none',
                                  backgroundColor: 'transparent'
                                }}
                              >
                                {/* 置信度标签 - 只显示百分比 */}
                                {confidence > 0 && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: '-20px',
                                      left: '0',
                                      background: boxColor,
                                      color: '#fff',
                                      padding: '2px 6px',
                                      borderRadius: '2px',
                                      fontSize: '11px',
                                      fontWeight: '500',
                                      whiteSpace: 'nowrap',
                                      lineHeight: '1.2',
                                      minWidth: '35px',
                                      textAlign: 'center'
                                    }}
                                  >
                                    {confidence}%
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                        <Space size="large">
                          <Button
                            type="primary"
                            size="large"
                            loading={isDetecting}
                            onClick={handleDetection}
                            icon={<ApiOutlined />}
                            disabled={!selectedFile}
                            style={{
                              minWidth: '120px',
                              height: '40px'
                            }}
                          >
                            {isDetecting ? '识别中...' : '开始识别'}
                          </Button>
                          
                          <Button
                            size="large"
                            onClick={handleClear}
                            style={{
                              minWidth: '80px',
                              height: '40px'
                            }}
                          >
                            清空
                          </Button>
                        </Space>
                        
                        {/* 状态提示 */}
                        {selectedFile && !isDetecting && (
                          <div style={{
                            marginTop: '12px',
                            padding: '8px 12px',
                            background: isDark ? '#1f4838' : '#f6ffed',
                            border: isDark ? '1px solid #274916' : '1px solid #b7eb8f',
                            borderRadius: '4px',
                            fontSize: '12px',
                            color: isDark ? '#95de64' : '#389e0d'
                          }}>
                            ✓ {t.nestDetectionReady}
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                </Col>

                {/* 右侧：标签页区域 */}
                <Col xs={24} lg={12} style={{ height: '100%' }}>
                  <Card 
                    style={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
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
                      flex: 1,
                      padding: 0
                    }}
                  >
                    <Tabs 
                      activeKey={activeTab} 
                      onChange={setActiveTab}
                      style={{ height: '100%' }}
                      tabBarStyle={{ 
                        padding: '0 24px',
                        margin: 0,
                        borderBottom: isDark ? '1px solid #303030' : '1px solid #f0f0f0'
                      }}
                      items={[
                        {
                          key: '1',
                          label: '识别结果',
                          children: (
                            <div style={{ 
                              padding: '24px',
                              height: 'calc(100% - 48px)',
                              overflow: 'auto'
                            }}>
                              {error && (
                                <Alert
                                  message={t.detectionFailed}
                                  description={
                                    <div>
                                      <div style={{ marginBottom: '8px' }}>{error}</div>
                                      {error.includes('识别失败') && (
                                        <div style={{ 
                                          padding: '8px 12px', 
                                          background: isDark ? '#1f1f1f' : '#f6ffed',
                                          border: isDark ? '1px solid #303030' : '1px solid #b7eb8f',
                                          borderRadius: '4px',
                                          fontSize: '12px',
                                          marginTop: '8px'
                                        }}>
                                          <strong>💡 {t.detectionTips}：</strong>
                                          <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
                                            {t.detectionTipsList.map((tip, index) => (
                                              <li key={index}>{tip}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  }
                                  type="error"
                                  showIcon
                                  style={{ marginBottom: '16px' }}
                                />
                              )}
                              
                              {detectionResults.length > 0 && (
                                <div>
                                  <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    marginBottom: '16px'
                                  }}>
                                    <CheckCircleOutlined style={{ 
                                      color: '#52c41a',
                                      fontSize: '18px',
                                      marginRight: '8px'
                                    }} />
                                    <Text strong style={{ fontSize: '16px' }}>
                                      {t.detectionResults} ({detectionResults.length} {t.detectedItems})
                                    </Text>
                                  </div>
                                  
                                  <List
                                    dataSource={detectionResults}
                                    renderItem={(result, index) => {
                                      // 判断类型
                                      const className = (result.class || '').toLowerCase()
                                      const isNest = className === 'nest' || className === 'birdnest' || className.includes('nest')
                                      // 如果不是鸟巢，则默认为其他物体
                                      const isOther = !isNest || result.color === 'red'
                                      
                                      const typeLabel = isNest ? t.nest : t.other
                                      const typeColor = isNest ? 'blue' : 'red'
                                      const itemTitle = isNest ? `${t.nest} #${index + 1}` : `${t.other} #${index + 1}`
                                      
                                      return (
                                        <List.Item 
                                          key={index}
                                          style={{
                                            border: isDark ? '1px solid #303030' : '1px solid #f0f0f0',
                                            borderRadius: '8px',
                                            marginBottom: '12px',
                                            padding: '16px',
                                            background: isDark ? '#262626' : '#fafafa'
                                          }}
                                        >
                                          <List.Item.Meta
                                            avatar={
                                              <FileImageOutlined style={{ 
                                                fontSize: '24px', 
                                                color: isNest ? '#1890ff' : '#ff4d4f'
                                              }} />
                                            }
                                            title={
                                              <Space>
                                                <Text strong style={{ fontSize: '18px' }}>
                                                  {itemTitle}
                                                </Text>
                                                <Tag color={typeColor}>{typeLabel}</Tag>
                                              </Space>
                                            }
                                            description={
                                              <div>
                                                <div style={{ marginBottom: '8px' }}>
                                                  <Text type="secondary">{t.confidence}: </Text>
                                                  <Text style={{ marginLeft: '4px', fontWeight: 500 }}>
                                                    {result.confidence ? `${result.confidence}%` : (currentLang === 'en' ? 'Unknown' : '未知')}
                                                  </Text>
                                                </div>
                                                {result.rect && (
                                                  <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    {t.position}: ({result.rect.x}, {result.rect.y}) | 
                                                    {t.size}: {result.rect.width} × {result.rect.height}
                                                  </Text>
                                                )}
                                              </div>
                                            }
                                          />
                                        </List.Item>
                                      )
                                    }}
                                  />
                                </div>
                              )}
                              
                              {!isDetecting && !error && detectionResults.length === 0 && (
                                <div style={{ 
                                  textAlign: 'center', 
                                  padding: '60px 20px', 
                                  color: '#999',
                                  height: '100%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center'
                                }}>
                                  <FileImageOutlined style={{ 
                                    fontSize: '48px', 
                                    marginBottom: '16px',
                                    color: '#ccc'
                                  }} />
                                  <p style={{ fontSize: '16px', margin: 0 }}>{t.noDetectionData}</p>
                                </div>
                              )}
                            </div>
                          )
                        },
                        {
                          key: '2',
                          label: t.request,
                          children: (
                            <div style={{ 
                              padding: '24px',
                              height: 'calc(100% - 48px)',
                              overflow: 'auto'
                            }}>
                              {requestData ? (
                                <pre style={{ 
                                  background: isDark ? '#1a1a1a' : '#f5f5f5',
                                  padding: '16px',
                                  borderRadius: '4px',
                                  overflow: 'auto',
                                  border: isDark ? '1px solid #303030' : '1px solid #e1e8ed',
                                  fontSize: '13px',
                                  lineHeight: '1.5'
                                }}>
                                  {JSON.stringify(requestData, null, 2)}
                                </pre>
                              ) : (
                                <div style={{ 
                                  textAlign: 'center', 
                                  padding: '60px 20px', 
                                  color: '#999',
                                  height: '100%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center'
                                }}>
                                  <ApiOutlined style={{ 
                                    fontSize: '48px', 
                                    marginBottom: '16px',
                                    color: '#ccc'
                                  }} />
                                  <p style={{ fontSize: '16px', margin: 0 }}>{t.noRequestData}</p>
                                </div>
                              )}
                            </div>
                          )
                        },
                        {
                          key: '3',
                          label: t.response,
                          children: (
                            <div style={{ 
                              padding: '24px',
                              height: 'calc(100% - 48px)',
                              overflow: 'auto',
                              display: 'flex',
                              flexDirection: 'column'
                            }}>
                              {responseData ? (
                                <>
                                  <pre style={{ 
                                    background: isDark ? '#1a1a1a' : '#f5f5f5',
                                    padding: '16px',
                                    borderRadius: '4px',
                                    overflow: 'auto',
                                    border: isDark ? '1px solid #303030' : '1px solid #e1e8ed',
                                    fontSize: '13px',
                                    lineHeight: '1.5',
                                    marginBottom: '24px',
                                    maxHeight: '300px'
                                  }}>
                                    {JSON.stringify(responseData, null, 2)}
                                  </pre>
                                  
                                </>
                              ) : (
                                <div style={{ 
                                  textAlign: 'center', 
                                  padding: '60px 20px', 
                                  color: '#999',
                                  height: '100%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center'
                                }}>
                                  <ApiOutlined style={{ 
                                    fontSize: '48px', 
                                    marginBottom: '16px',
                                    color: '#ccc'
                                  }} />
                                  <p style={{ fontSize: '16px', margin: 0 }}>{t.noResponseData}</p>
                                </div>
                              )}
                            </div>
                          )
                        }
                      ]}
                    />
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
