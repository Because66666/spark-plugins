export interface ModrinthVersion {
  id: string;
  project_id: string;
  version_number: string;
  game_versions: string[];
  downloads: number;
  files: {
    url: string;
    filename: string;
  }[];
}

export interface ModrinthProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  categories: string[];
  author: string;
  versions: string[];
}

export type PluginSource = 'manual' | 'modrinth';

export interface PluginData {
  source: PluginSource;
  modrinthId?: string;
}