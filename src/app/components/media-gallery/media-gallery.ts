import { Component, Input } from '@angular/core';
import { MediaItem } from '../../data/media-item.model';

@Component({
  selector: 'app-media-gallery',
  templateUrl: './media-gallery.html',
  styleUrl: './media-gallery.scss',
})
export class MediaGallery {
  @Input() items: MediaItem[] = [];
  @Input() title = 'En images';
}
