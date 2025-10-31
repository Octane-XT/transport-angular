import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { GenericService } from '../../service/genericservice.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../service/notification.service';
@Component({
  selector: 'app-usermodifreservation',
  standalone: true,
  imports: [
    MatIcon,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatCardModule,
    MatOptionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    CommonModule,
  ],
  templateUrl: './usermodifreservation.component.html',
  styleUrl: './usermodifreservation.component.css',
})
export class UsermodifreservationComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private genericService: GenericService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedAxeName = this.data.axe_libelle;
    this.selectedAxeId = this.data.axe_id;
    this.selectedHeureName = this.data.heuretransport_heure;
    this.selectedHeureId = this.data.heuretransport_id;
    this.selectedQuartierName = this.data.transportuser_quartier;
  }

  Listaxe: any[] = [];
  filteredAxe: any[] = [];
  selectedAxe!: any;
  selectedAxeName!: string;
  selectedAxeId!: number;

  Listheure: any[] = [];
  filteredHeure: any[] = [];
  selectedHeure!: any;
  selectedHeureName!: string;
  selectedHeureId!: number;

  quartiersList: any[] = [];
  filteredQuartier: any[] = [];
  selectedQuartier!: any;
  selectedQuartierName!: string;

  @ViewChild('axeInput') typeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('heureInput') heureInput!: ElementRef<HTMLInputElement>;
  @ViewChild('quartierInput') quartierInput!: ElementRef<HTMLInputElement>;

  async ngOnInit() {
    this.Listheure = await this.genericService.get('heure');
    this.Listaxe = await this.genericService.get('axes');
    this.quartiersList = await this.genericService.get('quartiers');

    this.typeInput.nativeElement.value = this.data.axe_libelle;
    this.heureInput.nativeElement.value = this.data.heuretransport_heure;
    this.quartierInput.nativeElement.value = this.data.transportuser_quartier;
    console.log(this.data);
  }

  filterAxe() {
    const filterValue = this.typeInput.nativeElement.value.toLowerCase();
    this.filteredAxe = this.Listaxe.filter((item: { axe_libelle: string }) =>
      item.axe_libelle.toLowerCase().includes(filterValue)
    );
  }

  filterHeure() {
    const filterValue = this.heureInput.nativeElement.value.toLowerCase();
    this.filteredHeure = this.Listheure.filter(
      (item: { heuretransport_heure: string }) =>
        item.heuretransport_heure.toLowerCase().includes(filterValue)
    );
  }

  filterQuartier() {
    const filterValue = this.quartierInput.nativeElement.value.toLowerCase();
    this.filteredQuartier = this.quartiersList.filter(
      (item: { quartier_libelle: string }) =>
        item.quartier_libelle.toLowerCase().includes(filterValue)
    );
  }

  displayAxe(axe: any): string {
    return axe ? axe.axe_libelle : ''; // Adjust based on the structure of the axe object
  }

  displayHeure(heure: any): string {
    return heure ? heure.heuretransport_heure : ''; // Adjust based on the structure of the axe object
  }

  displayQuartier(quartier: any): string {
    return quartier ? quartier.quartier_libelle : ''; // Adjust based on the structure of the axe object
  }

  onAxeSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedAxe = event.option.value;
    this.selectedAxeName = event.option.value.axe_libelle;
    this.selectedAxeId = event.option.value.axe_id;
  }

  onHeureSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedHeure = event.option.value;
    this.selectedHeureName = event.option.value.heuretransport_heure;
    this.selectedHeureId = event.option.value.heuretransport_id;
  }

  onQuartierSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedQuartier = event.option.value;
    this.selectedQuartierName = event.option.value.quartier_libelle;
  }

  async onSave() {
    const data = {
      transportuser_axe: this.selectedAxeId,
      transportuser_heure: this.selectedHeureId,
      transportuser_quartier: this.selectedQuartierName,
    };
    const id = this.data.transportuser_id;
    console.log(data);
    try {
      await this.genericService.update('user/byuser', id, data);
      this.notificationService.showSuccess('Réservation modifiée');
      this.closeDialog();
    } catch (error) {
      this.notificationService.showError('Erreur lors de la modification');
    }
    this.closeDialog();
  }

  onCancel() {
    this.closeDialog();
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
