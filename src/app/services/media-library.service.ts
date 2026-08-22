import { Injectable, signal } from '@angular/core';
import { MediaItem, MediaKind, MediaSection } from '../data/media-item.model';
import { supabase } from '../core/supabase.client';

@Injectable({ providedIn: 'root' })
export class MediaLibraryService {
  readonly items = signal<MediaItem[]>([]);

  async load(): Promise<void> {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('media_items')
      .select('id,section,title,kind,url,created_at')
      .order('created_at', { ascending: false });

    if (!error && data) {
      this.items.set(
        data.map((row) => ({
          id: row.id,
          section: row.section as MediaSection,
          title: row.title,
          kind: row.kind as MediaKind,
          url: row.url,
          createdAt: row.created_at,
        })),
      );
    }
  }

  async add(item: Omit<MediaItem, 'id' | 'createdAt'>): Promise<void> {
    if (!supabase) throw new Error('Supabase n’est pas configuré.');
    const { error } = await supabase.from('media_items').insert({
      section: item.section,
      title: item.title,
      kind: item.kind,
      url: item.url,
    });
    if (error) throw error;
    await this.load();
  }

  async remove(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase n’est pas configuré.');
    const { error } = await supabase.from('media_items').delete().eq('id', id);
    if (error) throw error;
    await this.load();
  }
}
