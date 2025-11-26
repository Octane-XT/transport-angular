import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GenericService {
  private url = 'http://localhost:3000/transport';
  constructor() {}

  async get(path: string) {
    try {
      const response = await fetch(`${this.url}/${path}`, {
        method: 'GET',
        headers: {
          //Authorization: 'Bearer ' + this.jwtservice.getToken() || '',
        },
      });
      const data = await response.json();

      return data;
    } catch (error) {}
  }

  async getById(path: string, id?: number) {
    try {
      const response = await fetch(`${this.url}/${path}/${id}`, {
        method: 'GET',
        headers: {
          //Authorization: 'Bearer ' + this.jwtservice.getToken() || '',
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {}
  }

  async getByUser(path: string, id: number, idHeure: number, idaxe: number) {
    try {
      const response = await fetch(
        `${this.url}/${path}/${id}/${idHeure}/${idaxe}`,
        {
          method: 'GET',
          headers: {
            //Authorization: 'Bearer ' + this.jwtservice.getToken() || '',
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {}
  }

  async getAgentCampagne(
    path: string,
    id: number,
    usercampagne: number,
    rolepoids: number
  ) {
    try {
      const response = await fetch(
        `${this.url}/${path}?current_id=${id}&usercampagne=${usercampagne}&poids=${rolepoids}`,
        {
          method: 'GET',
          headers: {
            //Authorization: 'Bearer ' + this.jwtservice.getToken() || '',
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {}
  }

  async post(path: string, body: any) {
    try {
      const response = await fetch(`${this.url}/${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          //Authorization: 'Bearer ' + this.jwtservice.getToken() || '',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Erreur HTTP ${response.status}: ${
            errorData.message || 'Erreur inconnue'
          }`
        );
      }
      return await response.json();
    } catch (error) {
      console.error(`Erreur dans post (${path}):`, error);
      throw error;
    }
  }

  async update(path: string, id: number, body: any) {
    try {
      const response = await fetch(`${this.url}/${path}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          //Authorization: 'Bearer ' + this.jwtservice.getToken() || '',
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
    } catch (error) {}
  }

  async delete(path: string, id: number) {
    try {
      const response = await fetch(`${this.url}/${path}/${id}`, {
        method: 'DELETE',
        headers: {
          // Si vous avez un token, vous pouvez le passer ici
          // Authorization: 'Bearer ' + this.jwtservice.getToken() || '',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur dans la méthode DELETE:', error);
      throw error;
    }
  }
}
