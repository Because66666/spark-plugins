import Link from 'next/link'
import { Download, CheckCircle, Zap } from 'lucide-react'
import { DonationSection } from '@/components/DonationSection'

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-950">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            一键下载多个Minecraft插件
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            批量下载插件，自动命名整理，节省时间。专为服务器管理员和Minecraft爱好者设计。
          </p>
          <Link
            href="/download"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Download className="mr-2 h-5 w-5" />
            前往下载页面
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-600/10 text-primary-500 mb-4">
              <Download className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">批量下载</h3>
            <p className="text-gray-400">
              同时下载多个插件并保存到整理好的文件夹结构中。
            </p>
          </div>

          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-600/10 text-primary-500 mb-4">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">版本兼容</h3>
            <p className="text-gray-400">
              轻松找到与您的Minecraft服务器版本兼容的插件。
            </p>
          </div>

          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-600/10 text-primary-500 mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">快速便捷</h3>
            <p className="text-gray-400">
              简洁界面设计，助您快速查找和下载插件。
            </p>
          </div>
        </div>

        <DonationSection />
      </div>
    </div>
  )
}
