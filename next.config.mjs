/** @type {import('next').NextConfig} */
const nextConfig = {
  // React严格模式，帮助发现潜在问题
  reactStrictMode: true,
  
  // 移除X-Powered-By头，提高安全性
  poweredByHeader: false,
  
  // 使用SWC进行编译和压缩，提升构建速度
  swcMinify: true,
  
  // 编译优化配置
  compiler: {
    // 移除console.log（生产环境）
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // 页面内存管理配置
  onDemandEntries: {
    // 页面在内存中保持活动的时间（毫秒）
    maxInactiveAge: 60 * 1000, // 增加到60秒，减少重新编译
    // 同时保留在内存中的页面数
    pagesBufferLength: 5, // 增加到5个页面，提升开发体验
  },
  
  // Webpack配置优化
  webpack: (config, { dev, isServer }) => {
    // 开发模式启用缓存，大幅提升rebuild速度
    if (dev) {
      config.cache = {
        type: 'filesystem',
        // 缓存配置会自动跟踪配置文件变化，无需手动指定
      };
    }
    
    // 优化模块解析
    config.resolve = {
      ...config.resolve,
      // 减少模块查找时间
      symlinks: false,
    };
    
    return config;
  },
  
  // 实验性功能：启用Turbopack（如果可用）
  experimental: {
    // 优化包导入
    optimizePackageImports: ['antd', '@ant-design/icons'],
  },
};

export default nextConfig;
