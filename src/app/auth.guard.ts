import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Check if the user is authenticated
    const userId = localStorage.getItem('iduser');
    const userRole = localStorage.getItem('roleuser');

    // If user is not authenticated or role is missing, redirect to login
    if (!userId || !userRole) {
      this.router.navigate(['login']);
      return false; // Prevent navigation to the requested route
    }

    // If authenticated, allow access to the route
    return true;
  }
}
