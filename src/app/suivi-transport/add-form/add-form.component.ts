import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GenericService } from '../../service/genericservice.service';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-form',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  templateUrl: './add-form.component.html',
  styleUrl: './add-form.component.css',
})
export class AddFormComponent {
  axesList: any;
  filteredAxe: any[] = [];
  heuresList: any;
  quartiersList: any[] = [];
  filteredQuartier: any[] = [];

  nom!: string;
  selectedAxe!: string;
  selectedHeure!: string;
  selectedQuartier!: string;

  @ViewChild('axeInput') axeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('quartierInput') quartierInput!: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<AddFormComponent>,
    private genericservice: GenericService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async ngOnInit() {
    this.quartiersList = await this.genericservice.get('quartiers');

    this.axesList = await this.genericservice.get('axe');
    console.log(this.axesList);

    this.heuresList = await this.genericservice.get('heure');
    console.log(this.heuresList);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close({
      nom: this.nom,
      quartier: this.selectedQuartier,
      axe: this.selectedAxe,
      heure: this.selectedHeure,
    });
  }

  onAxeSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedAxe = event.option.value;
  }

  onQuartierSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedQuartier = event.option.value;
  }

  filterAxe() {
    const filterValue = this.axeInput.nativeElement.value.toLowerCase();
    this.filteredAxe = this.axesList.filter((item: { axe_libelle: string }) =>
      item.axe_libelle.toLowerCase().includes(filterValue)
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

  displayQuartier(quartier: any): string {
    return quartier ? quartier.quartier_libelle : ''; // Adjust based on the structure of the axe object
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
