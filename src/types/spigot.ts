export interface SpigotResource {
  id: number;
  name: string;
  description: string;
  author: string;
  testedVersions: string[];
}

export interface SpigotVersion {
  id: number;
  name: string;
  downloadUrl: string;
  gameVersions: string[];
}