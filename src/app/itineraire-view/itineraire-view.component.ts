import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { LocationService, Itinerary, Axe } from '../service/location.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-itineraire-view',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './itineraire-view.component.html',
  styleUrls: ['./itineraire-view.component.css'],
})
export class ItineraireViewComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<Itinerary>([]);
  isLoading: boolean = false;
  error: string | null = null;
  displayedColumns: string[] = ['axe', 'heure_montee', 'duree_trajet', 'date', 'mapsUrl'];
  axes: Axe[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedAxe: Axe | null = null;
  originalData: Itinerary[] = [];

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.loadAllRoutes();
    this.loadFilterData();
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
  }

  loadAllRoutes(): void {
    this.isLoading = true;
    this.error = null;
    this.dataSource.data = [];

    this.locationService.getAllBusRoutes().subscribe({
      next: (itineraries) => {
        this.isLoading = false;
        this.dataSource.data = itineraries;
        this.dataSource.paginator = this.paginator;
        this.originalData = itineraries;
        console.log('Itinéraires reçus :', itineraries);
        if (!itineraries || itineraries.length === 0) {
          this.error = 'Aucun itinéraire disponible.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = `Erreur lors du chargement des itinéraires : ${err.message}`;
        console.error('Erreur API :', err);
      },
    });
  }

  loadFilterData(): void {
    this.locationService.getAvailableAxes().subscribe({
      next: (axes) => {
        this.axes = axes;
        console.log('Axes reçus :', axes);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des axes :', err);
      },
    });
  }

  formatDuration(duration: string): string {
    const [hoursStr, minutesStr] = duration.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (hours === 0) {
      return `${minutes}min`;
    } else {
      return `${hours}h ${minutes}min`;
    }
  }


  refresh(): void {
    this.startDate = null;
    this.endDate = null;
    this.selectedAxe = null;
    this.dataSource.filter = '';
    this.loadAllRoutes();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onFilterApply(): void {
    this.dataSource.data = this.originalData.filter((itinerary) => {
      let matches = true;

      if (this.selectedAxe) {
        matches = matches && itinerary.axe === this.selectedAxe.axe_libelle;
      }

      if (this.startDate && this.endDate) {
        const itineraryDate = new Date(itinerary.date);
        matches = matches && itineraryDate >= this.startDate && itineraryDate <= this.endDate;
      }
      return matches;
    });

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  customFilterPredicate(data: Itinerary, filter: string): boolean {
    const searchString = filter.toLowerCase();
    return (
      data.axe.toLowerCase().includes(searchString) ||
      data.heure_montee.toLowerCase().includes(searchString) ||
      String(data.date).toLowerCase().includes(searchString)
    );
  }

  exportToExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.dataSource.data.map(item => ({
      Axe: item.axe,
      'Heure Montée': item.heure_montee,
      'Durée Trajet': this.formatDuration(item.duree_trajet),
      Date: new Date(item.date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      'Itinéraire': item.mapsUrl || 'N/A',
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Itinéraires');
    XLSX.writeFile(workbook, 'itineraires.xlsx');
  }
}
