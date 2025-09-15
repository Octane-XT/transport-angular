import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  animate,
  style,
  transition,
  trigger,
  state,
} from '@angular/animations';
import { TopmenuComponent } from '../topmenu/topmenu.component';
import { SidemenuComponent } from '../sidemenu/sidemenu.component';

@Component({
  selector: 'app-app.layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TopmenuComponent, SidemenuComponent],
  animations: [
    trigger('sideMenuWidth', [
      state(
        'open',
        style({
          width: '250px',
        })
      ),
      state(
        'closed',
        style({
          width: '0px',
        })
      ),
      transition('open <=> closed', [animate('300ms ease-in-out')]),
    ]),
  ],
  templateUrl: './app.layout.component.html',
  styleUrl: './app.layout.component.css',
})
export class AppLayoutComponent {
  close: boolean = false;

  changeEtat() {
    this.close = !this.close;
  }
}
