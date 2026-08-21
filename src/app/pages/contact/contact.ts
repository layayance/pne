import { Component, inject, signal } from '@angular/core';
import { ContactMessagesService } from '../../services/contact-messages.service';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private readonly contactMessages = inject(ContactMessagesService);
  readonly isSending = signal(false);
  readonly submitStatus = signal<'idle' | 'success' | 'error'>('idle');

  async submitForm(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    this.isSending.set(true);
    this.submitStatus.set('idle');

    try {
      const data = new FormData(form);

      if (data.get('_gotcha')) {
        form.reset();
        this.submitStatus.set('success');
        return;
      }

      await this.contactMessages.send({
        name: String(data.get('name') || ''),
        email: String(data.get('email') || ''),
        subject: String(data.get('subject') || ''),
        message: String(data.get('message') || ''),
      });

      form.reset();
      this.submitStatus.set('success');
    } catch {
      this.submitStatus.set('error');
    } finally {
      this.isSending.set(false);
    }
  }
}
