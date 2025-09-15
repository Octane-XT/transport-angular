import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GenericService } from '../../service/genericservice.service';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../service/notification.service';
import { not } from 'rxjs/internal/util/not';

@Component({
  selector: 'app-edit-form',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  templateUrl: './edit-form.component.html',
  styleUrl: './edit-form.component.css',
})
export class EditFormComponent implements OnInit {
  axebytime: any;
  filteredAxe: any[] = [];
  selectedAxe: any;

  @ViewChild('axeInput') axeInput!: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<EditFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private genericService: GenericService,
    private notificationService: NotificationService
  ) {}
  async ngOnInit() {
    console.log(this.data);
    const transportuser = await this.genericService.getById(
      'axeuser',
      this.data.transportuser_id
    );
    const heure = transportuser[0]?.transportuser_heure;
    this.axebytime = await this.genericService.getById('axe', heure);
    console.log(this.axebytime);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  async onSave() {
    const transportUserId = this.data.transportuser_id;
    const data = this.selectedAxe;
    const transport_status = data.axe_id;
    const axeId = data.axe_id;

    this.dialogRef.close(this.data);
    const updateData = {
      transportuser_status: transport_status,
      transportuser_axe: axeId,
    };

    this.dialogRef.close(this.data);

    try {
      const result = await this.genericService.update(
        'user',
        transportUserId,
        updateData
      );
      this.notificationService.showSuccess('Mise à jour effectuée');
    } catch (error) {
      this.notificationService.showError('Erreur lors de la mise à jour');
    }
  }

  filterAxe() {
    const filterValue = this.axeInput.nativeElement.value.toLowerCase();
    this.filteredAxe = this.axebytime.filter((item: { axe_libelle: string }) =>
      item.axe_libelle.toLowerCase().includes(filterValue)
    );
  }

  displayAxe(axe: any): string {
    return axe ? axe.axe_libelle : '';
  }

  onAxeSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedAxe = event.option.value;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
