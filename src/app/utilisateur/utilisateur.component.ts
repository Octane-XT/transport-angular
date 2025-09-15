import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { GenericService } from '../service/genericservice.service';
import { UserannulreservationComponent } from '../reservation/userannulreservation/userannulreservation.component';
import { EditQuartierComponent } from './edit-quartier/edit-quartier.component';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-userreservation',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginator,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIcon,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    CommonModule,
    FormsModule,
    MatBadgeModule,
  ],
  templateUrl: './utilisateur.component.html',
  styleUrl: './utilisateur.component.css',
  providers: [DatePipe],
})
export class UtilisateurComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  Utilisateur: any[] = [];
  UserId = localStorage.getItem('iduser');

  // Define the columns for the table
  displayedColumns: string[] = [
    'username',
    'nom',
    'prenom',
    'quartier',
    'actions',
  ];

  // Create a dataSource for the table
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  constructor(
    private genericService: GenericService,
    private dialogue: MatDialog
  ) {}

  async ngOnInit() {
    await this.getUtilisateur();

    // Set paginator after data is fetched
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    // Custom filter function
    this.dataSource.filterPredicate = (data, filter: string) => {
      const searchTerms = filter.trim().toLowerCase().split(' ');

      return searchTerms.every(
        (term) =>
          data.usr_username.toLowerCase().includes(term) ||
          data.usr_nom.toLowerCase().includes(term) ||
          data.usr_prenom.toLowerCase().includes(term)
      );
    };
  }

  // Fetch user data
  async getUtilisateur() {
    this.Utilisateur = await this.genericService.get('utilisateurs');
    this.dataSource = new MatTableDataSource<any>(this.Utilisateur);
  }

  // Filter the data by search input
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue;
  }

  // Open the edit dialog
  edit(item: any) {
    const dialogRef = this.dialogue.open(EditQuartierComponent, {
      width: '500px',
      data: item,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getUtilisateur();
      }
    });
    console.log('Edit', item);
  }

  // Open the reservation cancellation dialog
  openConfirmationDialog(item: any) {
    const dialogRef = this.dialogue.open(UserannulreservationComponent, {
      width: '500px',
      data: item,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getUtilisateur();
      }
    });
    console.log('Delete', item);
  }
}
