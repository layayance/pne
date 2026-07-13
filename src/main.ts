import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';
import { inject } from '@vercel/analytics';

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    inject();
  })
  .catch(err => console.error(err)); 