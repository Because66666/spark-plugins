import Link from 'next/link'
import { Download, CheckCircle, Zap } from 'lucide-react'
import { DonationSection } from '@/components/DonationSection'

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-950">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            Download Multiple Minecraft Plugins Instantly
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Save time by downloading multiple plugins at once, properly named and organized. Perfect for server administrators and Minecraft enthusiasts.
          </p>
          <Link
            href="/download"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Download className="mr-2 h-5 w-5" />
            Start Downloading
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-600/10 text-primary-500 mb-4">
              <Download className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Bulk Downloads</h3>
            <p className="text-gray-400">
              Download multiple plugins simultaneously and save them in an organized folder structure.
            </p>
          </div>

          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-600/10 text-primary-500 mb-4">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Version Compatibility</h3>
            <p className="text-gray-400">
              Easily find plugins that work with your Minecraft server version.
            </p>
          </div>

          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-600/10 text-primary-500 mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast & Easy</h3>
            <p className="text-gray-400">
              Simple interface designed to help you find and download plugins quickly.
            </p>
          </div>
        </div>

        <DonationSection />
      </div>
    </div>
  )
}
