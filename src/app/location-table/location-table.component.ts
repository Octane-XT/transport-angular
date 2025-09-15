import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { LocationService, Location } from '../service/location.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-location-table',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatMenuModule,
    MatPaginatorModule,
    FormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './location-table.component.html',
  styleUrls: ['./location-table.component.css'],
})
export class LocationTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'usr_nom',
    'usr_prenom',
    'axe',
    'date',
    'heure_montee',
    'heure_descente',
    'usr_matricule',
    'usr_initiale',
    'loc_descente',
    'actions',
  ];
  dataSource = new MatTableDataSource<Location>([]);
  isLoading = false;
  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedAxe: any = null;
  Listaxe: any[] = [];
  locations: Location[] = [];

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.locationService.getLocations().subscribe({
      next: (data) => {
        console.log('Données reçues:', data);
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des locations:', err);
        this.isLoading = false;
        // Optionnel : Afficher un message à l'utilisateur
        alert('Erreur : Impossible de charger les données. Vérifiez que le serveur est en cours d exécution.');
      },
    });
    this.loadFilterData();
  }


  refresh() {
    this.isLoading = true;
    this.locationService.getLocations().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du rafraîchissement:', err);
        this.isLoading = false;
      },
    });
  }


  exportToExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.dataSource.data.map(item => ({
      'Nom': item.usr_nom,
      'Prénom': item.usr_prenom,
      Axe: item.axe,
      Date: new Date(item.date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      'Heure montée': item.heure_montee,
      'Heure descente':item.heure_descente,
      'Matricule': item.usr_matricule,
      'Initiale': item.usr_initiale, 
      'Localisation GPS': item.loc_descente,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Localisations');
    XLSX.writeFile(workbook, 'localisation.xlsx');
  }

 
  loadFilterData() {
    this.locationService.getAxes().subscribe({
      next: (axes) => {
        this.Listaxe = axes;
      },
      error: (err: any) => console.error('Erreur lors du chargement des axes:', err),
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onFilterApply() {
    this.isLoading = true;
    this.locationService.getLocations().subscribe({
      next: (data) => {
        let filteredData = data;
        if (this.startDate && this.endDate) {
          filteredData = filteredData.filter(
            (loc) =>
              new Date(loc.date) >= new Date(this.startDate!) &&
              new Date(loc.date) <= new Date(this.endDate!),
          );
        }
        if (this.selectedAxe) {
          filteredData = filteredData.filter(
            (loc) => loc.axe_id === this.selectedAxe.axe_id,
          );
        }
        this.dataSource.data = filteredData;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du filtrage:', err);
        this.isLoading = false;
      },
    });
  }

  editLocation(location: Location) {
    console.log('Éditer la localisation:', location);
  }

  openConfirmationDialog(location: Location) {
    console.log('Ouvrir la boîte de dialogue de confirmation pour:', location);
  }

  formatTime(time: string): string {
  return time?.substring(0, 5) ?? '';
}

  getGoogleMapsLink(localisation: string): string {
    try {
      const [latitude, longitude] = localisation.split(',').map((coord) =>
        coord.trim(),
      );
      if (!latitude || !longitude || isNaN(Number(latitude)) || isNaN(Number(longitude))) {
        return '#';
      }
      return `https://www.google.com/maps?q=${latitude},${longitude}`;
    } catch {
      return '#';
    }
  }
}