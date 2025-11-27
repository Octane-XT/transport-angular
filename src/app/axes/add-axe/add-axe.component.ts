import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
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
  // List of axes and heures
  axesList: any[] = [];
  filteredAxe: any[] = [];
  heuresList: any[] = [];

  // Selected values (objects for axe & heure)
  selectedAxe: any = null;
  selectedHeure: any = null;
  selectedCar: string = '';

  // Flag to know if we are editing
  isEditMode = false;

  @ViewChild('axeInput') typeInput!: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<AddAxeComponent>,
    private genericservice: GenericService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // Load data when component initializes
  async ngOnInit() {
    try {
      const axesResponse = await this.genericservice.get('axes');
      this.axesList = Array.isArray(axesResponse.data) ? axesResponse.data : [];
      this.filteredAxe = this.axesList; // show all by default

      this.heuresList = await this.genericservice.get('heure');

      // ----- EDIT MODE -----
      if (this.data && this.data.mode === 'edit') {
        console.log(this.data);
        
        this.isEditMode = true;

        // Pre-select axe
        if (this.data.axeId) {
          this.selectedAxe = this.axesList.find(
            (a: any) => a.axe_id === this.data.axeId
          );
        }

        // Pre-select heure
        if (this.data.heureId) {
          this.selectedHeure = this.heuresList.find(
            (h: any) => h.heuretransport_id === this.data.heureId
          );
        }

        this.selectedCar = this.data.car || '';
      }

      console.log('Axes:', this.axesList);
      console.log('Heures:', this.heuresList);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Filter axes for autocomplete
  filterType() {
    const filterValue = this.typeInput.nativeElement.value.toLowerCase().trim();

    if (!Array.isArray(this.axesList)) {
      this.filteredAxe = [];
      return;
    }

    if (!filterValue) {
      this.filteredAxe = this.axesList;
      return;
    }

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
    if (!this.selectedAxe || !this.selectedHeure || !this.selectedCar) {
      // You can add better validation / notification here if you want
      this.dialogRef.close();
      return;
    }

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
