import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { GenericService } from '../../service/genericservice.service';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-myquartier',
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
  templateUrl: './edit-quartier.component.html',
  styleUrl: './edit-quartier.component.css',
})
export class EditQuartierComponent {
  myquartier: any;

  quartiersList: any[] = [];
  filteredQuartier: any[] = [];
  selectedQuartier!: any;
  selectedQuartierName!: string;

  @ViewChild('quartierInput') quartierInput!: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<EditQuartierComponent>,
    private genericService: GenericService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async ngOnInit() {
  console.log(this.data);

  const res = await this.genericService.get('quartiers');

  // extract the array from res.data
  this.quartiersList = Array.isArray(res?.data) ? res.data : [];

  // show full list by default
  this.filteredQuartier = [...this.quartiersList];

  // (optional) if you want to pre-select current quartier from this.data
  if (this.data?.quartier_id) {
    const current = this.quartiersList.find(
      (q: any) => q.quartier_id === this.data.quartier_id
    );
    if (current) {
      this.selectedQuartier = current;
    }
  }
}

  onCancel(): void {
    this.dialogRef.close();
  }

  async onSave() {
  if (!this.selectedQuartier || this.selectedQuartier.quartier_id == null) {
    this.notificationService.showError('Aucun quartier sélectionné.');
    return;
  }

  const data = {
    quartier_id: this.selectedQuartier.quartier_id,
  };

  try {
    await this.genericService
      .update('utilisateurs/quartier', this.data.usr_id, data)
      .then(async (response) => {
        if (response.success) {
          this.notificationService.showSuccess(
            'Votre quartier a bien été défini'
          );
          window.location.reload();
        } else {
          this.notificationService.showError(
            'Erreur lors de la définition du quartier'
          );
        }
        this.dialogRef.close();
      });
  } catch (error) {
    this.notificationService.showError(
      'Erreur lors de la définition du quartier'
    );
  }
}



  onQuartierSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedQuartier = event.option.value;
  }

  filterQuartier() {
  const value = this.quartierInput?.nativeElement.value || '';
  const filterValue = value.toLowerCase();

  if (!Array.isArray(this.quartiersList)) {
    this.filteredQuartier = [];
    return;
  }

  if (!filterValue) {
    // if search box is empty, show all quartiers
    this.filteredQuartier = [...this.quartiersList];
    return;
  }

  this.filteredQuartier = this.quartiersList.filter(
    (item: { quartier_libelle: string }) =>
      item.quartier_libelle.toLowerCase().includes(filterValue)
  );
}


  displayQuartier(quartier: any): string {
  if (!quartier) return '';
  if (typeof quartier === 'string') return quartier;
  return quartier.quartier_libelle ?? '';
}


  closeDialog(): void {
    this.dialogRef.close();
  }
}
