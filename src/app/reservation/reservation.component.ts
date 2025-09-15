import {
  CommonModule,
  DatePipe,
  JsonPipe,
  registerLocaleData,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  LOCALE_ID,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatOptionModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GenericService } from '../service/genericservice.service';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../service/notification.service';
import { Location } from '@angular/common';
import * as fr from '@angular/common/locales/fr';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    CommonModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
  providers: [
    provideNativeDateAdapter(),
    DatePipe,
    { provide: LOCALE_ID, useValue: 'fr-FR' },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ReservationComponent {
  range!: FormGroup;

  axesList: any;
  filteredAxe: any[] = [];
  heuresList: any;
  quartiersList: any[] = [];
  filteredQuartier: any[] = [];
  UserId = localStorage.getItem('iduser');
  // List to hold the generated inputs for each date
  dateInputs: {
    date: Date;
    heure: string;
    quartier: string;
    axe: string;
    heureControl: FormControl;
    quartierControl: FormControl;
    axeControl: FormControl;
  }[] = [];

  @ViewChildren('axeInput') axeInputs!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('quartierInput') quartierInputs!: QueryList<
    ElementRef<HTMLInputElement>
  >;
  UserReservation: any;
  date: string;
  minDate: Date = new Date();

  myquartier: any;

  constructor(
    private genericservice: GenericService,
    private datePipe: DatePipe,
    private router: Router,
    private notificationService: NotificationService,
    private locationService: Location,
  ) {
    registerLocaleData(fr.default);
    this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
  }

  
  async ngOnInit() {
  try {
    const userId = Number(localStorage.getItem('iduser'));
    if (!userId || isNaN(userId)) {
      console.error('ID utilisateur non défini ou invalide');
      this.UserReservation = [];
      this.myquartier = null;
      this.notificationService.showError('Veuillez vous connecter pour accéder à cette fonctionnalité');
      return;
    }

    const myquartierdata = await this.genericservice.getById('my-quartier', userId);
    if (Array.isArray(myquartierdata) && myquartierdata[0]?.quartier_id !== undefined) {
      this.myquartier = myquartierdata[0].quartier_id;
    } else {
      console.warn('quartier_id non défini ou données absentes :', myquartierdata);
      this.myquartier = null;
    }

    this.quartierInputSubject
      .pipe(debounceTime(300))
      .subscribe(({ index, value }) => {
        this.filteredQuartier = (this.quartiersList || []).filter(
          (item: { quartier_libelle: string }) =>
            item.quartier_libelle?.toLowerCase().includes(value.toLowerCase())
        );
      });

    this.range = new FormGroup({
      start: new FormControl(null, Validators.required),
      end: new FormControl(null, Validators.required),
    });

    this.quartiersList = (await this.genericservice.get('quartiers')) || [];
    this.axesList = (await this.genericservice.get('axes')) || [];
    this.heuresList = (await this.genericservice.get('heure')) || [];

    const reservationResponse = await this.genericservice.getById('axetransportday', userId);
    this.UserReservation = Array.isArray(reservationResponse) ? reservationResponse : [];
    console.log('UserReservation:', this.UserReservation);

    this.getdateheure();

  } catch (error) {
    console.error('Erreur lors de l’initialisation du composant :', error);
    this.UserReservation = [];
    this.notificationService.showError('Erreur lors de l’initialisation du composant');
  }
}

  getdateheure() {
    console.log(this.UserReservation);
    this.UserReservation.forEach((element: any) => {
      const heure = element.heuretransport_heure;
      let date = element.transportuser_date;
      console.log(new Date(date));
    });
  }	

  // Method to create date inputs dynamically
  generateDateInputs() {
    if (this.range.valid) {
      const startDate = this.range.value.start!;
      const endDate = this.range.value.end!;

      // Initialize the array to hold input controls
      this.dateInputs = [];

      let currentDate = new Date(startDate);
      // Convert all UserReservation dates to just dates (no time)
      const reservationDates = this.UserReservation.map((element: any) => {
        const dateRes = new Date(element.transportuser_date);
        // Remove time by setting hours, minutes, seconds, and milliseconds to 0
        dateRes.setHours(0, 0, 0, 0);
        return dateRes;
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to midnight to ignore time comparison

      while (currentDate <= endDate) {
        // Remove time from currentDate for comparison
        const currentDateNoTime = new Date(currentDate);
        currentDateNoTime.setHours(0, 0, 0, 0);

        // Skip if the current date is before today, is Sunday (getDay() === 0),
        // or if it's in reservationDates
        if (
          currentDateNoTime >= today && // Only include dates from today onwards
          currentDate.getDay() !== 0 && // Skip Sundays
          !reservationDates.some(
            (resDate: { getTime: () => number }) =>
              resDate.getTime() === currentDateNoTime.getTime()
          )
        ) {
          const heureControl = new FormControl('', Validators.required);
          const quartierControl = new FormControl('', Validators.required);
          const axeControl = new FormControl('', Validators.required);
          console.log(new Date(currentDate));

          this.dateInputs.push({
            date: new Date(currentDate),
            heure: '', // Initialize as empty
            quartier: '', // Initialize as empty
            axe: '', // Initialize as empty
            heureControl,
            quartierControl,
            axeControl,
          });
        }

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  }

  // Handling selection of 'axe'
  onAxeSelected(event: MatAutocompleteSelectedEvent, index: number): void {
    // Get the selected axe object
    const selectedAxe = event.option.value;

    // Set the axe value
    this.dateInputs[index].axe = selectedAxe;

    // Assuming that 'axe' contains a property that links it to a time (e.g., heuretransport_heure)
    // You need to set the heure for that specific axe.
    const associatedHeure = this.heuresList.find((heure: any) => {
      // Here, adjust the matching condition based on your data structure
      return heure.heuretransport_id === selectedAxe.heuretransport_id; // For example, if axe has an id and hours are linked to it
    });

    // If an associated heure is found, set the heure value for that dateInput
    if (associatedHeure) {
      this.dateInputs[index].heure = associatedHeure; // Set heure based on the selected axe
    } else {
      // If no associated heure is found, you can set it to empty or default value
      this.dateInputs[index].heure = '';
    }

    // Now, set the quartier based on the selected axe
    const associatedQuartier = this.quartiersList.find((quartier: any) => {
      return quartier.quartier_id === selectedAxe.quartier_id; // Assuming the relation between axe and quartier
    });

    // If an associated quartier is found, set the quartier value for that dateInput
    if (associatedQuartier) {
      this.dateInputs[index].quartier = associatedQuartier;
    } else {
      this.dateInputs[index].quartier = ''; // Set to empty if no associated quartier
    }
  }

  // Handling selection of 'quartier'
  onQuartierSelected(event: MatAutocompleteSelectedEvent, index: number): void {
    this.dateInputs[index].quartier = event.option.value;
  }

  // Filter the list of 'axes' based on user input
  filterAxe(index: number) {
  const filterValue = this.axeInputs.get(index)?.nativeElement.value.toLowerCase() || '';
  console.log('axesList avant filtrage:', this.axesList);
  if (!this.axesList || !Array.isArray(this.axesList)) {
    console.warn('axesList est vide ou non défini');
    this.filteredAxe = [];
    return;
  }
  this.filteredAxe = this.axesList.filter(
    (item: { axe_libelle?: string; axe?: string }) =>
      (item.axe_libelle || item.axe)?.toLowerCase().includes(filterValue) ?? false
  );
  console.log('filteredAxe après filtrage:', this.filteredAxe);
}

  private quartierInputSubject = new Subject<{
    index: number;
    value: string;
  }>();

  filterQuartier(index: number) {
    const inputValue =
      this.quartierInputs.get(index)?.nativeElement.value || '';
    this.quartierInputSubject.next({ index, value: inputValue });
  }

  // Display the 'axe' label
  displayAxe(axe: any): string {
    return axe ? axe.heuretransport_heure + ' - ' + axe.axe_libelle : '';
  }

  // Display the 'quartier' label
  displayQuartier(quartier: any): string {
    return quartier ? quartier.quartier_libelle : '';
  }

  removeDateInput(index: number): void {
    this.dateInputs.splice(index, 1); // Removes the input at the specified index
  }

  // Method to validate and log reservation values
  async validateReservation() {
  // Vérifier que tous les FormControls sont valides
  const invalidInputs = this.dateInputs.filter(
    (input) =>
      input.heureControl.invalid ||
      input.quartierControl.invalid ||
      input.axeControl.invalid
  );
  if (invalidInputs.length > 0) {
    this.notificationService.showError('Veuillez remplir tous les champs requis');
    return;
  }

  // Construire les données de réservation
  const reservationDetails = {
    dateRange: this.range.value,
    reservations: this.dateInputs.map((input) => ({
      date: this.datePipe.transform(input.date, 'yyyy-MM-dd'),
      heure: { heuretransport_id: input.heureControl.value },
      quartier: { quartier_libelle: input.quartierControl.value },
      // axe: { axe_id: input.axeControl.value },
    })),
    transportuser_user: Number(localStorage.getItem('iduser')),
  };
  console.log('Données envoyées:', reservationDetails);

  try {
    await this.genericservice.post('transport/adduser', reservationDetails);
    this.notificationService.showSuccess('Réservation enregistrée');
    this.router.navigate(['./transport/userreservation']);
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la réservation:', error);
    this.notificationService.showError('Erreur lors de l\'enregistrement de la réservation');
  }
}
}
