export interface Lullaby {
  id: string;
  name: string;
  file_url: string;
  duration: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectorContent {
  id: string;
  name: string;
  file_url: string;
  type: 'image' | 'video';
  created_at: string;
  updated_at: string;
} 