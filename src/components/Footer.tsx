import { Github, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-dark-800 py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 mb-8 text-center">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">关于</h3>
            <p className="text-gray-400">
              一款旨在简化Minecraft服务器搭建流程的工具，支持批量下载插件并进行合理组织。
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">链接</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a 
                  href="https://github.com/xLevitate/spark-plugins"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors inline-flex items-center"
                >
                  <Github className="h-4 w-4 mr-2" />
                  原版代码仓库
                </a>
              </li>
              <li>
              <a 
                  href="https://github.com/xLevitate/spark-plugins"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors inline-flex items-center"
                >
                  <Github className="h-4 w-4 mr-2" />
                  汉化代码仓库
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-400">
          <p> 2024 SparkPlugins. All rights reserved.翻译者：<a href="https://github.com/Because66666">Because66666</a></p>
        </div>
      </div>
    </footer>
  )
}