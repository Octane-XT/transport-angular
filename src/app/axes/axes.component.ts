import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AddQuartierComponent } from './add-quartier/add-quartier.component';
import { MatDialog } from '@angular/material/dialog';
import { AddAxeComponent } from './add-axe/add-axe.component';
import { GenericService } from '../service/genericservice.service';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService } from '../service/notification.service';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

// Optionally, define an interface for your data
interface ListAxeQuartier {
  heuretransport_heure: string;
  axe_libelle: string;
  quartier_libelle: string;
  heureaxe_car: string;
}

@Component({
  selector: 'app-axes',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    MatPaginator,
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
  ],
  templateUrl: './axes.component.html',
  styleUrls: ['./axes.component.css'],
})
export class AxesComponent implements OnInit {
  isLoading = false;
  listaxequartier: ListAxeQuartier[] = []; // Define the type explicitly
  listquartier: any;
  axes: any;
  listquartieraxe: any;
  dataSource: MatTableDataSource<ListAxeQuartier> =
    new MatTableDataSource<ListAxeQuartier>([]); // Set type here
  displayedColumns: string[] = ['heure', 'axe', 'quartiers', 'car', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private genericservice: GenericService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    this.loadListAxeQuartier();
    this.listquartier = await this.genericservice.get('quartiers');
    console.log(this.listquartier);
  }

  async loadListAxeQuartier() {
    this.isLoading = true;
    this.listaxequartier = await this.genericservice.get('listaxequartier');
    if (this.listaxequartier && this.listaxequartier.length > 0) {
      this.dataSource = new MatTableDataSource<ListAxeQuartier>(
        this.listaxequartier
      ); // Set data type
      this.dataSource.paginator = this.paginator;
      console.log(this.listaxequartier);
    }
    // Update the datasource with the fetched data
    this.dataSource.data = this.listaxequartier;
    this.isLoading = false;
  }

  exportToExcel() {
    try {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.listaxequartier);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Listes axequartiers');

      XLSX.writeFile(wb, 'listaxequartier.xlsx');
      this.notificationService.showSuccess('Export effectué');
    } catch (error) {
      this.notificationService.showError('Erreur lors de l export');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    // Custom filter logic to only apply to specific columns like nom, axe, quartier, heure
    this.dataSource.filterPredicate = (
      data: ListAxeQuartier,
      filter: string
    ) => {
      // Handle null or undefined values with safe access (using ?. operator)
      return (
        (data.heuretransport_heure?.toLowerCase().includes(filter) ?? false) || // Filter by Heure
        (data.axe_libelle?.toLowerCase().includes(filter) ?? false) || // Filter by Axe
        (data.quartier_libelle?.toLowerCase().includes(filter) ?? false) // Filter by Quartier
      );
    };

    // Apply the filter to the dataSource's filter property
    this.dataSource.filter = filterValue;
  }

  async export() {
    try {
      await this.genericservice.get('export');
      this.notificationService.showSuccess('Export effectué');
    } catch (error) {
      this.notificationService.showError('Erreur lors de l export');
    }
  }

  async addQuartier(item: any) {
    const heureaxeId = item.heureaxe_id;
    console.log('Heureaxe ID:', heureaxeId);

    try {
      this.listquartieraxe = await this.genericservice.get(
        `info-quartier/${heureaxeId}?format=object`
      );
      console.log('Informations sur le quartier:', this.listquartieraxe);

      const dialogRef = this.dialog.open(AddQuartierComponent, {
        width: '500px',
        data: {
          item: item,
          listquartieraxe: this.listquartieraxe,
          HeureaxeId: heureaxeId,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.loadListAxeQuartier();
        }
      });
    } catch (error) {
      this.notificationService.showError(
        'Erreur lors de la récupération des informations du quartier'
      );
      console.error(
        'Erreur lors de la récupération des informations du quartier:',
        error
      );
    }
  }

  async assignationAxe() {
    const dialogRef = this.dialog.open(AddAxeComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const data = {
          heureaxe_axe: result.axe.axe_id,
          heureaxe_car: result.car,
          heureaxe_heure: result.heure.heuretransport_id,
        };
        this.genericservice
          .post('add-axetransport', data)
          .then(async (response) => {
            if (response && response.id) {
              this.notificationService.showSuccess(
                "Assignation d'axe effectuée"
              );
              this.loadListAxeQuartier();
            }
          })
          .catch((error) => {
            this.notificationService.showError(
              "Erreur lors de l'assignation d'axe"
            );
          });
      }
    });
  }

  addSpaceAfterComma(inputString: string): string {
    if (inputString) {
      return inputString.replace(/,/g, ', ');
    }
    return inputString;
  }

  async openConfirmationDialog(item: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(async (confirmed) => {
      if (confirmed) {
        //this.delete(item);
        console.log('Delete action for', item.heureaxe_id);
        const heureaxeid = item.heureaxe_id;
        await this.genericservice
          .delete('delete-axe', heureaxeid)
          .then((response) => {
            if (response && response.id) {
              this.notificationService.showSuccess('Axe supprimé avec succès');
              this.loadListAxeQuartier();
            }
          })
          .catch((error) => {
            this.notificationService.showError('Erreur lors de la suppression');
          });
      }
    });
  }
}
