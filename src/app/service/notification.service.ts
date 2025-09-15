import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifBarComponent } from '../components/notif-bar/notif-bar.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  // Use a BehaviorSubject to keep track of the notification count
  private notificationCountSubject = new BehaviorSubject<number>(0);

  // Observable that components can subscribe to
  notificationCount$ = this.notificationCountSubject.asObservable();

  // Example to simulate auto-update (polling)
  private pollInterval: any;
  private notificationCount: number = 0;

  constructor(private snackBar: MatSnackBar) {
    this.startPolling();
  }

  // Simulate updating the notification count with polling
  private startPolling() {
    this.pollInterval = setInterval(() => {
      // Simulate receiving new notifications (e.g., from an API or WebSocket)
      this.notificationCount = this.getNotificationCount();
      this.notificationCountSubject.next(this.notificationCount); // Emit the new count
    }, 1000); // Update every 5 seconds (adjust this value as needed)
  }

  // Stop polling (useful for cleanup if the service is destroyed)
  stopPolling() {
    clearInterval(this.pollInterval);
  }

  // Method to update the notification count
  updateNotificationCount(count: number): void {
    this.notificationCountSubject.next(count);
  }

  // Method to get the current notification count
  getNotificationCount(): number {
    return this.notificationCountSubject.value;
  }

  showSuccess(message: string) {
    this.snackBar.openFromComponent(NotifBarComponent, {
      data: { message: message },
      duration: 5000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  showError(message: string) {
    this.snackBar.openFromComponent(NotifBarComponent, {
      data: { message: message },
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  showInfo(message: string) {
    this.snackBar.openFromComponent(NotifBarComponent, {
      data: { message: message },
      duration: 5000,
      panelClass: ['info-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  showMessageError(message: string) {
    this.snackBar.openFromComponent(NotifBarComponent, {
      data: { message: message },
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
