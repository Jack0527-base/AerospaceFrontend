/**
 * 检测结果框组件
 * 用于在图片上绘制检测框和置信度标签
 * 
 * 性能优化：
 * - 使用React.memo避免不必要的重新渲染
 * - 使用useMemo缓存计算结果
 */

import React, { useMemo } from 'react'

export interface DetectionBox {
  x: number
  y: number
  width: number
  height: number
  confidence: number | null
  color: string
}

export interface DetectionResultBoxProps {
  /** 检测结果框数据 */
  box: DetectionBox
  /** 缩放比例X */
  scaleX: number
  /** 缩放比例Y */
  scaleY: number
  /** 索引 */
  index: number
}

/**
 * 检测结果框组件
 * 在图片上绘制检测框和置信度标签
 */
export const DetectionResultBox: React.FC<DetectionResultBoxProps> = React.memo(({ 
  box, 
  scaleX, 
  scaleY, 
  index 
}) => {
  // 使用useMemo缓存计算后的位置和尺寸
  const { x, y, width, height } = useMemo(() => ({
    x: box.x * scaleX,
    y: box.y * scaleY,
    width: box.width * scaleX,
    height: box.height * scaleY,
  }), [box.x, box.y, box.width, box.height, scaleX, scaleY])

  return (
    <div
      key={index}
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        border: `1px solid ${box.color}`,
        borderRadius: '2px',
        pointerEvents: 'none',
        backgroundColor: 'transparent'
      }}
    >
      {/* 置信度标签 */}
      {box.confidence && box.confidence > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            left: '0',
            background: box.color,
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
          {box.confidence}%
        </div>
      )}
    </div>
  )
})

DetectionResultBox.displayName = 'DetectionResultBox'
