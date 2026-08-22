import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AssociationAction } from '../../data/action.model';
import { ActionsService } from '../../services/actions.service';
import { supabase } from '../../core/supabase.client';
import { ContactMessagesService } from '../../services/contact-messages.service';
import { ContactMessage } from '../../data/contact-message.model';
import { MediaLibraryService } from '../../services/media-library.service';
import { MediaKind, MediaSection } from '../../data/media-item.model';

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  readonly actionsService = inject(ActionsService);
  readonly contactMessages = inject(ContactMessagesService);
  readonly mediaLibrary = inject(MediaLibraryService);
  readonly authenticated = signal(false);
  readonly saving = signal(false);
  readonly feedback = signal('');
  readonly editingId = signal<string | null>(null);
  readonly galleryUrls = signal<string[]>([]);
  readonly mediaFile = signal<File | null>(null);

  readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['parisnordelite@gmail.com', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  readonly actionForm = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],
    date: ['', Validators.required],
    category: ['Solidarité locale', Validators.required],
    summary: ['', Validators.required],
    description: ['', Validators.required],
    videoUrl: [''],
    posterUrl: [''],
  });

  readonly mediaForm = this.formBuilder.nonNullable.group({
    section: ['futsal' as MediaSection, Validators.required],
    title: ['', Validators.required],
  });

  async ngOnInit(): Promise<void> {
    if (!supabase) return;
    const { data } = await supabase.auth.getSession();
    this.authenticated.set(Boolean(data.session));
    if (data.session) await this.loadAdminData();
  }

  async login(): Promise<void> {
    if (!supabase || this.loginForm.invalid) return;
    this.feedback.set('');
    const { email, password } = this.loginForm.getRawValue();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      this.feedback.set('Connexion impossible. Vérifiez l’adresse et le mot de passe.');
      return;
    }

    this.authenticated.set(true);
    await this.loadAdminData();
  }

  async logout(): Promise<void> {
    await supabase?.auth.signOut();
    this.authenticated.set(false);
  }

  edit(action: AssociationAction): void {
    this.editingId.set(action.id);
    this.actionForm.setValue({
      title: action.title,
      date: action.date,
      category: action.category,
      summary: action.summary,
      description: action.description,
      videoUrl: action.videoUrl || '',
      posterUrl: action.posterUrl || '',
    });
    this.galleryUrls.set(action.imageUrls || []);
    globalThis.scrollTo?.({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.galleryUrls.set([]);
    this.actionForm.reset({ category: 'Solidarité locale' });
  }

  async save(): Promise<void> {
    if (this.actionForm.invalid) {
      this.actionForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.feedback.set('');
    try {
      await this.actionsService.save({
        id: this.editingId() || undefined,
        ...this.actionForm.getRawValue(),
        imageUrls: this.galleryUrls(),
      });
      this.feedback.set('Action enregistrée et publiée.');
      this.cancelEdit();
    } catch {
      this.feedback.set('Impossible d’enregistrer cette action.');
    } finally {
      this.saving.set(false);
    }
  }

  async uploadGallery(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    if (!files.length) return;

    this.saving.set(true);
    this.feedback.set('Ajout des photos en cours…');
    try {
      const urls = await Promise.all(files.map((file) => this.actionsService.upload(file, 'images')));
      this.galleryUrls.update((current) => [...current, ...urls]);
      this.feedback.set('Photos ajoutées. Enregistrez maintenant l’action.');
      input.value = '';
    } catch {
      this.feedback.set('Une ou plusieurs photos n’ont pas pu être ajoutées.');
    } finally {
      this.saving.set(false);
    }
  }

  removeGalleryImage(url: string): void {
    this.galleryUrls.update((current) => current.filter((item) => item !== url));
  }

  selectLibraryFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.mediaFile.set(input.files?.[0] || null);
  }

  async addLibraryMedia(): Promise<void> {
    const file = this.mediaFile();
    if (!file || this.mediaForm.invalid) {
      this.feedback.set('Ajoutez un titre et choisissez une photo ou une vidéo.');
      return;
    }

    this.saving.set(true);
    this.feedback.set('Ajout du média en cours…');
    try {
      const kind: MediaKind = file.type.startsWith('video/') ? 'video' : 'image';
      const url = await this.actionsService.upload(file, kind === 'video' ? 'videos' : 'images');
      const values = this.mediaForm.getRawValue();
      await this.mediaLibrary.add({ ...values, kind, url });
      this.mediaForm.reset({ section: values.section, title: '' });
      this.mediaFile.set(null);
      this.feedback.set('Média ajouté sur le site.');
    } catch {
      this.feedback.set('Impossible d’ajouter ce média.');
    } finally {
      this.saving.set(false);
    }
  }

  async deleteLibraryMedia(id: string, title: string): Promise<void> {
    if (!globalThis.confirm?.(`Supprimer « ${title} » de la galerie ?`)) return;
    await this.mediaLibrary.remove(id);
  }

  async deleteAction(action: AssociationAction): Promise<void> {
    if (!globalThis.confirm?.(`Supprimer « ${action.title} » ?`)) return;
    await this.actionsService.remove(action.id);
  }

  async uploadMedia(event: Event, type: 'videoUrl' | 'posterUrl'): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.saving.set(true);
    this.feedback.set('Téléversement en cours…');
    try {
      const url = await this.actionsService.upload(file, type === 'videoUrl' ? 'videos' : 'images');
      this.actionForm.controls[type].setValue(url);
      this.feedback.set('Fichier ajouté. Enregistrez maintenant l’action.');
    } catch {
      this.feedback.set('Le fichier n’a pas pu être ajouté.');
    } finally {
      this.saving.set(false);
    }
  }

  async markMessageAsRead(message: ContactMessage): Promise<void> {
    await this.contactMessages.markAsRead(message.id);
  }

  async deleteMessage(message: ContactMessage): Promise<void> {
    if (!globalThis.confirm?.(`Supprimer le message de ${message.name} ?`)) return;
    await this.contactMessages.remove(message.id);
  }

  private async loadAdminData(): Promise<void> {
    await Promise.all([
      this.actionsService.loadPublished(),
      this.contactMessages.load(),
      this.mediaLibrary.load(),
    ]);
  }
}
