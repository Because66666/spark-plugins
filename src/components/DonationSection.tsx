import { Heart, Star } from 'lucide-react'

export function DonationSection() {
  return (
    <div className="bg-gradient-to-r from-primary-600/10 to-primary-800/10 border border-primary-500/20 rounded-xl p-8 mb-16">
      <div className="text-center max-w-2xl mx-auto">
        <div className="bg-primary-500/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Heart className="h-8 w-8 text-primary-400" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-100">支持项目开发</h2>
        <p className="text-gray-400 mb-6">
          本工具完全免费开源。如果您觉得它有用，请考虑支持开发工作，帮助我们持续维护并添加新功能！
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://github.com/Because66666/spark-plugins"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Star className="mr-2 h-5 w-5" />
            给项目点赞
          </a>
        </div>
      </div>
    </div>
  )
}