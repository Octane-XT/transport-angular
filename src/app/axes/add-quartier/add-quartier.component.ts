import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
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
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { GenericService } from '../../service/genericservice.service';
import { Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { SuiviTransportService } from '../../suivi-transport/suivi-transport.service';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-add-quartier',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatChipsModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './add-quartier.component.html',
  styleUrls: ['./add-quartier.component.css'],
})
export class AddQuartierComponent {
  // List of quartiers as objects {quartier_id, quartier_libelle}
  quartiersList: any[] = [];

  // Initially selected quartiers as objects
  selectedQuartiers: any[] = [];

  // For the current quartier being typed
  currentQuartier: string = '';

  // Keys that separate chips (Enter and comma)
  separatorKeysCodes: number[] = [13, 188];

  constructor(
    public dialogRef: MatDialogRef<AddQuartierComponent>,
    private genericservice: GenericService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private suiviTransportService: SuiviTransportService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    // Fetch quartiers from the service
    this.quartiersList = await this.genericservice.get('quartiers');
    console.log(this.data);
    this.selectedQuartiers = this.data.listquartieraxe;
    if (!this.selectedQuartiers) {
      this.selectedQuartiers = [];
    }
  }

  // Add quartier to the chip list
  addQuartier(event: any): void {
    const value = this.currentQuartier.trim();

    // If a valid quartier was typed and exists in the list, and is not already in selectedQuartiers
    if (
      value &&
      this.quartiersList.some(
        (q) => q.quartier_libelle.toLowerCase() === value.toLowerCase()
      ) &&
      !this.selectedQuartiers.some(
        (q) => q.quartier_libelle.toLowerCase() === value.toLowerCase()
      )
    ) {
      // Find the corresponding quartier object
      const selectedQuartier = this.quartiersList.find(
        (q) => q.quartier_libelle.toLowerCase() === value.toLowerCase()
      );

      if (selectedQuartier) {
        this.selectedQuartiers.push(selectedQuartier);
        this.currentQuartier = ''; // Reset input after adding
      }
    }
  }

  // Remove quartier from the chip list
  removeQuartier(quartier: any): void {
    const index = this.selectedQuartiers.indexOf(quartier);
    if (index >= 0) {
      this.selectedQuartiers.splice(index, 1);
    }
  }

  // When a quartier is selected from the autocomplete
  onQuartierSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedQuartier = event.option.value; // Get the selected quartier object
    this.selectedQuartiers.push(selectedQuartier); // Add the selected quartier object to the list
    this.currentQuartier = ''; // Reset input field
  }

  filteredQuartiers() {
    const filterValue = this.currentQuartier.toLowerCase();
    return this.quartiersList.filter(
      (f) =>
        f.quartier_libelle.toLowerCase().includes(filterValue) &&
        !this.selectedQuartiers.includes(f) // Exclude already selected fournisseurs
    );
  }

  // Save the selected quartiers and close the dialog
  // Composant Angular
  async onSave(): Promise<void> {
    const ids = this.selectedQuartiers.map((q) => q.quartier_id);
    const Hid = this.data.HeureaxeId;
    console.log(ids);
    console.log(Hid);

    try {
      const response = this.suiviTransportService.insertAssignQuartierAxe(
        Hid,
        ids
      );
      this.notificationService.showSuccess('Ajout quatier effectué');
      // Fermer le dialogue ou afficher un message de succès si nécessaire
      this.dialogRef.close(response);
    } catch (error) {
      this.notificationService.showError('Erreur lors de l ajout quatier');
    }
  }

  // Cancel the operation and close the dialog
  onCancel(): void {
    this.dialogRef.close();
  }

  // Close the dialog without saving
  closeDialog(): void {
    this.dialogRef.close();
  }
}
