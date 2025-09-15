import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GenericService } from '../../service/genericservice.service';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-userannulreservation',
  standalone: true,
  imports: [MatDialogModule, MatIcon, MatButtonModule],
  templateUrl: './userannulreservation.component.html',
  styleUrl: './userannulreservation.component.css',
})
export class UserannulreservationComponent {
  constructor(
    public dialogRef: MatDialogRef<UserannulreservationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private genericService: GenericService,
    private notificationService: NotificationService
  ) {}

  async onSave() {
    console.log('Réservation annulée');
    console.log(this.data.transportuser_id);

    const userid = this.data.transportuser_id;

    if (userid) {
      try {
        await this.genericService.delete('annulation', userid);
        this.notificationService.showSuccess('Réservation annulée');
        this.dialogRef.close(true);
      } catch (error) {
        console.error('Erreur lors de la suppression de la réservation', error);
        this.notificationService.showError(
          'Erreur lors de la suppression de la réservation'
        );
        this.dialogRef.close(false);
      }
    } else {
      console.error('ID de réservation manquant ou invalide');
      this.dialogRef.close(false);
    }
  }

  onCancel() {
    console.log('Annulation de la suppression');
    this.dialogRef.close(false);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
