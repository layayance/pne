import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ActionsService } from '../../services/actions.service';

@Component({
  selector: 'app-actions',
  imports: [RouterLink, DatePipe],
  templateUrl: './actions.html',
  styleUrl: './actions.scss',
})
export class Actions implements OnInit {
  private readonly actionsService = inject(ActionsService);
  readonly latestActions = this.actionsService.actions;

  ngOnInit(): void {
    void this.actionsService.loadPublished();
  }
}
