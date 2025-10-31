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
  templateUrl: './add-form-user.component.html',
  styleUrl: './add-form-user.component.css',
})
export class AddFormUserComponent {
  userList: any;
  filteredUser: any[] = [];
  axesList: any;
  filteredAxe: any[] = [];
  heuresList: any;
  quartiersList: any[] = [];
  filteredQuartier: any[] = [];

  selectedUser!: string;
  selectedAxe!: string;
  selectedHeure!: string;
  selectedQuartier!: string;

  @ViewChild('userInput') userInput!: ElementRef<HTMLInputElement>;
  @ViewChild('axeInput') axeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('quartierInput') quartierInput!: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<AddFormUserComponent>,
    private genericservice: GenericService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async ngOnInit() {
    const rolepoids = localStorage.getItem('rolepoids');
    const iduser = localStorage.getItem('iduser');
    const usercampagne = localStorage.getItem('usercampagne');
    if (Number(rolepoids) >= 3 && Number(usercampagne) != 0) {
      this.userList = await this.genericservice.getAgentCampagne(
        'getAllAgentUser',
        Number(iduser),
        Number(usercampagne),
        Number(rolepoids)
      );
    }
    console.log(this.userList);

    this.quartiersList = await this.genericservice.get('quartiers');

    this.axesList = await this.genericservice.get('axes');
    console.log(this.axesList);

    this.heuresList = await this.genericservice.get('heure');
    console.log(this.heuresList);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close({
      user: this.selectedUser,
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

  onUserSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedUser = event.option.value;
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

  filterUser() {
    const filterValue = this.userInput.nativeElement.value.toLowerCase();
    this.filteredUser = this.userList.filter(
      (item: {
        usr_initiale: string;
        usr_matricule: string;
        usr_nom: string;
        usr_prenom: string;
      }) =>
        item.usr_initiale.toLowerCase().includes(filterValue) ||
        item.usr_matricule.toLowerCase().includes(filterValue) ||
        item.usr_nom.toLowerCase().includes(filterValue) ||
        item.usr_prenom.toLowerCase().includes(filterValue)
    );
  }

  displayAxe(axe: any): string {
    return axe ? axe.axe_libelle : ''; // Adjust based on the structure of the axe object
  }

  displayQuartier(quartier: any): string {
    return quartier ? quartier.quartier_libelle : ''; // Adjust based on the structure of the axe object
  }

  displayUser(user: any): string {
    return user ? user.usr_nom + ' ' + user.usr_prenom : ''; // Adjust based on the structure of the axe object
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
