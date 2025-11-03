import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
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
  // List of axes, heures, and cars
  axesList: any[] = [];
  filteredAxe: any[] = [];
  heuresList: any[] = [];

  // Static list of cars (can be dynamic if needed)
  carsList: string[] = ['Car 1', 'Car 2', 'Car 3', 'Car 4'];

  // Selected values
  selectedAxe!: string;
  selectedHeure!: string;
  selectedCar!: string;

  @ViewChild('axeInput') typeInput!: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<AddAxeComponent>,
    private genericservice: GenericService
  ) {}

  // Load data when component initializes
  async ngOnInit() {
    try {
      // ✅ Extract actual arrays from API responses
      const axesResponse = await this.genericservice.get('axes');
      this.axesList = Array.isArray(axesResponse.data) ? axesResponse.data : [];

      this.heuresList = await this.genericservice.get('heure');
      console.log(this.heuresList);

      console.log('Axes:', this.axesList);
      console.log('Heures:', this.heuresList);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Filter axes for autocomplete
  filterType() {
    const filterValue = this.typeInput.nativeElement.value.toLowerCase();
    if (!Array.isArray(this.axesList)) return;

    this.filteredAxe = this.axesList.filter((item: { axe_libelle: string }) =>
      item.axe_libelle.toLowerCase().includes(filterValue)
    );
  }

  // Triggered when an axe is selected
  onAxeSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedAxe = event.option.value;
  }

  // Display axe name in the autocomplete
  displayFn(axe: any): string {
    return axe ? axe.axe_libelle : '';
  }

  // Save and close the dialog
  onSave(): void {
    this.dialogRef.close({
      axe: this.selectedAxe,
      heure: this.selectedHeure,
      car: this.selectedCar,
    });
  }

  // Close without saving
  onCancel(): void {
    this.dialogRef.close();
  }

  // Explicit close button handler
  closeDialog(): void {
    this.dialogRef.close();
  }
}
