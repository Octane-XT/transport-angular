import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GenericService } from '../../service/genericservice.service';

@Component({
  selector: 'app-add-axe',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './add-axe.component.html',
  styleUrl: './add-axe.component.css',
})
export class AddAxeComponent {
  // Static list of axes
  axesList: any;
  filteredAxe: any[] = [];

  // Static list of heures (hours)
  heuresList: any;

  // Static list of cars (vehicles)
  carsList: string[] = ['Car 1', 'Car 2', 'Car 3', 'Car 4'];

  // The currently selected axe, heure, and car (passed from the parent)
  selectedAxe!: string;
  selectedHeure!: string;
  selectedCar!: string;

  @ViewChild('axeInput') typeInput!: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<AddAxeComponent>,
    private genericservice: GenericService
  ) {}

  async ngOnInit() {
    this.axesList = await this.genericservice.get('axe');
    console.log(this.axesList);

    this.heuresList = await this.genericservice.get('heure');
    console.log(this.heuresList);
  }

  filterType() {
    const filterValue = this.typeInput.nativeElement.value.toLowerCase();
    this.filteredAxe = this.axesList.filter((item: { axe_libelle: string }) =>
      item.axe_libelle.toLowerCase().includes(filterValue)
    );
  }
  // This will be triggered when an axe is selected in the autocomplete
  onAxeSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedAxe = event.option.value;
  }

  // Close the dialog with the selected axe, heure, and car
  onSave(): void {
    this.dialogRef.close({
      axe: this.selectedAxe,
      heure: this.selectedHeure,
      car: this.selectedCar,
    });
  }

  displayFn(axe: any): string {
    return axe ? axe.axe_libelle : ''; // Adjust based on the structure of the axe object
  }

  // Close the dialog without saving
  onCancel(): void {
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
