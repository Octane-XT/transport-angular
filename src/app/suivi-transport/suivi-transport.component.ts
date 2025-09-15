import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatOptionModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EditFormComponent } from './edit-form/edit-form.component';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { GenericService } from '../service/genericservice.service';
import { SuiviTransportService } from './suivi-transport.service';
import { AddFormComponent } from './add-form/add-form.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService } from '../service/notification.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import * as XLSX from 'xlsx';
import { AddFormUserComponent } from './add-form-user/add-form-user.component';

interface ListSuiviTransport {
  usr_prenom: any;
  transportuser_id(arg0: string, transportuser_id: any): unknown;
  heuretransport_id(arg0: string, heuretransport_id: any): unknown;
  date(arg0: string, date: any): unknown;
  axe_id(arg0: string, axe_id: any): unknown;
  heuretransport_heure: string;
  user_prenom: string;
  axe_libelle: string;
  planning_sortie: string;
  campagnes_et_services: string;
  quartier_libelle: string;
  site_libelle: string;
  heureaxe_car: string;
  transportuser_quartier: string;
  color: string;
}

interface DataItem {
  heuretransport_heure: string;
  axe_libelle: string;
  [key: string]: any; // autres propriétés dynamiques
}

interface ResponseItem {
  axe_libelle: string;
  heuretransport_heure: string;
  // autres propriétés
}

@Component({
  selector: 'app-suivi-transport',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatIcon,
    MatFormFieldModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
  ],
  templateUrl: './suivi-transport.component.html',
  styleUrls: ['./suivi-transport.component.css'],
  providers: [provideNativeDateAdapter(), DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuiviTransportComponent implements OnInit {
  isLoading = false;
  selectedHeure: any;
  selectedAxe: any;
  selectedDate: any;
  heure: any;
  axe: any;
  // Static data for the table
  data = [];
  listsuivitransport: any[] = [];
  listAgentUser: any[] = [];
  displayedColumns: string[] = [
    'date',
    'nom',
    'hsPlanifie',
    'heure',
    'axe',
    'quartie',
    'site',
    'service',
    'actions',
  ];
  Listaxe: any[] = [];
  Listheure: any[] = [];
  ListSuiviTransportFiltre: any;
  AllSuiviTransport: any;
  debut = new Date().toISOString().split('T')[0];
  fin = this.debut;
  allaxe: any;
  axequartier: any;

  startDate: Date = new Date();
  endDate: Date = new Date();

  // dataSource = new MatTableDataSource(this.data);
  dataSource: MatTableDataSource<ListSuiviTransport> =
    new MatTableDataSource<ListSuiviTransport>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  constructor(
    private dialog: MatDialog,
    private genericService: GenericService,
    private suiviTransportService: SuiviTransportService,
    private notificationService: NotificationService,
    private datePipe: DatePipe
  ) {
    this.startDate.setHours(0, 0, 0, 0);
    this.endDate.setHours(23, 59, 59, 999);
  }

  async ngOnInit() {
    this.getAllAxe();
    this.getAxeQuartier();
    this.loadsuivitransport().then(() => {
      this.getColor();
    });
  }

  async loadfilterdata() {
    if (this.Listheure.length == 0 && this.Listaxe.length == 0) {
      this.Listheure = await this.genericService.get('heure');
      this.Listaxe = await this.genericService.get('axe');
    }
  }

  async loadsuivitransport() {
    this.isLoading = true;
    const rolepoids = localStorage.getItem('rolepoids');
    const iduser = localStorage.getItem('iduser');
    const usercampagne = localStorage.getItem('usercampagne');

    if (Number(rolepoids) >= 3 && Number(usercampagne) != 0) {
      this.listsuivitransport = await this.genericService.getAgentCampagne(
        'getAgentUser',
        Number(iduser),
        Number(usercampagne),
        Number(rolepoids)
      );
    } else {
      this.listsuivitransport = await this.genericService.get('getallsuivi');
    }

    // this.listsuivitransport = await this.suiviTransportService.get(
    //   this.debut,
    //   this.fin
    // );
    console.log(this.listsuivitransport);
    if (this.listsuivitransport && this.listsuivitransport.length > 0) {
      this.dataSource = new MatTableDataSource<ListSuiviTransport>(
        this.listsuivitransport
      );
      this.dataSource.paginator = this.paginator;
    }

    this.dataSource.data = this.listsuivitransport;
    this.isLoading = false;
  }

  async getAllSuiviTransport() {
    const result = await this.genericService.get('getallsuivi');
    console.log(result);
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.listsuivitransport
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Suivi Transport');

    XLSX.writeFile(wb, 'suivi_transport.xlsx');
  }

  async exportToExcel2() {
    const currentDate = new Date(); // Récupère la date actuelle au format 'YYYY-MM-DD'

    // Filtrer les données pour ne garder que celles de la date actuelle
    const filteredData = this.listsuivitransport.filter((item) => {
      const itemDate = new Date(item.date); // Assurez-vous que `item.date` est une date valide

      // Vérifiez que `itemDate` est bien dans la plage entre `startDateObj` et `endDateObj`
      return (
        itemDate.getTime() >= this.startDate.getTime() &&
        itemDate.getTime() <= this.endDate.getTime()
      );
    });
    // Créer un objet pour organiser les données par axe_libelle
    const groupedData: { [key: string]: any[] } = {};
    const response: DataItem[] = await this.genericService.get('getHeureAxe');
    response.forEach((res) => {
      filteredData.forEach((data) => {
        // Si l'axe_libelle n'existe pas encore, créer un tableau vide
        const f = res.heuretransport_heure + ',' + res.axe_libelle;
        const feuille = f.replace(/[\/:*?"<>|]/g, '-').slice(0, 31);

        if (!groupedData[feuille]) {
          groupedData[feuille] = [];
        }
        // Ajouter la donnée à l'axe correspondant
        if (
          res.axe_libelle == data.axe_libelle &&
          res.heuretransport_heure == data.heuretransport_heure
        ) {
          groupedData[feuille].push([
            data.campagnes_et_services,
            data.usr_prenom,
            data.transportuser_quartier,
            data.heuretransport_heure,
            '',
            '',
            '',
            '',
            '',
            '',
            '',
          ]);
        }
      });
    });

    // Créer un classeur (workbook)
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Ajouter une feuille pour chaque axe_libelle
    for (const feuille in groupedData) {
      if (groupedData.hasOwnProperty(feuille)) {
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
          [
            'Service',
            'Prénom',
            'Quartier',
            'Heure de sortie',
            'Heure de départ',
            `Heure d'arrivée`,
            `Signature pas besoin d'accompagnateur`,
            'Durée accompagnement',
            'Commentaire',
            'Signature',
          ], // Entêtes
          ...groupedData[feuille], // Données pour cet axe_libelle
        ]);

        // Calculer la largeur des colonnes en fonction de la longueur du contenu
        const maxLengthPerColumn: number[] = [];

        // Vérifiez les données pour chaque colonne (y compris les en-têtes)
        const ref = ws['!ref'];
        if (ref) {
          // Extraire la deuxième partie de la référence (par exemple "1" de "A1:B10")
          const lastRowStr = ref.split(':')[1]?.slice(1);
          if (lastRowStr) {
            // Convertir en un nombre entier
            const lastRow = parseInt(lastRowStr, 10);

            // Vérifiez que le nombre est valide
            if (!isNaN(lastRow)) {
              // Boucle sur les lignes
              for (let row = 0; row < lastRow; row++) {
                const rowData = ws[row];
                if (rowData) {
                  for (let col = 0; col < rowData.length; col++) {
                    const cellValue = rowData[col]
                      ? rowData[col].toString()
                      : '';
                    maxLengthPerColumn[col] = Math.max(
                      maxLengthPerColumn[col] || 0,
                      cellValue.length
                    );
                  }
                }
              }
            }
          }
        }

        // Définir la largeur de chaque colonne (par exemple, ajouter un petit padding)
        ws['!cols'] = maxLengthPerColumn.map((length) => ({ wch: length + 2 }));

        // Ajouter la feuille au classeur
        XLSX.utils.book_append_sheet(wb, ws, feuille);
      }
    }

    // Exporter le fichier Excel
    const today = new Date();

    // Formater la date sous le format 'YYYY-MM-DD'
    const formattedDate = today.toISOString().split('T')[0]; // Ex : '2024-12-05'

    // Ajouter la date au nom du fichier
    const fileName = `Transport du ${formattedDate}.xlsx`;

    // Exporter le fichier XLSX avec ce nom
    XLSX.writeFile(wb, fileName);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    // Apply the filter to the dataSource's filter property
    this.dataSource.filter = filterValue;

    // Custom filter logic to only apply to specific columns like nom, axe, quartier, heure
    this.dataSource.filterPredicate = (
      data: ListSuiviTransport,
      filter: string
    ) => {
      return (
        data.usr_prenom.toLowerCase().includes(filter) || // Filter by Nom
        data.axe_libelle.toLowerCase().includes(filter) || // Filter by Axe
        data.transportuser_quartier.toLowerCase().includes(filter) || // Filter by Quartier
        data.heuretransport_heure.toLowerCase().includes(filter) // Filter by Heure
      );
    };
  }

  async onValider() {
    this.isLoading = true;

    const heure = this.selectedHeure?.heuretransport_heure;
    const axe = this.selectedAxe?.axe_libelle;

    // Appliquer le filtre sur les données récupérées
    let filteredData = this.listsuivitransport;

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
    if (this.startDate && this.endDate) {
      console.log(this.startDate);
      console.log(this.endDate);

      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.date); // Assurez-vous que `item.date` est une date valide

        // Vérifiez que `itemDate` est bien dans la plage entre `startDateObj` et `endDateObj`
        return (
          itemDate.getTime() >= this.startDate.getTime() &&
          itemDate.getTime() <= this.endDate.getTime()
        );
      });
    }

    // Mettre à jour le MatTableDataSource avec les données filtrées
    this.dataSource = new MatTableDataSource<ListSuiviTransport>(filteredData);
    this.dataSource.paginator = this.paginator; // Appliquer la pagination
    this.isLoading = false;
  }

  async getAllAxe() {
    this.allaxe = await this.genericService.get('axeheure');
    console.log(this.allaxe);
  }

  async getAxeQuartier() {
    this.axequartier = await this.genericService.get('axequartier');
    console.log(this.axequartier);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async edit(item: any) {
    const dialogRef = this.dialog.open(EditFormComponent, {
      width: '500px',
      data: item,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadsuivitransport();
      }
    });
    console.log(item.transportuser_id);
  }

  async add() {
    const rolepoids = localStorage.getItem('rolepoids');
    const iduser = localStorage.getItem('iduser');
    const usercampagne = localStorage.getItem('usercampagne');
    if (Number(rolepoids) >= 3 && Number(usercampagne) != 0) {
      const dialogRef = this.dialog.open(AddFormUserComponent, {
        width: '500px',
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          const data = {
            reservations: [
              {
                heure: result.heure,
                axe: result.axe,
                quartier: result.quartier,
                date: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
              },
              // You can add more reservation objects here
            ],
            transportuser_user: result.user.usr_id,
          };
          console.log(data);

          await this.genericService
            .post('adduser', data)
            .then((response) => {
              if (response && response.id) {
                this.notificationService.showSuccess(
                  'Ajout suivi transport effectué'
                );
                this.loadsuivitransport();
              }
            })
            .catch((error) => {
              this.notificationService.showError(
                "Erreur lors de l'ajout suivi transport"
              );
            });
        }
      });
    } else {
      const dialogRef = this.dialog.open(AddFormComponent, {
        width: '500px',
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          const data = {
            heuretransport_id: result.heure.heuretransport_id,
            axe_id: result.axe.axe_id,
            heuretransport_heure: result.heure.heuretransport_heure,
            axe_libelle: result.axe.axe_libelle,
            transportuser_quartier: result.quartier.quartier_libelle,
            usr_prenom: result.nom,
            date: new Date(),
            planning_sortie: '',
          };
          console.log(data);

          await this.genericService
            .post('user', data)
            .then((response) => {
              if (response && response.id) {
                this.notificationService.showSuccess(
                  'Ajout suivi transport effectué'
                );
                this.loadsuivitransport();
              }
            })
            .catch((error) => {
              this.notificationService.showError(
                "Erreur lors de l'ajout suivi transport"
              );
            });
        }
      });
    }
  }

  openConfirmationDialog(item: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(async (confirmed) => {
      if (confirmed) {
        this.delete(item);
        const transportuser = item.transportuser_id;
        const transportusertemp = item.transporttemp_id;

        if (transportusertemp) {
          await this.genericService.delete(
            'delete-reservationtemp',
            transportusertemp
          );
        } else {
          await this.genericService
            .delete('delete-reservation', transportuser)
            .then((response) => {
              if (response && response.id) {
                this.notificationService.showSuccess(
                  'Suppression suivi transport effectué'
                );
                this.loadsuivitransport();
              }
            })
            .catch((error) => {
              this.notificationService.showError(
                'Erreur lors de la suppression suivi transport'
              );
            });
        }
      }
    });
  }

  async refresh() {
    this.isLoading = true;
    this.listsuivitransport = await this.suiviTransportService.get(
      this.debut,
      this.fin
    );
    console.log(this.listsuivitransport);
    if (this.listsuivitransport && this.listsuivitransport.length > 0) {
      this.dataSource = new MatTableDataSource<ListSuiviTransport>(
        this.listsuivitransport
      );
      this.dataSource.paginator = this.paginator;
    }

    this.dataSource.data = this.listsuivitransport;
    this.isLoading = false;
  }

  delete(item: any) {
    console.log('Delete', item);
  }

  async exportparaxe() {
    const data = this.listsuivitransport;
    console.log(data);

    const axes = [];
    const heures = [];

    for (const element of data) {
      const axeid = element.axe_id;
      const heureid = element.heuretransport_id;
      axes.push(element.axe_id);
      heures.push(element.heuretransport_id);

      console.log('Axe ID:', axeid);
      console.log('ID Heure Transport:', heureid);
    }

    await this.suiviTransportService.export(this.debut, this.fin, heures, axes);
  }

  async getColor() {
    let matchFound = false;
    //console.log(this.listsuivitransport);

    if (this.listsuivitransport && Array.isArray(this.listsuivitransport)) {
      if (this.allaxe && Array.isArray(this.allaxe)) {
        // Iterate over each element in listsuivitransport
        this.listsuivitransport.forEach((element) => {
          //console.log(element.axe_libelle);
          matchFound = false; // Reset matchFound for each element

          // Check if a match is found with allaxe
          this.allaxe.forEach((axeElement: any) => {
            //console.log(axeElement.axe_libelle);
            if (
              element.axe_libelle == axeElement.axe_libelle &&
              element.heuretransport_heure == axeElement.heuretransport_heure
            ) {
              //console.log('1');
              matchFound = true;
            }
          });

          // If a match was found, check if it is in axequartier
          if (matchFound) {
            let isInAxesQuartier = false;
            this.axequartier.forEach((e: any) => {
              if (
                element.axe_libelle == e.axe_libelle &&
                element.transportuser_quartier == e.quartier_libelle &&
                element.heuretransport_heure == e.heuretransport_heure
              ) {
                isInAxesQuartier = true;
                //console.log(2);
              }
            });

            // Add the color based on the condition
            if (!isInAxesQuartier) {
              //console.log('blue');
              element.color = 'color-blue'; // Set color to 'blue'
            }
          } else {
            //console.log('red');
            element.color = 'color-red'; // Set color to 'red' if no match is found
          }
        });
      } else {
        console.error(
          "La variable allaxe n'est pas un tableau ou est undefined"
        );
      }
    } else {
      console.error(
        "La variable listsuivitransport n'est pas un tableau ou est undefined"
      );
    }

    // Log the updated listsuivitransport array to see the colors added
    //console.log(this.listsuivitransport);
  }

  async exportData() {
    const response: DataItem[] = await this.genericService.get('getHeureAxe');
    console.log(response);

    const dataByHourAndAxe: { [heure: string]: { [axe: string]: any[] } } = {};

    response.forEach((item) => {
      const { heuretransport_heure, axe_libelle, ...otherData } = item;

      if (!dataByHourAndAxe[heuretransport_heure]) {
        dataByHourAndAxe[heuretransport_heure] = {};
      }

      if (!dataByHourAndAxe[heuretransport_heure][axe_libelle]) {
        dataByHourAndAxe[heuretransport_heure][axe_libelle] = [];
      }

      dataByHourAndAxe[heuretransport_heure][axe_libelle].push(otherData);
    });

    const wb = XLSX.utils.book_new();

    for (const [hour, axes] of Object.entries(dataByHourAndAxe)) {
      for (const [axe, data] of Object.entries(axes)) {
        const sanitizedData = data.map((item) => {
          return Object.fromEntries(
            Object.entries(item).map(([key, value]) => {
              return [key, value ?? ''];
            })
          );
        });

        const ws = XLSX.utils.json_to_sheet(sanitizedData);

        let sheetName = `${hour},${axe}`;

        // Nettoyer le nom de la feuille pour les caractères invalides
        const sanitizedSheetName = sheetName
          .replace(/[\/:*?"<>|]/g, '-')
          .slice(0, 31);

        XLSX.utils.book_append_sheet(wb, ws, sanitizedSheetName);
      }
    }

    XLSX.writeFile(wb, 'data_export.xlsx');
  }
}
