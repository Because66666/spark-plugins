import { Download } from 'lucide-react';

interface DownloadButtonProps {
  count: number;
  onClick: () => void;
}

export function DownloadButton({ count, onClick }: DownloadButtonProps) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-8 right-8">
      <button
        onClick={onClick}
        className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
      >
        <Download className="h-5 w-5" />
        <span>Download {count} Plugin{count !== 1 ? 's' : ''}</span>
      </button>
    </div>
  );
}