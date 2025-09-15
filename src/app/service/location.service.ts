import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Location {
  loc_descente: string;
  id: number;
  usr_id: number;
  usr_nom: string;
  usr_prenom: string;
  axe: string;
  axe_id: number;
  date: string;
  heure_montee: string;
  heure_descente: string;
  usr_matricule: string;
  usr_initiale: string;
}

export interface Itinerary {
  date: string;
  axe: string;
  heure_montee: string;
  mapsUrl: string | null;
  duree_trajet: string;
}

// Interface pour Axe
export interface Axe {
  axe_id: number;
  axe_libelle: string;
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private apiUrl = 'http://localhost:3000/locations';

  constructor(private http: HttpClient) {}

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.apiUrl);
  }

  getAxes(): Observable<Axe[]> {
    return this.http.get<Location[]>(this.apiUrl).pipe(
      map((locations: Location[]) => {
        // Extraire les axes uniques à partir des localisations
        const uniqueAxes = Array.from(
          new Map(
            locations.map((loc) => [loc.axe_id, { axe_id: loc.axe_id, axe_libelle: loc.axe }])
          ).values()
        );
        return uniqueAxes;
      })
    );
  }

  getAvailableAxes(): Observable<Axe[]> {
    return this.http.get<Location[]>(this.apiUrl).pipe(
      map((locations: Location[]) => {
        const uniqueAxes = Array.from(
          new Map(
            locations.map((loc) => [loc.axe_id, { axe_id: loc.axe_id, axe_libelle: loc.axe }])
          ).values()
        );
        return uniqueAxes;
      })
    );
  }

  getAvailableHeures(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/heures`);
  }

  getBusRouteUrl(axe_id: string, heure: string, date: string): Observable<Itinerary[]> {
    const params = { axe_id, heure, date };
    return this.http.get<Itinerary[]>(`${this.apiUrl}/bus-route`, { params });
  }

  getAllBusRoutes(): Observable<Itinerary[]> {
    return this.http.get<Itinerary[]>(`${this.apiUrl}/all-routes`);
  }

}