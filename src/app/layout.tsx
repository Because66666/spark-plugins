import { ClientLayout } from '@/components/ClientLayout'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

import '@/styles/globals.css'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

export const metadata = {
  title: 'SparkPlugins - Minecraft Plugin Downloader',
  description: 'Download and manage Minecraft plugins from SpigotMC and Modrinth with ease.',
  keywords: ['minecraft', 'plugins', 'spigotmc', 'modrinth', 'server', 'download'],
  authors: [{ name: 'SparkPlugins' }],
  openGraph: {
    title: 'SparkPlugins - Minecraft Plugin Downloader',
    description: 'Download and manage Minecraft plugins from SpigotMC and Modrinth with ease.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SparkPlugins - Minecraft Plugin Downloader',
    description: 'Download and manage Minecraft plugins from SpigotMC and Modrinth with ease.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0F172A" />
      </head>
      <body className="bg-gradient-to-b from-dark-950 to-dark-900 min-h-screen">
        <div className="flex flex-col">
          <Header />
          <ClientLayout>
            <main className="flex-1">
              {children}
            </main>
          </ClientLayout>
          <Footer />
          
        </div>
      </body>
    </html>
  )
}
