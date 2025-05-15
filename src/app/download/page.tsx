'use client'

import { SearchSection } from '@/components/SearchSection'
import { DownloadSection } from '@/components/DownloadSection'

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 to-dark-900">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-white mb-3">
            Minecraft插件下载器
          </h1>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            从多个来源搜索插件，选择版本并批量下载。简化您的服务器设置流程。
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-[400px] shrink-0">
            <div className="sticky top-6">
              <SearchSection />
            </div>
          </div>
          <div className="flex-1">
            <DownloadSection />
          </div>
        </div>
      </div>
    </div>
  )
}
