import { Component, ViewChild } from '@angular/core';
import { GenericService } from '../../service/genericservice.service';
import { NotificationService } from '../../service/notification.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-myfeedback',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
  ],
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.css',
})
export class HistoriqueComponent {
  reports: any[] = [];
  filteredReports: any[] = [];
  selectedReport: any | null = null;

  months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  years = [2020, 2021, 2022, 2023, 2024, 2025];
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();

  displayedColumns: string[] = ['comments'];
  pageSize: number = 10;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    private genericservice: GenericService,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<HistoriqueComponent>
  ) {}

  async ngOnInit() {
    const iduser = Number(localStorage.getItem('iduser'));
    this.reports = await this.genericservice.getById('reclamations');
    this.filterReports(); // Initial filtering on load
  }

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
  }

  filterReports() {
    // Filter reports based on the selected month and year
    const filtered = this.reports.filter((report) => {
      const reportDate = new Date(report.transportuser_date);
      return (
        reportDate.getMonth() + 1 === this.selectedMonth &&
        reportDate.getFullYear() === this.selectedYear
      );
    });

    this.filteredReports = filtered;
    this.dataSource.data = filtered; // Update dataSource with the filtered data
  }

  pageEvent(event: any) {
    // Handle page changes if needed (you can also log or adjust the filtered data)
    console.log('Page event:', event);
  }

  onPanelOpened(report: any) {
    // When panel is opened, mark as expanded
    report.isExpanded = true;

    // Fetch comments if not already fetched
    if (!report.comments) {
      this.genericservice
        .getById('commentaires', report.transportuser_idreclamation)
        .then((comments: any[]) => {
          report.comments = comments;
        });
    }
  }

  onPanelClosed(report: any) {
    // When panel is closed, mark as not expanded
    report.isExpanded = false;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
