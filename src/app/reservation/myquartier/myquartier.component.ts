import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { GenericService } from '../../service/genericservice.service';
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
    MatInputModule,
    MatAutocompleteModule,
  ],
  templateUrl: './myquartier.component.html',
  styleUrl: './myquartier.component.css',
})
export class MyquartierComponent {
  myquartier: any;

  quartiersList: any[] = [];
  filteredQuartier: any[] = [];
  selectedQuartier!: any;
  selectedQuartierName!: string;

  @ViewChild('quartierInput') quartierInput!: ElementRef<HTMLInputElement>;

  constructor(
    private genericService: GenericService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    try {
      const userId = Number(localStorage.getItem('iduser'));
      const myquartierdata = await this.genericService.getById(
        'my-quartier',
        userId
      );

      if (
        Array.isArray(myquartierdata) &&
        myquartierdata.length > 0 &&
        myquartierdata[0]
      ) {
        this.myquartier = myquartierdata[0];
      } else {
        console.warn(
          'Aucun quartier trouvé pour l’utilisateur :',
          myquartierdata
        );
        this.myquartier = null;

        const res = await this.genericService.get('quartiers');
        console.log("res",res);
        // IMPORTANT: use res.data, not res
        this.quartiersList = Array.isArray(res?.data) ? res.data : [];
        console.log("qq",this.quartiersList);
        
        this.filteredQuartier = [...this.quartiersList]; // show all by default
      }

      console.log('Quartier récupéré :', this.myquartier);
    } catch (error) {
      console.error('Erreur lors de la récupération du quartier :', error);
      this.myquartier = null;
      this.quartiersList = [];
      this.filteredQuartier = [];
    }
  }

  async onSave() {
    const selected = this.selectedQuartier;

    if (!selected || selected.quartier_id === undefined) {
      this.notificationService.showError('Aucun quartier sélectionné.');
      return;
    }

    const data = {
      usr_id: Number(localStorage.getItem('iduser')),
      quartier_id: selected.quartier_id,
    };

    try {
      const response = await this.genericService.post('my-quartier', data);

      if (response?.success) {
        this.notificationService.showSuccess(
          'Votre quartier a bien été défini'
        );
        window.location.reload();
      } else {
        this.notificationService.showError(
          response?.error ?? 'Erreur lors de la définition du quartier'
        );
      }
    } catch (error) {
      console.error('Erreur lors du post vers my-quartier :', error);
      this.notificationService.showError(
        'Échec de l’enregistrement du quartier'
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
    // If input is empty, show all quartiers
    this.filteredQuartier = [...this.quartiersList];
    return;
  }

  this.filteredQuartier = this.quartiersList.filter(
    (item: { quartier_libelle: string }) =>
      item.quartier_libelle.toLowerCase().includes(filterValue)
  );
}


  displayQuartier(quartier: any): string {
    return quartier ? quartier.quartier_libelle : ''; // Adjust based on the structure of the axe object
  }
}
