import { Injectable, signal } from '@angular/core';
import { AssociationAction, INITIAL_ACTIONS } from '../data/action.model';
import { isSupabaseConfigured, supabase } from '../core/supabase.client';

type ActionInput = Omit<AssociationAction, 'id'> & { id?: string };

@Injectable({ providedIn: 'root' })
export class ActionsService {
  readonly actions = signal<AssociationAction[]>(INITIAL_ACTIONS);
  readonly loading = signal(false);
  readonly configured = isSupabaseConfigured;

  async loadPublished(): Promise<void> {
    if (!supabase) return;

    this.loading.set(true);
    const { data, error } = await supabase
      .from('actions')
      .select('id,title,date,category,summary,description,video_url,poster_url')
      .eq('published', true)
      .order('date', { ascending: false });

    if (!error && data) {
      this.actions.set(
        data.map((row) => ({
          id: row.id,
          title: row.title,
          date: row.date,
          category: row.category,
          summary: row.summary,
          description: row.description,
          videoUrl: row.video_url || undefined,
          posterUrl: row.poster_url || undefined,
        })),
      );
    }

    this.loading.set(false);
  }

  async save(input: ActionInput): Promise<void> {
    if (!supabase) throw new Error('Supabase n’est pas encore configuré.');

    const row = {
      title: input.title,
      date: input.date,
      category: input.category,
      summary: input.summary,
      description: input.description,
      video_url: input.videoUrl || null,
      poster_url: input.posterUrl || null,
      published: true,
    };

    const query = input.id
      ? supabase.from('actions').update(row).eq('id', input.id)
      : supabase.from('actions').insert(row);
    const { error } = await query;

    if (error) throw error;
    await this.loadPublished();
  }

  async remove(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase n’est pas encore configuré.');
    const { error } = await supabase.from('actions').delete().eq('id', id);
    if (error) throw error;
    await this.loadPublished();
  }

  async upload(file: File, folder: 'videos' | 'images'): Promise<string> {
    if (!supabase) throw new Error('Supabase n’est pas encore configuré.');

    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
    const path = `${folder}/${crypto.randomUUID()}-${safeName}`;
    const { error } = await supabase.storage.from('actions-media').upload(path, file);
    if (error) throw error;

    return supabase.storage.from('actions-media').getPublicUrl(path).data.publicUrl;
  }
}
