import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MediaGallery } from '../../components/media-gallery/media-gallery';
import { MediaLibraryService } from '../../services/media-library.service';

@Component({
  selector: 'app-futsal',
  imports: [RouterLink, MediaGallery],
  templateUrl: './futsal.html',
  styleUrl: './futsal.scss',
})
export class Futsal implements OnInit {
  private readonly mediaLibrary = inject(MediaLibraryService);
  readonly gallery = computed(() =>
    this.mediaLibrary.items().filter((item) => item.section === 'futsal'),
  );

  ngOnInit(): void {
    void this.mediaLibrary.load();
  }
}
