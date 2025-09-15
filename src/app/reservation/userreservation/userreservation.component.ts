import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import {
  MatOptionModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { GenericService } from '../../service/genericservice.service';
import { UserannulreservationComponent } from '../userannulreservation/userannulreservation.component';
import { UsermodifreservationComponent } from '../usermodifreservation/usermodifreservation.component';
import { FormsModule } from '@angular/forms';
import { FeedbackComponent } from '../feedback/feedback.component';
import { MyfeedbackComponent } from '../myfeedback/myfeedback.component';
import { MatBadgeModule } from '@angular/material/badge';

interface UserReservation {
  axe_libelle: string;
  heureaxe_car: string;
  heuretransport_heure: string;
  transportuser_date: string;
  transportuser_quartier: string;
  quartie: string;
  site: string;
}

@Component({
  selector: 'app-userreservation',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIcon,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatOptionModule,
    CommonModule,
    FormsModule,
    MatBadgeModule,
  ],
  templateUrl: './userreservation.component.html',
  styleUrls: ['./userreservation.component.css'],
  providers: [provideNativeDateAdapter(), DatePipe],
})
export class UserreservationComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedHeure: any;
  selectedAxe: any;
  selectedQuartier: string = '';
  UserReservation: any[] = [];
  UserId = localStorage.getItem('iduser');
  Listheure: any;
  Listaxe: any;
  dialog: any;
  startDate: Date = new Date();
  endDate: Date = new Date();

  notifcount!: number;

  constructor(
    private genericService: GenericService,
    private dialogue: MatDialog
  ) {}

  displayedColumns: string[] = [
    'date',
    'heure',
    'axe',
    'quartier',
    'car',
    'actions',
  ];
  dataSource: MatTableDataSource<UserReservation> =
    new MatTableDataSource<UserReservation>([]);

  async ngOnInit() {
    this.getUserReservation();
    this.Listheure = await this.genericService.get('heure');
    this.Listaxe = await this.genericService.get('axe');
    // const notifdata = await this.genericService.getById(
    //   'countreclamations',
    //   Number(this.UserId)
    // );
    // this.notifcount = notifdata[0].count;
    console.log(this.Listaxe);
    console.log(this.Listheure);

    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  async getUserReservation() {
    this.UserReservation = await this.genericService.getById(
      'axetransportday',
      Number(this.UserId)
    );
    this.dataSource = new MatTableDataSource<UserReservation>(
      this.UserReservation
    );

    console.log(this.UserReservation);
  }

  openConfirmationDialog(item: any) {
    const dialogRef = this.dialogue.open(UserannulreservationComponent, {
      width: '500px',
      data: item,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getUserReservation();
      }
    });

    console.log(item.transportuser_id);
    console.log('Delete', item);
  }

  edit(item: any) {
    const dialogRef = this.dialogue.open(UsermodifreservationComponent, {
      width: '500px',
      data: item,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getUserReservation();
      }
    });
    console.log('Edit', item);
  }

  feedback() {
    const dialogRef = this.dialogue.open(FeedbackComponent, {
      width: '750px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
      }
    });
  }

  myFeedback() {
    const dialogRef = this.dialogue.open(MyfeedbackComponent, {
      width: '750px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
      }
    });
  }

  applyFilter($event: KeyboardEvent) {
    const filterValue = ($event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filterPredicate = (
      data: UserReservation,
      filter: string
    ) => {
      // Apply filter based on heure, axe, and quartier
      const heureMatch = this.selectedHeure
        ? data.heuretransport_heure
            .toLowerCase()
            .includes(this.selectedHeure.toLowerCase())
        : true;
      const axeMatch = this.selectedAxe
        ? data.axe_libelle
            .toLowerCase()
            .includes(this.selectedAxe.toLowerCase())
        : true;
      const quartierMatch = this.selectedQuartier
        ? data.transportuser_quartier
            .toLowerCase()
            .includes(this.selectedQuartier.toLowerCase())
        : true;
      const searchMatch =
        data.transportuser_date.toLowerCase().includes(filterValue) ||
        data.heuretransport_heure.toLowerCase().includes(filterValue) ||
        data.axe_libelle.toLowerCase().includes(filterValue) ||
        data.transportuser_quartier.toLowerCase().includes(filterValue);

      return heureMatch && axeMatch && quartierMatch && searchMatch;
    };

    // Trigger filtering
    this.dataSource.filter = filterValue;
  }

  async onValider() {
    const heure = this.selectedHeure?.heuretransport_heure;
    const axe = this.selectedAxe?.axe_libelle;
    console.log(heure + ' ' + axe);

    // Appliquer le filtre sur les données récupérées
    let filteredData = this.UserReservation;

    // Filtrer par heure
    if (heure) {
      filteredData = filteredData.filter(
        (item) => item.heuretransport_heure === heure
      );
    }

    // Filtrer par axe
    if (axe) {
      filteredData = filteredData.filter((item) => item.axe_libelle === axe);
    }

    // Filtrer par date (entre `startDateObj` et `endDateObj`)
    // if (this.startDate && this.endDate) {
    //   filteredData = filteredData.filter((item) => {
    //     const itemDate = new Date(item.date); // Assurez-vous que `item.date` est une date valide

    //     // Vérifiez que `itemDate` est bien dans la plage entre `startDateObj` et `endDateObj`
    //     return (
    //       itemDate.getTime() >= this.startDate.getTime() &&
    //       itemDate.getTime() <= this.endDate.getTime()
    //     );
    //   });
    // }

    // Mettre à jour le MatTableDataSource avec les données filtrées
    this.dataSource = new MatTableDataSource<UserReservation>(filteredData);
    this.dataSource.paginator = this.paginator; // Appliquer la pagination
  }
}
