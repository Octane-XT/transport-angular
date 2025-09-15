import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  MatOptionModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { GenericService } from '../service/genericservice.service';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService } from '../service/notification.service';
import { FormsModule } from '@angular/forms';
import { AddAxeComponent } from '../axes/add-axe/add-axe.component';
import { AddQuartierComponent } from '../axes/add-quartier/add-quartier.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatExpansionModule,
  MatExpansionPanel,
} from '@angular/material/expansion';
import { HistoriqueComponent } from './historique/historique.component';

@Component({
  selector: 'app-reclamation',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatDatepickerModule,
    MatExpansionModule,
  ],
  templateUrl: './reclamation.component.html',
  styleUrl: './reclamation.component.css',
  providers: [provideNativeDateAdapter(), DatePipe],
})
export class ReclamationComponent implements OnInit {
  reports: any[] = [];
  comments: any[] = [];

  filteredReports = [...this.reports];
  selectedAxeId: number | null = null;
  selectedHeureTransportId: number | null = null;
  selectedDate: Date | null = null;

  showInputForms: boolean[] = []; // Tracks visibility of input forms
  newMessages: string[] = []; // Holds the new message for each report

  constructor(
    private genericservice: GenericService,
    private notificationService: NotificationService,
    private dialogue: MatDialog
  ) {}

  async ngOnInit() {
    this.reports = await this.genericservice.getById('reclamations', 0);
    this.filteredReports = [...this.reports];
    this.notificationService.updateNotificationCount(this.reports.length);
    console.log(this.reports);
  }

  // Filter reports based on selected Axe, HeureTransport, and Date
  filterReports() {
    this.filteredReports = this.reports.filter((report) => {
      const matchesAxe = this.selectedAxeId
        ? report.axe_id === this.selectedAxeId
        : true;
      const matchesHeureTransport = this.selectedHeureTransportId
        ? report.heuretransport_id === this.selectedHeureTransportId
        : true;
      const matchesDate = this.selectedDate
        ? new Date(report.transportuser_date).toDateString() ===
          this.selectedDate.toDateString()
        : true;
      return matchesAxe && matchesHeureTransport && matchesDate;
    });
  }

  // Mark all reports as read
  async markAllAsRead() {
    console.log(this.selectedAxeId);
    console.log(this.selectedHeureTransportId);
    console.log(this.selectedDate);

    const requestData = {
      axe_id: this.selectedAxeId,
      heure_transport: this.selectedHeureTransportId,
      date: this.selectedDate,
    };

    try {
      await this.genericservice
        .post('reclamation', requestData)
        .then(async (response) => {
          if (response.success) {
            this.notificationService.showSuccess(response.message);
            this.reports = await this.genericservice.getById('reclamations', 0);
            this.filteredReports = [...this.reports];
            this.notificationService.updateNotificationCount(
              this.reports.length
            );
          }
        });
    } catch (error) {
      this.notificationService.showError('Erreur lors du signalement');
    }
  }

  toggleInputForm(index: number): void {
    console.log(index);

    this.showInputForms[index] = !this.showInputForms[index];
  }

  // Method to send the message for a specific report
  async sendMessage(index: number) {
    const requestData = {
      iduser: localStorage.getItem('iduser'),
      idreclamation: index,
      commentaire: this.newMessages[index],
    };
    console.log(requestData);

    await this.genericservice
      .post('reclamation/add-commentadm', requestData)
      .then(async (response) => {
        if (response.success) {
          this.notificationService.showSuccess(
            'Votre commentaire a bien été envoyé'
          );
          this.reports = await this.genericservice.getById('reclamations', 0);
          this.filteredReports = [...this.reports];
        } else {
          this.notificationService.showError(
            "Une erreur est survenue lors de l'envoi du signalement"
          );
        }
      });

    // Reset the message input and hide the form after sending
    this.newMessages[index] = '';
    this.showInputForms[index] = false;
  }

  historique() {
    const dialogRef = this.dialogue.open(HistoriqueComponent, {
      minWidth: '75vw',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
      }
    });
  }

  async onPanelOpened(report: any) {
    this.comments = await this.genericservice.getById(
      'commentaires',
      report.transportuser_idreclamation
    );
  }
}
