import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { HeaderNav } from './HeaderNav'

export function Header() {
  return (
    <header className="bg-dark-950 border-b border-dark-800">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center space-x-2 group"
          >
            <Sparkles className="h-6 w-6 text-primary-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              SparkPlugins
            </span>
          </Link>
          <HeaderNav />
        </div>
      </nav>
    </header>
  )
}