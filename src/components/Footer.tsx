import { Github, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-dark-800 py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 mb-8 text-center">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">About</h3>
            <p className="text-gray-400">
              A tool designed to simplify the Minecraft server setup process by allowing bulk plugin downloads with proper organization.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a 
                  href="https://github.com/xLevitate/spark-plugins"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors inline-flex items-center"
                >
                  <Github className="h-4 w-4 mr-2" />
                  Source Code
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/sponsors/xLevitate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors inline-flex items-center"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Sponsor Project
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-400">
          <p> 2024 SparkPlugins. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}