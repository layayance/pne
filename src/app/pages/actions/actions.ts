import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ActionsService } from '../../services/actions.service';
import { MediaGallery } from '../../components/media-gallery/media-gallery';
import { MediaLibraryService } from '../../services/media-library.service';

@Component({
  selector: 'app-actions',
  imports: [RouterLink, DatePipe, MediaGallery],
  templateUrl: './actions.html',
  styleUrl: './actions.scss',
})
export class Actions implements OnInit {
  private readonly actionsService = inject(ActionsService);
  private readonly mediaLibrary = inject(MediaLibraryService);
  readonly latestActions = this.actionsService.actions;
  readonly gallery = computed(() =>
    this.mediaLibrary.items().filter((item) => item.section === 'actions'),
  );

  ngOnInit(): void {
    void this.actionsService.loadPublished();
    void this.mediaLibrary.load();
  }
}
