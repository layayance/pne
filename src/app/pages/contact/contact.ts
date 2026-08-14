import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  readonly isSending = signal(false);
  readonly submitStatus = signal<'idle' | 'success' | 'error'>('idle');

  async submitForm(event: SubmitEvent): Promise<void> {
    const form = event.currentTarget as HTMLFormElement;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    this.isSending.set(true);
    this.submitStatus.set('idle');

    try {
      const response = await fetch('https://formspree.io/f/meajznlk', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Formspree a refusé le message.');
      }

      form.reset();
      this.submitStatus.set('success');
    } catch {
      this.submitStatus.set('error');
    } finally {
      this.isSending.set(false);
    }
  }
}
