import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SuiviTransportService {
  private url = 'http://192.168.0.176:3000/transport/suivi';
  private urlFiltre = 'http://192.168.0.176:3000/transport/suiviFiltre';
  private urlexport = 'http://192.168.0.176:3000/transport/exportdata';

  constructor() {}

  async get(debut: string, fin: string) {
    try {
      const params = new URLSearchParams({
        debut: debut,
        fin: fin,
      });

      const response = await fetch(`${this.url}?${params.toString()}`, {
        method: 'GET',
        headers: {
          // Vous pouvez ajouter des en-têtes comme l'Authorization si nécessaire
          // Authorization: 'Bearer ' + this.jwtservice.getToken() || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error during the fetch operation:', error);
      throw error;
    }
  }

  async export(debut: string, fin: string, heure: any, axe: any) {
    try {
      const params = new URLSearchParams({
        debut: debut,
        fin: fin,
        heure,
        axe,
      });

      const response = await fetch(`${this.urlexport}?${params.toString()}`, {
        method: 'GET',
        headers: {
          // Vous pouvez ajouter des en-têtes comme l'Authorization si nécessaire
          // Authorization: 'Bearer ' + this.jwtservice.getToken() || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const blob = await response.blob();

      const fileURL = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = fileURL;
      a.download = 'export.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error during the fetch operation:', error);
      throw error;
    }
  }

  async getfiltre(debut: string, fin: string, heure: string, axe: string) {
    try {
      const params = new URLSearchParams({
        debut: debut,
        fin: fin,
        heure: heure,
        axe: axe,
      });

      const response = await fetch(`${this.urlFiltre}?${params.toString()}`, {
        method: 'GET',
        headers: {
          // Vous pouvez ajouter des en-têtes comme l'Authorization si nécessaire
          // Authorization: 'Bearer ' + this.jwtservice.getToken() || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error during the fetch operation:', error);
      throw error;
    }
  }

  async insertAssignQuartierAxe(
    id: number,
    selectedQuartiers: string[]
  ): Promise<any> {
    const url = `http://192.168.0.176:3000/transport/insert-assign-quartier-axe/${id}`;
    const data = selectedQuartiers;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send data');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error during the fetch operation:', error);
      throw error;
    }
  }
}
