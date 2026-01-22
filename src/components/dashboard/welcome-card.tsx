/**
 * Welcome Card Component
 * 
 * 欢迎卡片组件，用于展示用户欢迎信息和状态标签
 * 
 * @module WelcomeCard
 * @description 
 * 该组件提供了用户欢迎区域的展示，包括：
 * - 用户头像展示
 * - 欢迎文本和用户名
 * - 用户邮箱信息
 * - 用户状态标签（管理员、在线状态等）
 * - 可选的操作按钮（配置检查、后端演示）
 * - 主题适配（明暗模式）
 * 
 * @performance
 * 使用 React.memo 进行组件记忆化，仅在 props 变化时重新渲染
 * 
 * @author Aerotrace Development Team
 * @version 1.0.0
 */

import React from 'react'
import { Card, Row, Col, Avatar, Typography, Space, Tag, Button } from 'antd'
import { theme } from 'antd'
import { AvatarUpload } from '@/components/avatar-upload'

const { Title, Paragraph } = Typography

/**
 * 欢迎卡片组件的属性接口
 * 
 * @interface WelcomeCardProps
 * @property {string} [username='User'] - 用户名
 * @property {string} [email='user@example.com'] - 用户邮箱
 * @property {string} welcomeText - 欢迎文本
 * @property {string} adminText - 管理员标签文本
 * @property {string} onlineText - 在线状态标签文本
 * @property {string} [configCheckText] - 配置检查按钮文本（可选）
 * @property {string} [backendDemoText] - 后端演示按钮文本（可选）
 * @property {() => void} [onConfigCheck] - 配置检查按钮点击回调函数
 * @property {() => void} [onBackendDemo] - 后端演示按钮点击回调函数
 * @property {boolean} [isDark=false] - 是否为暗色主题模式
 * @property {string} colorPrimary - 主题主色调
 */
interface WelcomeCardProps {
  username?: string
  email?: string
  welcomeText: string
  adminText: string
  onlineText: string
  configCheckText?: string
  backendDemoText?: string
  onConfigCheck?: () => void
  onBackendDemo?: () => void
  isDark?: boolean
  colorPrimary: string
}

/**
 * 欢迎卡片组件
 * 
 * @component WelcomeCard
 * @param {WelcomeCardProps} props - 组件属性对象
 * @returns {JSX.Element} 渲染的欢迎卡片元素
 */
export const WelcomeCard: React.FC<WelcomeCardProps> = React.memo(({
  username = 'User',
  email = 'user@example.com',
  welcomeText,
  adminText,
  onlineText,
  configCheckText,
  backendDemoText,
  onConfigCheck,
  onBackendDemo,
  isDark = false,
  colorPrimary
}) => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken()

  const showButtons = configCheckText && backendDemoText && onConfigCheck && onBackendDemo

  return (
    <Card 
      style={{ 
        marginBottom: 16,
        height: 180,
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
      bodyStyle={{ padding: '24px', height: '100%' }}
    >
      <Row gutter={[24, 16]} align="middle" style={{ height: '100%' }}>
        <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AvatarUpload 
            size={64} 
            showUpload={false}
            style={{ 
              backgroundColor: colorPrimary,
              boxShadow: isDark
                ? `0 4px 16px ${colorPrimary}66` 
                : `0 4px 16px ${colorPrimary}50`
            }}
          />
        </Col>
        <Col flex="auto">
          <Title level={3} style={{ margin: 0 }}>
            {welcomeText}，{username}！
          </Title>
          <Paragraph style={{ 
            margin: '8px 0 0 0', 
            color: isDark ? '#bfbfbf' : '#666' 
          }}>
            {email}
          </Paragraph>
          <Space style={{ marginTop: 12 }}>
            <Tag color="blue">{adminText}</Tag>
            <Tag color="green">{onlineText}</Tag>
          </Space>
        </Col>
        {showButtons && (
          <Col>
            <Space>
              <Button type="primary" onClick={onConfigCheck}>
                {configCheckText}
              </Button>
              <Button onClick={onBackendDemo}>
                {backendDemoText}
              </Button>
            </Space>
          </Col>
        )}
      </Row>
    </Card>
  )
})

WelcomeCard.displayName = 'WelcomeCard' 