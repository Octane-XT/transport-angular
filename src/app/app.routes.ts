import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SuiviTransportComponent } from './suivi-transport/suivi-transport.component';
import { AppLayoutComponent } from './layout/app.layout/app.layout.component';
import { AxesComponent } from './axes/axes.component';
import { ReservationComponent } from './reservation/reservation.component';
import { UserreservationComponent } from './reservation/userreservation/userreservation.component';
import { AuthGuard } from './auth.guard';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { LocationTableComponent } from './location-table/location-table.component';
import { ItineraireViewComponent } from './itineraire-view/itineraire-view.component';
import { AxesCrudComponent } from './axes/axes-crud/axes-crud.component';
import { QuartiersCrudComponent } from './quartiers/quartiers-crud/quartiers-crud.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent, // Define login path
  },
  {
    path: 'transport',
    component: AppLayoutComponent,
    canActivate: [AuthGuard], // Protect all transport routes with AuthGuard
    children: [
      {
        path: 'suivi-transport',
        component: SuiviTransportComponent,
      },
      {
        path: 'axes-crud',
        component: AxesCrudComponent,
      },
      {
        path: 'quartiers-crud',
        component: QuartiersCrudComponent,
      },
      {
        path: 'axes',
        component: AxesComponent,
      },
      {
        path: 'reservation',
        component: ReservationComponent,
      },
      {
        path: 'userreservation',
        component: UserreservationComponent,
      },
      {
        path: 'utilisateurs',
        component: UtilisateurComponent,
      },
      {
        path: 'reclamations',
        component: ReclamationComponent,
      },
      {
        path: 'localisation',
        component: LocationTableComponent,
      },
      {
        path: 'itineraire',
        component: ItineraireViewComponent,
      },
    ],
  },
];
