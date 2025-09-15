import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snackbar',
  template: `
    <div [innerHTML]="data.message" class="custom-snackbar-content"></div>
  `,
  styles: [
    `
      .custom-snackbar-content {
        white-space: pre-line;
      }
    `,
  ],
})
export class NotifBarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string }) {}
}
