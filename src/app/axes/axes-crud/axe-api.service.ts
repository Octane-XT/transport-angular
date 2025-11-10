// src/app/services/axe-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Axe } from './axe.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AxeApiService {
  private readonly base = 'http://localhost:3000/transport/axes';

  constructor(private http: HttpClient) {}

  private unwrap<T>() {
    return map((res: any) => (res?.data ?? res) as T);
  }

  getAll(): Observable<Axe[]> {
    return this.http.get(`${this.base}`).pipe(this.unwrap<Axe[]>());
  }

  getArchived(): Observable<Axe[]> {
    return this.http.get(`${this.base}/archives`).pipe(this.unwrap<Axe[]>());
  }

  getById(id: number): Observable<Axe> {
    return this.http.get(`${this.base}/${id}`).pipe(this.unwrap<Axe>());
  }

  create(axe_libelle: string): Observable<Axe> {
    return this.http
      .post(`${this.base}`, { axe_libelle })
      .pipe(this.unwrap<Axe>());
  }

  update(id: number, axe_libelle: string): Observable<Axe> {
    // controller accepts PUT or PATCH (same handler)
    return this.http
      .put(`${this.base}/${id}`, { axe_libelle })
      .pipe(this.unwrap<Axe>());
  }

  softDelete(id: number): Observable<Axe> {
    return this.http.delete(`${this.base}/${id}`).pipe(this.unwrap<Axe>());
  }

  restore(id: number): Observable<Axe> {
    return this.http
      .put(`${this.base}/${id}/restaurer`, {})
      .pipe(this.unwrap<Axe>());
  }
}
