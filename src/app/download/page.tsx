'use client'

import { SearchSection } from '@/components/SearchSection'
import { DownloadSection } from '@/components/DownloadSection'

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 to-dark-900">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-white mb-3">
            Minecraft Plugin Downloader
          </h1>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            Search across multiple sources, select versions, and download plugins in bulk. Streamline your server setup process.
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
