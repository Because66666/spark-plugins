import { Heart, Star } from 'lucide-react'

export function DonationSection() {
  return (
    <div className="bg-gradient-to-r from-primary-600/10 to-primary-800/10 border border-primary-500/20 rounded-xl p-8 mb-16">
      <div className="text-center max-w-2xl mx-auto">
        <div className="bg-primary-500/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Heart className="h-8 w-8 text-primary-400" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-100">Support the Development</h2>
        <p className="text-gray-400 mb-6">
          This tool is completely free and open-source. If you find it useful, consider supporting its development to help keep it maintained and add new features!
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://github.com/sponsors/xLevitate"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Heart className="mr-2 h-5 w-5" />
            Become a Sponsor
          </a>
          <a
            href="https://github.com/xLevitate/spark-plugins"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-dark-800 text-gray-300 font-semibold rounded-lg hover:bg-dark-700 transition-colors"
          >
            <Star className="mr-2 h-5 w-5" />
            Star on GitHub
          </a>
        </div>
      </div>
    </div>
  )
}