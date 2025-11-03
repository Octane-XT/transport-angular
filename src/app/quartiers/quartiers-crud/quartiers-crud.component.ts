import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Quartier } from './quartier.model';
import { QuartierApiService } from './quartier-api.service';
import { AddEditQuartierDialogComponent } from './add-edit-quartier.dialog';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-quartiers-crud',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './quartiers-crud.component.html',
  styleUrls: ['./quartiers-crud.component.css'],
})
export class QuartiersCrudComponent implements OnInit {
  isLoading = false;
  showArchived = false;

  displayedColumns = ['id', 'libelle', 'status', 'actions'];
  dataSource = new MatTableDataSource<Quartier>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private api: QuartierApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.load();
    this.dataSource.filterPredicate = (data, filter) =>
      (data.quartier_libelle ?? '').toLowerCase().includes(filter);
  }

  load(): void {
    this.isLoading = true;
    const req$ = this.showArchived ? this.api.getArchived() : this.api.getAll();
    req$.subscribe({
      next: (list) => {
        this.dataSource = new MatTableDataSource(list);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  addQuartier() {
    const ref = this.dialog.open(AddEditQuartierDialogComponent, {
      width: '420px',
      data: { mode: 'create' as const },
    });
    ref.afterClosed().subscribe((ok) => ok && this.load());
  }

  editQuartier(row: Quartier) {
    const ref = this.dialog.open(AddEditQuartierDialogComponent, {
      width: '420px',
      data: { mode: 'edit' as const, quartier: row },
    });
    ref.afterClosed().subscribe((ok) => ok && this.load());
  }

  archive(row: Quartier) {
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Archive quartier',
        message: `Archive "${row.quartier_libelle ?? '—'}" ?`,
      },
    });
    ref.afterClosed().subscribe((confirm) => {
      if (confirm)
        this.api.softDelete(row.quartier_id).subscribe(() => this.load());
    });
  }

  restore(row: Quartier) {
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Restore quartier',
        message: `Restore "${row.quartier_libelle ?? '—'}" ?`,
      },
    });
    ref.afterClosed().subscribe((confirm) => {
      if (confirm)
        this.api.restore(row.quartier_id).subscribe(() => this.load());
    });
  }
}
