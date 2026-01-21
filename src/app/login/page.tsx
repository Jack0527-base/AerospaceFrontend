"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store'
import { backendApi } from '@/lib/api-client'

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser } = useAuthStore()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 检查URL参数中的成功消息
  useEffect(() => {
    const message = searchParams.get('message')
    if (message) {
      setSuccessMessage(message)
      // 3秒后清除消息
      setTimeout(() => setSuccessMessage(''), 3000)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // ========== 调试模式：直接登录，无需验证 ==========
      console.log('【调试模式】直接登录，跳过API验证')
      
      // 模拟登录延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 直接设置用户信息
      const user = {
        id: 'debug-user-001',
        username: username || 'debug-user',
        name: username ? username.split('@')[0] : '调试用户',
        avatar: '/avatar.png',
        email: username || 'debug@example.com'
      }
      
      setUser(user) // 设置用户信息
      router.push('/dashboard')
      console.log('【调试模式】登录成功，跳转到dashboard')
      
      // ========== API登录代码（已注释，需要时恢复） ==========
      /*
      console.log('开始登录:', { email: username, password: '***' })

      // 使用后端API进行登录
      console.log('尝试后端API登录...')
      const response = await backendApi.auth.login({
        email: username,
        password: password
      })

      console.log('后端API响应:', response)

      if (response.isSuccess && response.token) {
        // 后端API登录成功
        const user = {
          id: response.id || 'backend-user',
          username: username.split('@')[0], // 从邮箱提取用户名
          name: username.split('@')[0],
          avatar: '/avatar.png',
          email: username
        }
        
        setUser(user) // 设置用户信息
        router.push('/dashboard')
        console.log('后端API登录成功')
      } else {
        throw new Error(response.messages?.[0]?.description || '登录失败，请检查用户名和密码')
      }
      */
    } catch (error: any) {
      console.error('登录失败:', error)
      setError(error.message || '登录失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          width: 100%;
          height: 100%;
        }

        .page-wrapper {
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          overflow: hidden;
        }

        .page-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f0f4f7 0%, #e6eef5 100%);
          z-index: -1;
        }

        .body {
          font-family: Arial, sans-serif;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #333;
          position: relative;
        }

        .svg-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .svg-top,
        .svg-bottom {
          position: absolute;
          z-index: 0;
          pointer-events: none;
        }

        .svg-top {
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: auto;
          opacity: 0.8;
        }

        .svg-bottom {
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: auto;
          opacity: 0.7;
        }

        .container {
          width: 100%;
          max-width: 380px;
          background-color: rgba(255, 255, 255, 0.95);
          padding: 35px;
          border-radius: 18px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(10px);
          text-align: center;
          position: relative;
          z-index: 2;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin: 0 20px;
        }

        .container:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }

        h1 {
          margin-top: 20px;
          font-size: 32px;
          color: #5865f2;
        }

        p {
          font-size: 16px;
          margin-top: 5px;
          color: #888;
        }

        .main-content form {
          margin-top: 40px;
        }

        input {
          width: 100%;
          padding: 15px;
          margin-bottom: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          color: #333;
        }

        .line {
          width: 100%;
          height: 1px;
          background-color: #ddd;
          margin-bottom: 20px;
        }

        button {
          width: 100%;
          padding: 15px;
          background-color: #5865f2;
          color: white;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        button:hover:not(:disabled) {
          background-color: #4752c4;
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .error-message {
          color: #e53935;
          margin-bottom: 20px;
          font-size: 14px;
          text-align: left;
          padding: 8px 12px;
          background-color: rgba(229, 57, 53, 0.1);
          border-radius: 6px;
          border-left: 3px solid #e53935;
        }

        .success-message {
          color: #2e7d32;
          margin-bottom: 20px;
          font-size: 14px;
          text-align: center;
          padding: 8px 12px;
          background-color: rgba(46, 125, 50, 0.1);
          border-radius: 6px;
          border-left: 3px solid #2e7d32;
        }

        footer {
          margin-top: 30px;
          display: flex;
          justify-content: space-between;
        }

        footer p {
          margin-top: 15px;
          font-size: 14px;
        }

        footer p a {
          text-decoration: none;
          color: #5865f2;
        }

        footer p a:hover {
          text-decoration: underline;
        }

        .register-link {
          text-align: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
      `}</style>

      <div className="page-wrapper">
        <div className="page-background"></div>
        <div className="body">
          <div className="svg-container">
            <div className="svg-top">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" height="1337" width="1337">
                <defs>
                  <path id="path-1" opacity="1" fillRule="evenodd" d="M1337,668.5 C1337,1037.455193874239 1037.455193874239,1337 668.5,1337 C523.6725684305388,1337 337,1236 370.50000000000006,1094 C434.03835568300906,824.6732385973953 6.906089672974592e-14,892.6277623047779 0,668.5000000000001 C0,299.5448061257611 299.5448061257609,1.1368683772161603e-13 668.4999999999999,0 C1037.455193874239,0 1337,299.544806125761 1337,668.5Z" />
                  <linearGradient id="linearGradient-2" x1="0.79" y1="0.62" x2="0.21" y2="0.86">
                    <stop offset="0" stopColor="rgb(88,62,213)" stopOpacity="1" />
                    <stop offset="1" stopColor="rgb(23,215,250)" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <g opacity="1">
                  <use xlinkHref="#path-1" fill="url(#linearGradient-2)" fillOpacity="1" />
                </g>
              </svg>
            </div>
            <div className="svg-bottom">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" height="896" width="967.8852157128662">
                <defs>
                  <path id="path-2" opacity="1" fillRule="evenodd" d="M896,448 C1142.6325445712241,465.5747656464056 695.2579309733121,896 448,896 C200.74206902668806,896 5.684341886080802e-14,695.2579309733121 0,448.0000000000001 C0,200.74206902668806 200.74206902668791,5.684341886080802e-14 447.99999999999994,0 C695.2579309733121,0 475,418 896,448Z" />
                  <linearGradient id="linearGradient-3" x1="0.5" y1="0" x2="0.5" y2="1">
                    <stop offset="0" stopColor="rgb(40,175,240)" stopOpacity="1" />
                    <stop offset="1" stopColor="rgb(18,15,196)" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <g opacity="1">
                  <use xlinkHref="#path-2" fill="url(#linearGradient-3)" fillOpacity="1" />
                </g>
              </svg>
            </div>
          </div>
          <section className="container">
            <header>
              <h1>欢迎回来！</h1>
              <p>循翼 Aerotrace 登录</p>
            </header>
            
            {successMessage && (
              <div className="success-message">
                {successMessage}
              </div>
            )}
            
            <section className="main-content">
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="邮箱地址"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <div className="line"></div>
                <input
                  type="password"
                  placeholder="密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {error && <div className="error-message">{error}</div>}

                <button type="submit" disabled={isLoading}>
                  {isLoading ? '登录中...' : '登录'}
                </button>
              </form>
            </section>
            <footer>
              <p>
                <Link href="/forgot-password">
                  <span style={{ color: '#5865f2', fontWeight: '500', cursor: 'pointer', textDecoration: 'underline' }}>
                    忘记密码?
                  </span>
                </Link>
              </p>
            </footer>
            
            <div className="register-link">
              <p>
                还没有账户？ 
                <Link href="/register">
                  <span style={{ color: '#5865f2', fontWeight: '500', cursor: 'pointer', textDecoration: 'underline' }}>
                    立即注册
                  </span>
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  )
} 

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent/>
    </Suspense>);
}