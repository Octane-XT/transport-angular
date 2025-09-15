import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MyquartierComponent } from '../../reservation/myquartier/myquartier.component';
//import { LoginService } from '../../login/service/LoginService';

@Component({
  selector: 'app-topmenu',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './topmenu.component.html',
  styleUrl: './topmenu.component.css',
})
export class TopmenuComponent {
  @Input() close: boolean = false;
  @Output() changeEtat: EventEmitter<void> = new EventEmitter<void>();

  constructor(private dialogue: MatDialog) {}

  myquartier() {
    const dialogRef = this.dialogue.open(MyquartierComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
      }
    });
  }

  logout() {
    localStorage.removeItem('iduser');
    localStorage.removeItem('roleuser');
    localStorage.removeItem('usercampagne');
    localStorage.removeItem('rolepoids');
    window.location.reload();
  }
}
