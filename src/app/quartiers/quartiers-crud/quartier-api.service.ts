import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Quartier } from './quartier.model';

@Injectable({ providedIn: 'root' })
export class QuartierApiService {
  private readonly base = 'http://localhost:3000/transport/quartiers';

  constructor(private http: HttpClient) {}

  private unwrap<T>() {
    return map((res: any) => (res?.data ?? res) as T);
  }

  getAll(): Observable<Quartier[]> {
    return this.http.get(`${this.base}`).pipe(this.unwrap<Quartier[]>());
  }

  getArchived(): Observable<Quartier[]> {
    return this.http
      .get(`${this.base}/archives`)
      .pipe(this.unwrap<Quartier[]>());
  }

  getById(id: number): Observable<Quartier> {
    return this.http.get(`${this.base}/${id}`).pipe(this.unwrap<Quartier>());
  }

  create(quartier_libelle: string | null): Observable<Quartier> {
    return this.http
      .post(`${this.base}`, { quartier_libelle })
      .pipe(this.unwrap<Quartier>());
  }

  update(id: number, quartier_libelle: string | null): Observable<Quartier> {
    return this.http
      .put(`${this.base}/${id}`, { quartier_libelle })
      .pipe(this.unwrap<Quartier>());
  }

  softDelete(id: number): Observable<Quartier> {
    return this.http.delete(`${this.base}/${id}`).pipe(this.unwrap<Quartier>());
  }

  restore(id: number): Observable<Quartier> {
    return this.http
      .put(`${this.base}/${id}/restaurer`, {})
      .pipe(this.unwrap<Quartier>());
  }
}
