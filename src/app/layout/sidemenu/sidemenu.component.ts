import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationService } from '../../service/notification.service'; // Import the service
import { GenericService } from '../../service/genericservice.service';

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    CommonModule,
    RouterModule,
    RouterLink,
    MatToolbarModule,
    MatListModule,
    MatBadgeModule,
  ],
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css'],
})
export class SidemenuComponent implements OnInit {
  @Input() close: boolean = false;
  @Output() changeEtat: EventEmitter<void> = new EventEmitter<void>();

  notificationCount: number = 0; // Variable to hold the notification count

  private menuItems = [
    {
      category: 'Transport',
      icon: 'local_taxi',
      items: [
        {
          label: 'Reservation',
          routerLink: ['./reservation'],
          roles: [],
        },
        {
          label: 'Mes reservations',
          routerLink: ['./userreservation'],
          roles: [],
        },
        {
          label: 'Suivis des transports',
          routerLink: ['./suivi-transport'],
          roles: ['Admin'],
        },
        {
          label: 'Gestion des axes',
          routerLink: ['./axes-crud'],
          roles: ['Admin'],
        },
        {
          label: 'Gestion des quartiers',
          routerLink: ['./quartiers-crud'],
          roles: ['Admin'],
        },
        {
          label: 'Gestion des axes/quartiers/cars',
          routerLink: ['./axes'],
          roles: ['Admin'],
        },
        {
          label: 'Gestion des utilisateurs',
          routerLink: ['./utilisateurs'],
          roles: ['Admin'],
        },
        {
          label: 'Reclamation',
          routerLink: ['./reclamations'],
          roles: ['Admin'],
          notificationCount: this.notificationCount, // Use the current notificationCount value
        },
        {
          label: 'Localisation des agents',
          routerLink: ['./localisation'],
          roles: ['Admin'],
        },
        {
          label: 'Itinéraires des bus',
          routerLink: ['./itineraire'],
          roles: ['Admin'],
        },
      ],
    },
  ];

  items!: any[];
  expandedPanels: boolean[] = [];

  constructor(
    private notificationService: NotificationService,
    private genericservice: GenericService
  ) {}

  async ngOnInit() {
    this.loadLink();
    this.expandedPanels = new Array(this.menuItems.length).fill(false);
    // Subscribe to notificationCount observable for auto-updates
    this.notificationService.notificationCount$.subscribe((count) => {
      this.notificationCount = count;
      // Update the menu item with the latest notification count
      this.menuItems[0].items.forEach((item: any) => {
        if (item.label === 'Reclamation') {
          item.notificationCount = count;
        }
      });
    });
  }

  ngOnDestroy() {
    // Clean up by stopping the polling when the component is destroyed
    this.notificationService.stopPolling();
  }

  async loadLink() {
    const roleuser = localStorage.getItem('iduser')!;

    if (roleuser == '562' || roleuser == '238') {
      try {
        const data = await this.genericservice.get('countreclamations');

        if (
          Array.isArray(data) &&
          data.length > 0 &&
          data[0]?.count !== undefined
        ) {
          this.notificationCount = data[0].count;
          this.notificationService.updateNotificationCount(data[0].count);
        } else {
          console.warn('Données vides ou mal formatées :', data);
          this.notificationCount = 0;
        }
      } catch (error) {
        console.error('Erreur lors du chargement des réclamations :', error);
        this.notificationCount = 0;
      }
    }

    const accessibleItems = this.menuItems.map((group) => ({
      category: group.category,
      icon: group.icon,
      items: group.items.filter((item) => {
        if (item.roles.length === 0) return true;
        return (
          (roleuser == '562' || roleuser == '238') &&
          item.roles.includes('Admin')
        );
      }),
    }));

    this.items = accessibleItems.filter((group) => group.items.length > 0);
  }

  togglePanel(index: number) {
    this.expandedPanels[index] = !this.expandedPanels[index];
  }
}
