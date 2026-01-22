/**
 * Internationalization (i18n) Module
 * 
 * 国际化配置模块，提供多语言支持功能
 * 
 * @module i18n
 * @description 
 * 该模块提供了以下功能：
 * - 定义支持的语言类型（中文、英文）
 * - 存储所有国际化文本内容
 * - 提供语言设置和获取的实用函数
 * - 支持从本地存储读取和保存语言偏好
 * 
 * @author Aerotrace Development Team
 * @version 1.0.0
 */

/**
 * 支持的语言类型
 * 
 * @typedef {('zh' | 'en')} Language
 * @description 'zh' 表示中文，'en' 表示英文
 */
export type Language = 'zh' | 'en'

/**
 * 国际化文本内容对象
 * 
 * @constant {Object} i18nTexts
 * @description 
 * 包含所有支持语言的文本内容映射
 * 每个语言对象包含应用所有页面和组件的文本内容
 * 
 * @property {Object} zh - 中文文本内容
 * @property {Object} en - 英文文本内容
 */
export const i18nTexts = {
  zh: {
    // 菜单项
    dashboard: '仪表盘',
    carRecognition: '绝缘子检测',
    nestDetection: '鸟巢检测',
    configCheck: '配置检查',
    backendDemo: '后端演示',
    systemSettings: '系统设置',
    aboutUs: '关于我们',
    
    // 用户菜单
    profile: '个人资料',
    userSettings: '用户设置',
    generalSettings: '通用设置',
    logout: '退出登录',
    
    // 欢迎区域
    welcomeBack: '欢迎回来',
    admin: '管理员',
    online: '在线',
    
    // 统计卡片
    todayRecognition: '今日检测',
    averageConfidence: '平均置信度',
    onlineDevices: '在线设备',
    inspectedLines: '已巡检线路',
    
    // 系统状态
    systemStatus: '系统状态',
    cpuUsage: 'CPU使用率',
    memoryUsage: '内存使用率',
    diskUsage: '磁盘使用率',
    
    // 面包屑
    overview: '概览',
    
    // 检测页面通用
    uploadImage: '上传图片',
    clickOrDrag: '点击或拖拽文件到此区域上传',
    supportedFormats: '支持 jpg、png、jpeg 格式，推荐文件大小小于 3MB',
    largeFileNotice: '大文件将自动优化处理以确保最佳识别效果',
    fileName: '文件名',
    fileSize: '大小',
    fileType: '类型',
    startDetection: '开始识别',
    detecting: '识别中...',
    clear: '清空',
    readyToDetect: '图片已准备就绪，点击"开始检测"即可检测',
    
    // 鸟巢检测页面
    nestDetectionTitle: '鸟巢检测',
    nestDetectionSubtitle: '上传图片，智能检测鸟巢',
    nestDetectionReady: '图片已准备就绪，点击"开始检测"即可检测鸟巢',
    detectionResults: '识别结果',
    noDetectionData: '暂无检测数据',
    detectionFailed: '识别失败',
    detectionSuccess: '检测成功',
    detectedItems: '个检测项',
    nest: '鸟巢',
    other: '其他',
    confidence: '置信度',
    position: '位置',
    size: '尺寸',
    detectionTips: '检测建议',
    detectionTipsList: [
      '确保鸟巢清晰可见，没有反光或模糊',
      '拍摄时保持适当距离，鸟巢占图片合适比例',
      '避免鸟巢被遮挡（如树枝、树叶等）',
      '在光线充足的环境下拍摄',
      '尽量保持图片水平，避免过度倾斜'
    ],
    
    // 绝缘子检测页面
    insulatorDetectionTitle: '绝缘子检测',
    insulatorDetectionSubtitle: '上传图片，智能检测绝缘子缺陷',
    insulatorDetectionReady: '图片已准备就绪，点击"开始检测"即可检测绝缘子',
    insulator: '绝缘子',
    defect: '缺陷',
    insulatorDetectionTips: [
      '确保绝缘子清晰可见，没有反光或模糊',
      '拍摄时保持适当距离，绝缘子占图片合适比例',
      '避免绝缘子被遮挡（如支架、污渍等）',
      '在光线充足的环境下拍摄',
      '尽量保持图片水平，避免过度倾斜'
    ],
    
    // 标签页
    request: 'Request',
    response: 'Response',
    noRequestData: '暂无请求数据',
    noResponseData: '暂无响应数据',
    
    // 关于我们页面
    aboutUsTitle: '关于我们',
    aboutUsSubtitle: '了解我们的团队和产品',
    companyName: '公司名称',
    companyDescription: '公司简介',
    teamIntroduction: '团队介绍',
    contactUs: '联系我们',
    version: '版本信息',
    copyright: '版权所有'
  },
  en: {
    // 菜单项
    dashboard: 'Dashboard',
    carRecognition: 'Insulator Detection',
    nestDetection: 'Nest Detection',
    configCheck: 'Config Check',
    backendDemo: 'Backend Demo',
    systemSettings: 'System Settings',
    aboutUs: 'About Us',
    
    // 用户菜单
    profile: 'Profile',
    userSettings: 'User Settings',
    generalSettings: 'General Settings',
    logout: 'Logout',
    
    // 欢迎区域
    welcomeBack: 'Welcome back',
    admin: 'Admin',
    online: 'Online',
    
    // 统计卡片
    todayRecognition: "Today's Detection",
    averageConfidence: 'Average Confidence',
    onlineDevices: 'Online Devices',
    inspectedLines: 'Inspected Lines',
    
    // 系统状态
    systemStatus: 'System Status',
    cpuUsage: 'CPU Usage',
    memoryUsage: 'Memory Usage',
    diskUsage: 'Disk Usage',
    
    // 面包屑
    overview: 'Overview',
    
    // 检测页面通用
    uploadImage: 'Upload Image',
    clickOrDrag: 'Click or drag file to this area to upload',
    supportedFormats: 'Supports jpg, png, jpeg formats, recommended file size less than 3MB',
    largeFileNotice: 'Large files will be automatically optimized for best recognition results',
    fileName: 'File Name',
    fileSize: 'Size',
    fileType: 'Type',
    startDetection: 'Start Detection',
    detecting: 'Detecting...',
    clear: 'Clear',
    readyToDetect: 'Image is ready, click "Start Detection" to detect',
    
    // 鸟巢检测页面
    nestDetectionTitle: 'Nest Detection',
    nestDetectionSubtitle: 'Upload image to intelligently detect nests',
    nestDetectionReady: 'Image is ready, click "Start Detection" to detect nests',
    detectionResults: 'Detection Results',
    noDetectionData: 'No detection data',
    detectionFailed: 'Detection Failed',
    detectionSuccess: 'Detection Successful',
    detectedItems: 'detected items',
    nest: 'Nest',
    other: 'Other',
    confidence: 'Confidence',
    position: 'Position',
    size: 'Size',
    detectionTips: 'Detection Tips',
    detectionTipsList: [
      'Ensure the nest is clearly visible without reflection or blur',
      'Maintain appropriate distance when shooting, nest should occupy appropriate proportion of the image',
      'Avoid nest being blocked (such as branches, leaves, etc.)',
      'Shoot in well-lit environment',
      'Keep the image level as much as possible, avoid excessive tilt'
    ],
    
    // 绝缘子检测页面
    insulatorDetectionTitle: 'Insulator Detection',
    insulatorDetectionSubtitle: 'Upload image to intelligently detect insulators defects',
    insulatorDetectionReady: 'Image is ready, click "Start Detection" to detect insulators',
    insulator: 'Insulator',
    defect: 'Defect',
    insulatorDetectionTips: [
      'Ensure the insulator is clearly visible without reflection or blur',
      'Maintain appropriate distance when shooting, insulator should occupy appropriate proportion of the image',
      'Avoid insulator being blocked (such as brackets, stains, etc.)',
      'Shoot in well-lit environment',
      'Keep the image level as much as possible, avoid excessive tilt'
    ],
    
    // 标签页
    request: 'Request',
    response: 'Response',
    noRequestData: 'No request data',
    noResponseData: 'No response data',
    
    // 关于我们页面
    aboutUsTitle: 'About Us',
    aboutUsSubtitle: 'Learn about our team and products',
    companyName: 'Company Name',
    companyDescription: 'Company Description',
    teamIntroduction: 'Team Introduction',
    contactUs: 'Contact Us',
    version: 'Version',
    copyright: 'Copyright'
  }
}

/**
 * 获取当前语言设置
 * 
 * @function getCurrentLanguage
 * @description 
 * 从浏览器本地存储（localStorage）读取用户的语言偏好设置
 * 如果未设置或不在浏览器环境，则返回默认语言（中文）
 * 
 * @returns {Language} 当前语言设置（'zh' 或 'en'）
 * 
 * @example
 * const lang = getCurrentLanguage() // 返回 'zh' 或 'en'
 */
export function getCurrentLanguage(): Language {
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('language')
    return (savedLang === 'en' ? 'en' : 'zh') as Language
  }
  return 'zh'
}

/**
 * 设置语言偏好
 * 
 * @function setLanguage
 * @description 
 * 将用户选择的语言保存到浏览器本地存储（localStorage）
 * 用于持久化用户的语言偏好设置
 * 
 * @param {Language} lang - 要设置的语言（'zh' 或 'en'）
 * @returns {void}
 * 
 * @example
 * setLanguage('en') // 设置语言为英文
 */
export function setLanguage(lang: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang)
  }
}

/**
 * 获取国际化文本对象
 * 
 * @function getI18nText
 * @description 
 * 根据指定的语言返回对应的国际化文本对象
 * 如果未指定语言，则使用当前语言设置
 * 
 * @param {Language} [lang] - 可选的语言参数，如果不提供则使用当前语言设置
 * @returns {Object} 对应语言的国际化文本对象
 * 
 * @example
 * const texts = getI18nText('en') // 获取英文文本对象
 * const currentTexts = getI18nText() // 获取当前语言的文本对象
 */
export function getI18nText(lang?: Language) {
  const currentLang = lang || getCurrentLanguage()
  return i18nTexts[currentLang]
}
