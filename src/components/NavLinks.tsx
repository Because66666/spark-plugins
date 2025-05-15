'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Download, Home, Github, Heart } from 'lucide-react'

export function NavLinks() {
  const pathname = usePathname()

  return (
    <div className="flex items-center space-x-6">
      <Link 
        href="/"
        className={`flex items-center space-x-1 hover:text-primary-400 transition-colors ${
          pathname === '/' ? 'text-primary-400' : 'text-gray-300'
        }`}
      >
        <Home className="h-4 w-4" />
        <span>主页</span>
      </Link>
      <Link
        href="/download"
        className={`flex items-center space-x-1 hover:text-primary-400 transition-colors ${
          pathname === '/download' ? 'text-primary-400' : 'text-gray-300'
        }`}
      >
        <Download className="h-4 w-4" />
        <span>下载</span>
      </Link>
      <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-dark-800">
        <a
          href="https://github.com/xLevitate/spark-plugins"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-primary-400 transition-colors"
          title="View source on GitHub"
        >
          <Github className="h-5 w-5" />
        </a>
      </div>
    </div>
  )
}
