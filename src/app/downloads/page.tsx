import { Header } from '../../components/Header'
import { DownloadSection } from '../../components/DownloadSection'

export default function DownloadsPage() {
  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">下载管理器</h1>
        <DownloadSection />
      </div>
    </main>
  )
}
