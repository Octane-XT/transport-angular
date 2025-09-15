import { Component, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // For date support
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { GenericService } from '../../service/genericservice.service';
import { NotificationService } from '../../service/notification.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
  ],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
})
export class FeedbackComponent implements OnInit {
  complaintTypes: any[] = [];
  selectedComplaintType!: number;
  arrivalTime!: Date;
  description!: string;

  lastReservation: any;

  constructor(
    private genericService: GenericService,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<FeedbackComponent>
  ) {}

  async ngOnInit() {
    // Fetching complaint types from the API (assuming it returns {id, nom})
    this.complaintTypes = await this.genericService.get('typereclamations');

    const UserId = localStorage.getItem('iduser');
    if (UserId) {
      this.lastReservation = await this.genericService.getById(
        'reclamation/lastreservation',
        Number(UserId)
      );
    }
    console.log(this.lastReservation);
  }

  // Method to log the form values when submitted
  async onSubmit() {
    const UserId = localStorage.getItem('iduser');
    const requestData = {
      transportuser_id: this.lastReservation[0].transportuser_id,
      usr_id: UserId,
      transportuser_typereclamation: this.selectedComplaintType,
      transportuser_heurearrive: this.arrivalTime,
      transportuser_description: this.description,
    };
    console.log(requestData);

    await this.genericService
      .post('reclamation/add-reclamation', requestData)
      .then(async (response) => {
        if (response.success) {
          this.notificationService.showSuccess(
            'Votre signalement a bien été envoyé'
          );
          const data = await this.genericService.get('countreclamations');
          this.notificationService.updateNotificationCount(data[0].count);
        } else if (response.error && response.error.includes('Duplicate')) {
          this.notificationService.showError(
            'Limite de signalement atteint, veuillez réessayer à demain'
          );
        } else {
          this.notificationService.showError(
            "Une erreur est survenue lors de l'envoi du signalement"
          );
        }
        this.dialogRef.close();
      });
  }
}
