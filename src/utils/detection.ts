/**
 * 检测相关的工具函数
 * 提取公共的计算逻辑，避免重复代码
 */

import type { PlateInfo } from '@/types/api'

/**
 * 计算图片缩放比例
 */
export interface ImageSize {
  width: number
  height: number
  naturalWidth: number
  naturalHeight: number
}

/**
 * 计算图片的缩放比例
 * @param displaySize 显示尺寸
 * @param naturalSize 原始尺寸
 * @returns 缩放比例 { scaleX, scaleY }
 */
export function calculateImageScale(
  displaySize: { width: number; height: number },
  naturalSize: { width: number; height: number }
): { scaleX: number; scaleY: number } {
  if (naturalSize.width > 0 && naturalSize.height > 0) {
    return {
      scaleX: displaySize.width / naturalSize.width,
      scaleY: displaySize.height / naturalSize.height,
    }
  }
  return { scaleX: 1, scaleY: 1 }
}

/**
 * 判断检测结果类型（绝缘子检测）
 */
export function getInsulatorType(result: PlateInfo): {
  isInsulator: boolean
  isDefect: boolean
  typeLabel: string
  typeColor: string
} {
  const className = (result.class || '').toLowerCase()
  const isInsulator = className === 'insulator' || className === 'insulators' || className.includes('insulator')
  const isDefect = !isInsulator || result.color === 'red'
  
  return {
    isInsulator,
    isDefect,
    typeLabel: isInsulator ? 'insulator' : 'defect',
    typeColor: isDefect ? 'red' : 'blue',
  }
}

/**
 * 判断检测结果类型（鸟巢检测）
 */
export function getNestType(result: PlateInfo): {
  isNest: boolean
  isOther: boolean
  typeLabel: string
  typeColor: string
} {
  const className = (result.class || '').toLowerCase()
  const isNest = className === 'nest' || className === 'birdnest' || className.includes('nest')
  const isOther = !isNest || result.color === 'red'
  
  return {
    isNest,
    isOther,
    typeLabel: isNest ? 'nest' : 'other',
    typeColor: isNest ? 'blue' : 'red',
  }
}

/**
 * 验证检测结果的有效性
 */
export function isValidDetectionResult(result: PlateInfo): boolean {
  return !!(
    result.rect &&
    result.rect.x !== null &&
    result.rect.y !== null &&
    result.rect.width !== null &&
    result.rect.height !== null
  )
}
