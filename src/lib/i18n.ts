// 共享的国际化配置文件

export type Language = 'zh' | 'en'

// 国际化文本
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
    insulatorDetectionTitle: '绝缘子缺陷检测',
    insulatorDetectionSubtitle: '上传图片，智能检测绝缘子缺陷',
    insulatorDetectionReady: '图片已准备就绪，点击"开始检测"即可检测绝缘子缺陷',
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
    noResponseData: '暂无响应数据'
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
    insulatorDetectionTitle: 'Insulator Defect Detection',
    insulatorDetectionSubtitle: 'Upload image to intelligently detect insulator defects',
    insulatorDetectionReady: 'Image is ready, click "Start Detection" to detect insulator defects',
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
    noResponseData: 'No response data'
  }
}

// 获取当前语言设置
export function getCurrentLanguage(): Language {
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('language')
    return (savedLang === 'en' ? 'en' : 'zh') as Language
  }
  return 'zh'
}

// 设置语言
export function setLanguage(lang: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang)
  }
}

// 获取国际化文本
export function getI18nText(lang?: Language) {
  const currentLang = lang || getCurrentLanguage()
  return i18nTexts[currentLang]
}
