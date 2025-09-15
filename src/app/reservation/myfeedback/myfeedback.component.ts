import { Component } from '@angular/core';
import { GenericService } from '../../service/genericservice.service';
import { NotificationService } from '../../service/notification.service';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { count } from 'rxjs';

@Component({
  selector: 'app-myfeedback',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './myfeedback.component.html',
  styleUrl: './myfeedback.component.css',
})
export class MyfeedbackComponent {
  reports: any[] = [];
  comments: any[] = [];
  newComment: string = '';
  countComment: number = 0;

  constructor(
    private genericservice: GenericService,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<MyfeedbackComponent>
  ) {}

  async ngOnInit() {
    const iduser = Number(localStorage.getItem('iduser'));
    const countcom = await this.genericservice.getById(
      'count-commentaires',
      iduser
    );
    this.countComment = countcom[0].count;
    this.reports = await this.genericservice.getById(
      'user-reclamations',
      iduser
    );
    console.log(this.countComment);
  }

  async onPanelOpened(report: any) {
    this.comments = await this.genericservice.getById(
      'commentaires',
      report.transportuser_idreclamation
    );
  }

  async addComment(report: any) {
    if (this.newComment.trim() === '') {
      this.notificationService.showError(
        'Le commentaire ne peut pas être vide!'
      );
      return;
    }

    const requestData = {
      iduser: localStorage.getItem('iduser'),
      idreclamation: report.transportuser_idreclamation,
      commentaire: this.newComment,
    };
    console.log(requestData);

    await this.genericservice
      .post('reclamation/add-commentagt', requestData)
      .then(async (response) => {
        if (response.success) {
          this.notificationService.showSuccess(
            'Votre commentaire a bien été envoyé'
          );
          this.dialogRef.close();
        } else {
          this.notificationService.showError(
            "Une erreur est survenue lors de l'envoi du commentaire"
          );
        }
      });
  }
}
