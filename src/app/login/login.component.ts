import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { GenericService } from '../service/genericservice.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private genericService: GenericService,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.fb.group({
      matricule: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      console.log('Login Data:', formData);
      const data = {
        username: this.loginForm.value.matricule,
        password: this.loginForm.value.password,
      };
      try {
        // Make the API call to login
        const result = await this.genericService.post('login', data);
        console.log(result);

        // Assuming the result contains a token or other important data
        if (result && result.user) {
          // Store the result in localStorage (you can store the whole result or just part of it)
          localStorage.setItem('iduser', JSON.stringify(result.user.id));
          localStorage.setItem('rolepoids', JSON.stringify(result.user.userpoids));
          localStorage.setItem(
            'roleuser',
            JSON.stringify(result.user.userrole)
          );
          const UserRole = localStorage.getItem('roleuser');
          const usercampagne = await this.genericService.getById('usercampagne',result.user.id);
          const userrolepoids = localStorage.getItem('rolepoids');
          if (usercampagne) {
            localStorage.setItem('usercampagne', JSON.stringify(usercampagne.campagne_id));
          }else{
            localStorage.setItem('usercampagne', '0');
          }
          // Navigate to the next page
          if (UserRole !== null && Number(userrolepoids) >= 3) {
            //this.router.navigate(['transport/axes']);
	      this.router.navigate(['transport/reservation']);		
          } else {
            this.router.navigate(['transport/reservation']);
          }
        } else {
          this.notificationService.showError(
            'Matricule ou mot de passe invalide.'
          );
          console.log('Login failed, no token received');
        }
      } catch (error) {
        this.notificationService.showError(
          'Erreur lors de la connexion, veuillez réessayer plus tard.'
        );
      }
    } else {
      this.notificationService.showError('Verifier les informations saisies');
      console.log('Form is invalid');
    }
  }
}
