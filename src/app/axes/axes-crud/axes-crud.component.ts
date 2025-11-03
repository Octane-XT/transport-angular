// src/app/axes/axes-crud.component.ts
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
import { AxeApiService } from './axe-api.service';
import { Axe } from './axe.model';
import { AddEditAxeDialogComponent } from './add-edit-axe.dialog';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-axes-crud',
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
  templateUrl: './axes-crud.component.html',
  styleUrls: ['./axes-crud.component.css'],
})
export class AxesCrudComponent implements OnInit {
  isLoading = false;
  showArchived = false;

  displayedColumns = ['id', 'libelle', 'status', 'actions'];
  dataSource = new MatTableDataSource<Axe>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private api: AxeApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.load();
    this.dataSource.filterPredicate = (data, filter) =>
      (data.axe_libelle ?? '').toLowerCase().includes(filter);
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

  addAxe() {
    const ref = this.dialog.open(AddEditAxeDialogComponent, {
      width: '420px',
      data: { mode: 'create' },
    });
    ref.afterClosed().subscribe((ok) => ok && this.load());
  }

  editAxe(row: Axe) {
    const ref = this.dialog.open(AddEditAxeDialogComponent, {
      width: '420px',
      data: { mode: 'edit', axe: row },
    });
    ref.afterClosed().subscribe((ok) => ok && this.load());
  }

  archive(row: Axe) {
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Archive axe', message: `Archive "${row.axe_libelle}" ?` },
    });
    ref.afterClosed().subscribe((confirm) => {
      if (confirm) this.api.softDelete(row.axe_id).subscribe(() => this.load());
    });
  }

  restore(row: Axe) {
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Restore axe', message: `Restore "${row.axe_libelle}" ?` },
    });
    ref.afterClosed().subscribe((confirm) => {
      if (confirm) this.api.restore(row.axe_id).subscribe(() => this.load());
    });
  }
}
