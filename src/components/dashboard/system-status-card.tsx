/**
 * System Status Card Component
 * 
 * 系统状态卡片组件，用于展示服务器资源使用情况
 * 
 * @module SystemStatusCard
 * @description 
 * 该组件提供了系统监控数据的可视化展示，包括：
 * - CPU 使用率进度条
 * - 内存使用率进度条
 * - 磁盘使用率进度条
 * - 主题适配（明暗模式）
 * - 响应式布局
 * 
 * @performance
 * 使用 React.memo 进行组件记忆化，仅在 props 变化时重新渲染
 * 
 * @author Aerotrace Development Team
 * @version 1.0.0
 */

import React from 'react'
import { Card, Space, Typography, Progress } from 'antd'
import { theme } from 'antd'

const { Text } = Typography

/**
 * 系统状态卡片组件的属性接口
 * 
 * @interface SystemStatusCardProps
 * @property {string} title - 卡片标题
 * @property {string} cpuUsageText - CPU使用率标签文本
 * @property {string} memoryUsageText - 内存使用率标签文本
 * @property {string} diskUsageText - 磁盘使用率标签文本
 * @property {number} [cpuPercent=30] - CPU使用率百分比（0-100）
 * @property {number} [memoryPercent=68] - 内存使用率百分比（0-100）
 * @property {number} [diskPercent=45] - 磁盘使用率百分比（0-100）
 * @property {boolean} [isDark=false] - 是否为暗色主题模式
 */
interface SystemStatusCardProps {
  title: string
  cpuUsageText: string
  memoryUsageText: string
  diskUsageText: string
  cpuPercent?: number
  memoryPercent?: number
  diskPercent?: number
  isDark?: boolean
}

/**
 * 系统状态卡片组件
 * 
 * @component SystemStatusCard
 * @param {SystemStatusCardProps} props - 组件属性对象
 * @returns {JSX.Element} 渲染的系统状态卡片元素
 */
export const SystemStatusCard: React.FC<SystemStatusCardProps> = React.memo(({
  title,
  cpuUsageText,
  memoryUsageText,
  diskUsageText,
  cpuPercent = 30,
  memoryPercent = 68,
  diskPercent = 45,
  isDark = false
}) => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken()

  return (
    <Card 
      title={title}
      style={{
        height: '100%',
        background: isDark
          ? 'linear-gradient(135deg, rgba(38,38,38,0.9) 0%, rgba(58,58,58,0.7) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.8) 100%)',
        border: isDark
          ? '1px solid rgba(255,255,255,0.1)' 
          : '1px solid rgba(24, 144, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        borderRadius: borderRadiusLG,
        boxShadow: isDark
          ? '0 4px 16px rgba(0,0,0,0.3)' 
          : '0 4px 16px rgba(24, 144, 255, 0.08)'
      }}
      bodyStyle={{ padding: '24px', height: 'calc(100% - 57px)' }}
    >
      <Space direction="vertical" style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
        <div style={{ marginBottom: 16 }}>
          <Text>{cpuUsageText}</Text>
          <Progress percent={cpuPercent} size="small" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text>{memoryUsageText}</Text>
          <Progress percent={memoryPercent} size="small" status="active" />
        </div>
        <div>
          <Text>{diskUsageText}</Text>
          <Progress percent={diskPercent} size="small" />
        </div>
      </Space>
    </Card>
  )
})

SystemStatusCard.displayName = 'SystemStatusCard' 