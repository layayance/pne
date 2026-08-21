import { Injectable, signal } from '@angular/core';
import { ContactMessage, NewContactMessage } from '../data/contact-message.model';
import { supabase } from '../core/supabase.client';

@Injectable({ providedIn: 'root' })
export class ContactMessagesService {
  readonly messages = signal<ContactMessage[]>([]);

  async send(message: NewContactMessage): Promise<void> {
    if (!supabase) throw new Error('Supabase n’est pas configuré.');

    const { error } = await supabase.from('contact_messages').insert({
      name: message.name.trim(),
      email: message.email.trim().toLowerCase(),
      subject: message.subject,
      message: message.message.trim(),
    });

    if (error) throw error;
  }

  async load(): Promise<void> {
    if (!supabase) return;

    const { data, error } = await supabase
      .from('contact_messages')
      .select('id,name,email,subject,message,is_read,created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    this.messages.set(
      (data || []).map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        subject: row.subject,
        message: row.message,
        isRead: row.is_read,
        createdAt: row.created_at,
      })),
    );
  }

  async markAsRead(id: string): Promise<void> {
    if (!supabase) return;
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id);
    if (error) throw error;
    this.messages.update((messages) =>
      messages.map((message) => (message.id === id ? { ...message, isRead: true } : message)),
    );
  }

  async remove(id: string): Promise<void> {
    if (!supabase) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) throw error;
    this.messages.update((messages) => messages.filter((message) => message.id !== id));
  }
}
