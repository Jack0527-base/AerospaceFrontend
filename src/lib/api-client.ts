import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ProfileResponse,
  DetailedProfileResponse,
  ProfileAvatarChangeRequest,
  ProfileAvatarChangeResponse,
  ApiResponse,
  AuthResponse,
  ApiVersionResponse,
  DetectRequest,
  DetectResponse,
  PlateInfo,
  // 新后端 API 类型
  AutoRegisterRequest,
  AutoRegisterResponse,
  InspectionDetectResponse,
  InspectionRecordsQuery,
  InspectionRecordsResponse,
  InspectionRecord,
  UpdateRecordStatusRequest,
  StatisticsPeriod,
  StatisticsResponse,
  ConfidenceDistributionResponse,
  ApiSuccessResponse
} from '@/types/api'

// API客户端配置
interface ApiClientConfig {
  baseURL: string
  timeout?: number
  debug?: boolean
}

const DEFAULT_CONFIG: ApiClientConfig = {
  // 新后端 API 服务器地址
  baseURL: 'https://cyzznvgauyxi.sealosbja.site',
  timeout: 30000,
  debug: process.env.NODE_ENV === 'development'
}

/**
 * TypeScript Retrofit风格的API客户端
 * 对接后端 LicensePlate.Server API
 */
export class ApiClient {
  private axios: AxiosInstance
  private config: ApiClientConfig

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    
    // 创建axios实例（使用 Session Cookie 认证）
    this.axios = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true // 启用 Cookie 认证（NextAuth Session）
    })

    // 请求拦截器（新后端使用 Session Cookie，无需手动添加 token）
    this.axios.interceptors.request.use(
      (config) => {
        // 新后端使用 NextAuth Session Cookie，会自动携带
        // 不再需要手动添加 Authorization token

        if (this.config.debug) {
          console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
          if (config.data) {
            console.log('[API] Request body:', config.data)
          }
        }

        return config
      },
      (error) => {
        console.error('[API] Request error:', error)
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.axios.interceptors.response.use(
      (response: AxiosResponse) => {
        if (this.config.debug) {
          console.log(`[API] Response ${response.status}:`, response.data)
        }
        return response
      },
      (error) => {
        console.error('[API] Response error:', error)
        
        // 处理认证错误
        if (error.response?.status === 401) {
          this.clearToken()
          // 可以在这里触发登出逻辑
        }

        return Promise.reject(error)
      }
    )
  }

  // ============ Token管理 ============
  
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  private clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  // ============ 认证API ============

  /**
   * 自动注册临时账号（新后端）
   * POST /api/auth/auto-register
   */
  async autoRegister(request?: AutoRegisterRequest): Promise<AutoRegisterResponse> {
    try {
      const response = await this.axios.post<ApiSuccessResponse<AutoRegisterResponse>>(
        '/api/auth/auto-register',
        request || {}
      )
      if (response.data.success) {
        return response.data.data
      }
      throw new Error('自动注册失败')
    } catch (error: any) {
      throw this.handleError(error, '自动注册临时账号失败')
    }
  }

  /**
   * 用户注册（旧 API，保留兼容）
   * POST /api/v0/auth/register
   */
  async register(request: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await this.axios.post<RegisterResponse>('/api/v0/auth/register', request)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, '注册失败')
    }
  }

  /**
   * 用户登录
   * POST /api/v0/auth/login
   */
  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.axios.post<LoginResponse>('/api/v0/auth/login', request)
      
      // 保存token
      if (response.data.isSuccess && response.data.token) {
        this.setToken(response.data.token)
      }
      
      return response.data
    } catch (error: any) {
      throw this.handleError(error, '登录失败')
    }
  }

  /**
   * 用户登出（清除本地token）
   */
  async logout(): Promise<void> {
    this.clearToken()
  }

  // ============ 用户档案API ============

  /**
   * 获取指定用户档案
   * GET /api/v0/profile/{username}
   */
  async getProfile(username: string): Promise<ProfileResponse> {
    try {
      const response = await this.axios.get<ProfileResponse>(`/api/v0/profile/${username}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, '获取用户档案失败')
    }
  }

  /**
   * 获取当前用户详细档案
   * GET /api/v0/profile
   */
  async getCurrentProfile(): Promise<DetailedProfileResponse> {
    try {
      const response = await this.axios.get<DetailedProfileResponse>('/api/v0/profile')
      return response.data
    } catch (error: any) {
      throw this.handleError(error, '获取用户详细档案失败')
    }
  }

  /**
   * 获取指定用户头像
   * GET /api/v0/profile/{username}/avatar
   */
  async getUserAvatar(username: string): Promise<Blob> {
    try {
      const response = await this.axios.get(`/api/v0/profile/${username}/avatar`, {
        responseType: 'blob'
      })
      return response.data
    } catch (error: any) {
      throw this.handleError(error, '获取用户头像失败')
    }
  }

  /**
   * 获取当前用户头像
   * GET /api/v0/profile/avatar
   */
  async getCurrentUserAvatar(): Promise<Blob> {
    try {
      const response = await this.axios.get('/api/v0/profile/avatar', {
        responseType: 'blob'
      })
      return response.data
    } catch (error: any) {
      throw this.handleError(error, '获取用户头像失败')
    }
  }

  /**
   * 更新用户头像
   * POST /api/v0/profile/avatar
   */
  async updateAvatar(request: ProfileAvatarChangeRequest): Promise<ProfileAvatarChangeResponse> {
    try {
      const response = await this.axios.post<ProfileAvatarChangeResponse>('/api/v0/profile/avatar', request)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, '更新头像失败')
    }
  }

  // ============ Roboflow绝缘子缺陷检测API ============

  /**
   * Roboflow绝缘子缺陷检测（使用Base64图片）
   * POST https://serverless.roboflow.com/insulator-defect-c1kcs/1
   */
  async detectInsulatorByBase64(imageBase64: string): Promise<DetectResponse> {
    try {
      const ROBOFLOW_URL = 'https://serverless.roboflow.com/insulator-defect-c1kcs/1'
      const ROBOFLOW_API_KEY = 'cW6r5HCK2OL5sVo7ymUO'
      
      const response = await axios.post(ROBOFLOW_URL, imageBase64, {
        params: {
          api_key: ROBOFLOW_API_KEY
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 30000
      })
      
      // 转换Roboflow响应格式为DetectResponse格式
      return this.convertRoboflowResponse(response.data)
    } catch (error: any) {
      throw this.handleError(error, '绝缘子缺陷检测失败')
    }
  }

  /**
   * Roboflow绝缘子缺陷检测（使用图片文件）
   */
  async detectInsulatorByImage(file: File): Promise<DetectResponse> {
    try {
      // 将文件转换为Base64（纯base64数据，不含data:image前缀）
      const base64 = await this.fileToBase64(file)
      // 移除data:image/xxx;base64,前缀，只保留base64数据
      const base64Data = base64.split(',')[1] || base64
      return await this.detectInsulatorByBase64(base64Data)
    } catch (error: any) {
      throw this.handleError(error, '绝缘子缺陷检测失败')
    }
  }

  /**
   * 转换Roboflow API响应为DetectResponse格式
   */
  private convertRoboflowResponse(roboflowData: any): DetectResponse {
    try {
      // Roboflow响应格式示例:
      // {
      //   "predictions": [
      //     {
      //       "x": 100,
      //       "y": 200,
      //       "width": 50,
      //       "height": 30,
      //       "confidence": 0.95,
      //       "class": "crack"
      //     }
      //   ],
      //   "image": {...}
      // }
      
      if (!roboflowData || !roboflowData.predictions) {
        return {
          isSuccess: false,
          messages: [{
            code: 'NO_DETECTIONS',
            description: '未检测到缺陷'
          }]
        }
      }

      const predictions = roboflowData.predictions || []
      
      if (predictions.length === 0) {
        return {
          isSuccess: true,
          infos: [],
          messages: [{
            code: 'NO_DETECTIONS',
            description: '未检测到缺陷'
          }]
        }
      }

      // 转换为PlateInfo格式（暂时复用，后续可改为CrackInfo）
      const infos: PlateInfo[] = predictions.map((pred: any, index: number) => {
        const className = (pred.class || '').toLowerCase()
        // 判断是绝缘子还是缺陷
        const isInsulator = className === 'insulator' || className === 'insulators' || className.includes('insulator')
        const isDefect = className === 'crack' || className === 'defect' || className.includes('crack') || className.includes('defect')
        
        // 根据类型设置编号和颜色
        let number = ''
        let color = 'blue' // 默认蓝色（绝缘子）
        
        if (isInsulator) {
          number = `绝缘子-${index + 1}`
          color = 'blue'
        } else {
          // 如果不是绝缘子，则默认为缺陷
          number = `缺陷-${index + 1}`
          color = 'red'
        }
        
        return {
          number,
          confidence: pred.confidence ? Math.round(pred.confidence * 100) : null,
          rect: {
            x: pred.x ? Math.round(pred.x - (pred.width || 0) / 2) : null,
            y: pred.y ? Math.round(pred.y - (pred.height || 0) / 2) : null,
            width: pred.width ? Math.round(pred.width) : null,
            height: pred.height ? Math.round(pred.height) : null
          },
          color,
          class: className // 保存原始class信息
        }
      })

      return {
        isSuccess: true,
        infos: infos,
        messages: [{
          code: 'SUCCESS',
          description: `成功检测到 ${infos.length} 个缺陷`
        }]
      }
    } catch (error: any) {
      console.error('[API] 转换Roboflow响应失败:', error)
      return {
        isSuccess: false,
        messages: [{
          code: 'CONVERSION_ERROR',
          description: '响应数据格式转换失败'
        }]
      }
    }
  }

  // ============ Roboflow鸟巢检测API ============

  /**
   * Roboflow鸟巢检测（使用Base64图片）
   * POST https://serverless.roboflow.com/birdnest-aqzoi-gelsg/1
   */
  async detectNestByBase64(imageBase64: string): Promise<DetectResponse> {
    try {
      const ROBOFLOW_URL = 'https://serverless.roboflow.com/birdnest-aqzoi-gelsg/1'
      const ROBOFLOW_API_KEY = 'cW6r5HCK2OL5sVo7ymUO'
      
      const response = await axios.post(ROBOFLOW_URL, imageBase64, {
        params: {
          api_key: ROBOFLOW_API_KEY
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 30000
      })
      
      // 转换Roboflow响应格式为DetectResponse格式
      return this.convertRoboflowResponse(response.data)
    } catch (error: any) {
      throw this.handleError(error, '鸟巢检测失败')
    }
  }

  /**
   * Roboflow鸟巢检测（使用图片文件）
   */
  async detectNestByImage(file: File): Promise<DetectResponse> {
    try {
      // 将文件转换为Base64（纯base64数据，不含data:image前缀）
      const base64 = await this.fileToBase64(file)
      // 移除data:image/xxx;base64,前缀，只保留base64数据
      const base64Data = base64.split(',')[1] || base64
      return await this.detectNestByBase64(base64Data)
    } catch (error: any) {
      throw this.handleError(error, '鸟巢检测失败')
    }
  }

  // ============ 新后端检测 API ============

  /**
   * 图片上传和检测（新后端 - 文件上传方式）
   * POST /api/inspection/detect
   */
  async inspectionDetectByFile(file: File): Promise<InspectionDetectResponse> {
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await this.axios.post<ApiSuccessResponse<InspectionDetectResponse>>(
        '/api/inspection/detect',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (response.data.success) {
        return response.data.data
      }
      throw new Error('检测失败')
    } catch (error: any) {
      throw this.handleError(error, '图片检测失败')
    }
  }

  /**
   * 图片上传和检测（新后端 - Base64方式）
   * POST /api/inspection/detect
   */
  async inspectionDetectByBase64(imageBase64: string): Promise<InspectionDetectResponse> {
    try {
      // 确保 Base64 字符串包含 data:image 前缀
      const base64Data = imageBase64.startsWith('data:image') 
        ? imageBase64 
        : `data:image/jpeg;base64,${imageBase64}`

      const response = await this.axios.post<ApiSuccessResponse<InspectionDetectResponse>>(
        '/api/inspection/detect',
        { imageBase64: base64Data },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.success) {
        return response.data.data
      }
      throw new Error('检测失败')
    } catch (error: any) {
      throw this.handleError(error, '图片检测失败')
    }
  }

  /**
   * 获取检测记录列表（新后端）
   * GET /api/inspection/records
   */
  async getInspectionRecords(query?: InspectionRecordsQuery): Promise<InspectionRecordsResponse> {
    try {
      const response = await this.axios.get<ApiSuccessResponse<InspectionRecordsResponse>>(
        '/api/inspection/records',
        { params: query }
      )

      if (response.data.success) {
        return response.data.data
      }
      throw new Error('获取检测记录失败')
    } catch (error: any) {
      throw this.handleError(error, '获取检测记录列表失败')
    }
  }

  /**
   * 获取单个检测记录（新后端）
   * GET /api/inspection/records/:id
   */
  async getInspectionRecord(id: string): Promise<InspectionRecord> {
    try {
      const response = await this.axios.get<ApiSuccessResponse<InspectionRecord>>(
        `/api/inspection/records/${id}`
      )

      if (response.data.success) {
        return response.data.data
      }
      throw new Error('获取检测记录失败')
    } catch (error: any) {
      throw this.handleError(error, '获取检测记录失败')
    }
  }

  /**
   * 更新检测记录状态（新后端）
   * PATCH /api/inspection/records/:id/status
   */
  async updateInspectionRecordStatus(
    id: string,
    request: UpdateRecordStatusRequest
  ): Promise<InspectionRecord> {
    try {
      const response = await this.axios.patch<ApiSuccessResponse<InspectionRecord>>(
        `/api/inspection/records/${id}/status`,
        request
      )

      if (response.data.success) {
        return response.data.data
      }
      throw new Error('更新检测记录状态失败')
    } catch (error: any) {
      throw this.handleError(error, '更新检测记录状态失败')
    }
  }

  // ============ 统计相关 API（新后端） ============

  /**
   * 获取统计数据（新后端）
   * GET /api/statistics
   */
  async getStatistics(period: StatisticsPeriod = 'all'): Promise<StatisticsResponse> {
    try {
      const response = await this.axios.get<ApiSuccessResponse<StatisticsResponse>>(
        '/api/statistics',
        { params: { period } }
      )

      if (response.data.success) {
        return response.data.data
      }
      throw new Error('获取统计数据失败')
    } catch (error: any) {
      throw this.handleError(error, '获取统计数据失败')
    }
  }

  /**
   * 获取置信度分布详情（新后端）
   * GET /api/statistics/distribution
   */
  async getConfidenceDistribution(
    period: StatisticsPeriod = 'all',
    bins: number = 10
  ): Promise<ConfidenceDistributionResponse> {
    try {
      const response = await this.axios.get<ApiSuccessResponse<ConfidenceDistributionResponse>>(
        '/api/statistics/distribution',
        { params: { period, bins } }
      )

      if (response.data.success) {
        return response.data.data
      }
      throw new Error('获取置信度分布失败')
    } catch (error: any) {
      throw this.handleError(error, '获取置信度分布详情失败')
    }
  }

  // ============ 车牌检测API ============

  /**
   * 车牌检测（使用Base64图片）
   * POST /api/v0/detect
   */
  async detectPlateByBase64(imageBase64: string): Promise<DetectResponse> {
    try {
      // 确保有认证 token
      await this.ensureAuthenticated()
      
      const response = await this.axios.post<DetectResponse>('/api/v0/detect', {
        imageBase64
      })
      return response.data
    } catch (error: any) {
      throw this.handleError(error, '车牌检测失败')
    }
  }

  /**
   * 车牌检测（使用图片文件）
   * POST /api/v0/detect/image
   */
  async detectPlateByImage(file: File): Promise<DetectResponse> {
    try {
      // 确保有认证 token
      await this.ensureAuthenticated()
      
      // 压缩图片（如果需要）
      const processedFile = await this.compressImageIfNeeded(file)
      
      try {
        // 首先尝试文件上传方式
        const formData = new FormData()
        formData.append('file', processedFile)
        
        const response = await this.axios.post<DetectResponse>('/api/v0/detect/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return response.data
      } catch (fileUploadError: any) {
        console.log('[API] 文件上传方式失败，尝试Base64方式...', fileUploadError.message)
        
        // 如果文件上传失败，尝试Base64方式
        const base64 = await this.fileToBase64(processedFile)
        return await this.detectPlateByBase64(base64)
      }
      
    } catch (error: any) {
      throw this.handleError(error, '车牌检测失败')
    }
  }

  /**
   * 压缩图片（如果文件过大）- 优化版本
   */
  private async compressImageIfNeeded(file: File): Promise<File> {
    const maxSize = 3 * 1024 * 1024 // 提高到3MB限制，给OCR更好的图片质量
    
    if (file.size <= maxSize) {
      console.log('[API] 文件大小正常，无需压缩:', (file.size / 1024).toFixed(2) + ' KB')
      return file
    }
    
    console.log('[API] 文件过大，开始压缩:', (file.size / 1024).toFixed(2) + ' KB')
    
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // 更保守的压缩比例，保持更好的图片质量
        const maxWidth = 2560  // 提高最大宽度
        const maxHeight = 1440 // 提高最大高度
        let { width, height } = img
        
        // 计算缩放比例，优先保持图片清晰度
        const widthRatio = maxWidth / width
        const heightRatio = maxHeight / height
        const ratio = Math.min(widthRatio, heightRatio, 1) // 不放大图片
        
        const newWidth = Math.floor(width * ratio)
        const newHeight = Math.floor(height * ratio)
        
        canvas.width = newWidth
        canvas.height = newHeight
        
        // 使用更好的图片绘制设置
        if (ctx) {
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, newWidth, newHeight)
        }
        
        // 转换为 Blob，使用更高的起始质量
        const tryCompress = (quality: number) => {
          canvas.toBlob((blob) => {
            if (blob) {
              if (blob.size <= maxSize || quality <= 0.3) { // 最低质量提高到30%
                // 创建新的 File 对象
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now()
                })
                
                console.log('[API] 压缩完成:', 
                  '原始:', (file.size / 1024).toFixed(2) + ' KB',
                  '压缩后:', (blob.size / 1024).toFixed(2) + ' KB',
                  '质量:', Math.round(quality * 100) + '%',
                  '尺寸:', `${newWidth}x${newHeight}`
                )
                
                resolve(compressedFile)
              } else {
                // 继续降低质量，但步长更小
                tryCompress(quality - 0.05)
              }
            } else {
              reject(new Error('图片压缩失败'))
            }
          }, file.type, quality)
        }
        
        // 从 0.9 质量开始尝试，提供更好的图片质量
        tryCompress(0.9)
      }
      
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * 确保已认证，如果没有 token 则自动注册和登录
   */
  private async ensureAuthenticated(): Promise<void> {
    // 如果已有 token，直接返回
    const existingToken = this.getToken()
    if (existingToken) {
      console.log('[API] 使用现有认证 token')
      return
    }

    console.log('[API] 没有认证 token，开始自动认证流程...')
    
    try {
      // 生成临时账户信息
      const timestamp = Date.now()
      const tempEmail = `temp_${timestamp}@demo.com`
      const tempUsername = `temp_user_${timestamp}`
      const tempPassword = `TempPass_${timestamp}!`

      console.log('[API] 尝试注册临时账户...')
      
      // 1. 先尝试注册
      const registerResponse = await this.register({
        email: tempEmail,
        username: tempUsername,
        password: tempPassword
      })

      if (!registerResponse.isSuccess) {
        const errorMsg = registerResponse.messages?.[0]?.description || '注册失败'
        throw new Error(`注册失败: ${errorMsg}`)
      }

      console.log('[API] 临时账户注册成功，开始登录...')

      // 2. 注册成功后立即登录
      const loginResponse = await this.login({
        email: tempEmail,
        password: tempPassword
      })

      if (!loginResponse.isSuccess || !loginResponse.token) {
        const errorMsg = loginResponse.messages?.[0]?.description || '登录失败'
        throw new Error(`登录失败: ${errorMsg}`)
      }

      console.log('[API] 自动认证成功，已获取 token')
      
    } catch (error: any) {
      console.error('[API] 自动认证失败:', error)
      throw new Error(`认证失败: ${error.message}`)
    }
  }

  // ============ 便捷方法 ============

  /**
   * 获取用户头像URL（用于显示）
   */
  getUserAvatarUrl(username: string): string {
    return `${this.config.baseURL}/api/v0/profile/${username}/avatar`
  }

  /**
   * 获取当前用户头像URL
   */
  getCurrentUserAvatarUrl(): string {
    return `${this.config.baseURL}/api/v0/profile/avatar`
  }

  /**
   * 将文件转换为Base64字符串
   */
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // 移除data:image/...;base64,前缀
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // ============ 兼容现有本地API ============

  /**
   * 兼容现有登录接口（本地API）
   */
  async localLogin(username: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>('/api/auth/login', {
        username,
        password
      })
      return response.data
    } catch (error: any) {
      throw this.handleError(error, '本地登录失败')
    }
  }

  /**
   * 兼容现有注册接口（本地API）
   */
  async localRegister(username: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>('/api/auth/register', {
        username,
        email,
        password
      })
      return response.data
    } catch (error: any) {
      throw this.handleError(error, '本地注册失败')
    }
  }

  // ============ 错误处理 ============

  private handleError(error: any, defaultMessage: string): Error {
    console.error('[API] Error details:', error)

    // 检查是否有响应数据
    if (error.response?.data) {
      const data = error.response.data
      
      // 处理新后端 API 的错误格式（success: false, error: string）
      if (data.success === false && data.error) {
        return new Error(data.error)
      }
      
      // 处理后端API的标准错误格式（旧格式）
      if (data.messages && Array.isArray(data.messages) && data.messages.length > 0) {
        // 合并所有错误消息
        const messages = data.messages.map((msg: any) => msg.description || msg.code).join('; ')
        return new Error(messages)
      }

      // 处理简单的错误消息
      if (data.message) {
        return new Error(data.message)
      }

      // 处理isSuccess为false的情况（旧格式）
      if (data.isSuccess === false) {
        return new Error(data.error || '操作失败')
      }
    }
    
    // 处理 HTTP 状态码错误
    if (error.response?.status) {
      const status = error.response.status
      if (status === 401) {
        return new Error('未认证，请先登录')
      }
      if (status === 403) {
        return new Error('权限不足')
      }
      if (status === 404) {
        return new Error('资源不存在')
      }
      if (status === 500) {
        return new Error('服务器内部错误')
      }
    }
    
    // 处理网络错误
    if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
      return new Error('网络连接失败，请检查网络连接')
    }
    
    // 处理超时错误
    if (error.code === 'ECONNABORTED') {
      return new Error('请求超时，请重试')
    }
    
    // 处理CORS错误
    if (error.message?.includes('CORS')) {
      return new Error('跨域请求被阻止，请检查服务器配置')
    }

    // 使用原始错误消息
    if (error.message) {
      return new Error(error.message)
    }

    // 使用默认消息
    return new Error(defaultMessage)
  }

  // ============ 配置管理 ============

  /**
   * 更新API基础URL
   */
  setBaseURL(url: string): void {
    this.config.baseURL = url
    this.axios.defaults.baseURL = url
  }

  /**
   * 获取当前配置
   */
  getConfig(): ApiClientConfig {
    return { ...this.config }
  }

  // ============ API信息 ============

  /**
   * 获取API版本信息
   * GET /api/v0/info
   */
  async getApiInfo(): Promise<ApiVersionResponse> {
    try {
      const response = await this.axios.get<ApiVersionResponse>('/api/v0/info')
      return response.data
    } catch (error: any) {
      throw this.handleError(error, '获取API信息失败')
    }
  }
}

// 创建默认实例
export const apiClient = new ApiClient()

// 导出便捷方法
export const backendApi = {
  // API信息
  info: {
    get: () => apiClient.getApiInfo(),
  },

  // 认证
  auth: {
    login: (request: LoginRequest) => apiClient.login(request),
    register: (request: RegisterRequest) => apiClient.register(request),
    logout: () => apiClient.logout(),
    // 新后端：自动注册临时账号
    autoRegister: (request?: AutoRegisterRequest) => apiClient.autoRegister(request),
  },
  
  // 绝缘子缺陷检测（Roboflow）
  detect: {
    byBase64: (imageBase64: string) => apiClient.detectInsulatorByBase64(imageBase64),
    byImage: (file: File) => apiClient.detectInsulatorByImage(file),
    // 保留原有的车牌检测方法（如果需要）
    plateByBase64: (imageBase64: string) => apiClient.detectPlateByBase64(imageBase64),
    plateByImage: (file: File) => apiClient.detectPlateByImage(file),
  },
  
  // 鸟巢检测（Roboflow）
  nestDetection: {
    byBase64: (imageBase64: string) => apiClient.detectNestByBase64(imageBase64),
    byImage: (file: File) => apiClient.detectNestByImage(file),
  },
  
  // 新后端：检测相关 API
  inspection: {
    // 图片检测（文件上传）
    detectByFile: (file: File) => apiClient.inspectionDetectByFile(file),
    // 图片检测（Base64）
    detectByBase64: (imageBase64: string) => apiClient.inspectionDetectByBase64(imageBase64),
    // 获取检测记录列表
    getRecords: (query?: InspectionRecordsQuery) => apiClient.getInspectionRecords(query),
    // 获取单个检测记录
    getRecord: (id: string) => apiClient.getInspectionRecord(id),
    // 更新检测记录状态
    updateRecordStatus: (id: string, status: UpdateRecordStatusRequest) => 
      apiClient.updateInspectionRecordStatus(id, status),
  },
  
  // 新后端：统计相关 API
  statistics: {
    // 获取统计数据
    get: (period?: StatisticsPeriod) => apiClient.getStatistics(period),
    // 获取置信度分布详情
    getDistribution: (period?: StatisticsPeriod, bins?: number) => 
      apiClient.getConfidenceDistribution(period, bins),
  },
  
  // 用户档案
  profile: {
    get: (username: string) => apiClient.getProfile(username),
    getCurrent: () => apiClient.getCurrentProfile(),
    getAvatar: (username: string) => apiClient.getUserAvatar(username),
    getCurrentAvatar: () => apiClient.getCurrentUserAvatar(),
    updateAvatar: (request: ProfileAvatarChangeRequest) => apiClient.updateAvatar(request),
    getAvatarUrl: (username: string) => apiClient.getUserAvatarUrl(username),
    getCurrentAvatarUrl: () => apiClient.getCurrentUserAvatarUrl(),
  },

  // 本地API兼容
  local: {
    login: (username: string, password: string) => apiClient.localLogin(username, password),
    register: (username: string, email: string, password: string) => apiClient.localRegister(username, email, password),
  },
  
  // 工具方法
  utils: {
    fileToBase64: (file: File) => apiClient.fileToBase64(file),
  }
} 