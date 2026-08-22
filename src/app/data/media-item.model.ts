export type MediaSection = 'actions' | 'futsal' | 'partenaires';
export type MediaKind = 'image' | 'video';

export interface MediaItem {
  id: string;
  section: MediaSection;
  title: string;
  kind: MediaKind;
  url: string;
  createdAt?: string;
}
