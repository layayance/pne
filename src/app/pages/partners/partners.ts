import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MediaGallery } from '../../components/media-gallery/media-gallery';
import { MediaLibraryService } from '../../services/media-library.service';

@Component({
  selector: 'app-partners',
  imports: [RouterLink, MediaGallery],
  templateUrl: './partners.html',
  styleUrl: './partners.scss',
})
export class Partners implements OnInit {
  private readonly mediaLibrary = inject(MediaLibraryService);
  readonly gallery = computed(() =>
    this.mediaLibrary.items().filter((item) => item.section === 'partenaires'),
  );

  ngOnInit(): void {
    void this.mediaLibrary.load();
  }
}
