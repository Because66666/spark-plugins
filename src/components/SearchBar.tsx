'use client'

import { Search } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export function SearchBar({ query, onChange, onSubmit, isLoading }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="检索插件..."
        className="flex-1 px-4 py-2 bg-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-400"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Search className="w-5 h-5" />
      </button>
    </form>
  );
}