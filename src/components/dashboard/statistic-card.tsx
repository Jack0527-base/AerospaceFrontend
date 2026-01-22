/**
 * Statistic Card Component
 * 
 * 统计卡片组件，用于展示关键指标数据
 * 
 * @module StatisticCard
 * @description 
 * 该组件提供了一个美观的统计卡片展示，支持：
 * - 自定义标题和数值
 * - 前缀图标和后缀文本
 * - 数值精度控制
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
import { Card, Statistic } from 'antd'
import { theme } from 'antd'

/**
 * 统计卡片组件的属性接口
 * 
 * @interface StatisticCardProps
 * @property {string} title - 统计项标题
 * @property {number | string} value - 统计数值
 * @property {React.ReactNode} [prefix] - 数值前缀（通常为图标）
 * @property {string} [suffix] - 数值后缀（如单位：%、个等）
 * @property {number} [precision] - 数值精度（小数位数）
 * @property {React.CSSProperties} [valueStyle] - 数值样式对象
 * @property {boolean} [isDark=false] - 是否为暗色主题模式
 */
interface StatisticCardProps {
  title: string
  value: number | string
  prefix?: React.ReactNode
  suffix?: string
  precision?: number
  valueStyle?: React.CSSProperties
  isDark?: boolean
}

/**
 * 统计卡片组件
 * 
 * @component StatisticCard
 * @param {StatisticCardProps} props - 组件属性对象
 * @returns {JSX.Element} 渲染的统计卡片元素
 */
export const StatisticCard: React.FC<StatisticCardProps> = React.memo(({
  title,
  value,
  prefix,
  suffix,
  precision,
  valueStyle,
  isDark = false
}) => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken()

  return (
    <Card
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
      bodyStyle={{ 
        padding: '24px', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center' 
      }}
    >
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        suffix={suffix}
        precision={precision}
        valueStyle={valueStyle}
      />
    </Card>
  )
})

StatisticCard.displayName = 'StatisticCard' 