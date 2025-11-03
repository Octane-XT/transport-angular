import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  NonNullableFormBuilder,
  Validators,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AxeApiService } from './axe-api.service';
import { Axe } from './axe.model';

type DialogData = { mode: 'create' } | { mode: 'edit'; axe: Axe };

// Typed reactive form
type AxeForm = FormGroup<{
  axe_libelle: FormControl<string>;
}>;

@Component({
  selector: 'app-add-edit-axe-dialog',
  standalone: true,
  // 👇 add ReactiveFormsModule here
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './add-edit-axe.dialog.html',
})
export class AddEditAxeDialogComponent {
  isEdit = false;
  busy = false;
  form: AxeForm;

  constructor(
    private fb: NonNullableFormBuilder,
    private api: AxeApiService,
    private ref: MatDialogRef<AddEditAxeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.form = this.fb.group({
      axe_libelle: this.fb.control('', {
        validators: [Validators.required, Validators.maxLength(255)],
      }),
    });

    if (data.mode === 'edit') {
      this.isEdit = true;
      this.form.patchValue({ axe_libelle: data.axe.axe_libelle });
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.busy = true;
    const label = this.form.controls.axe_libelle.value;

    if (this.data.mode === 'edit') {
      this.api.update(this.data.axe.axe_id, label).subscribe({
        next: () => {
          this.busy = false;
          this.ref.close(true);
        },
        error: () => {
          this.busy = false;
        },
      });
    } else {
      this.api.create(label).subscribe({
        next: () => {
          this.busy = false;
          this.ref.close(true);
        },
        error: () => {
          this.busy = false;
        },
      });
    }
  }

  close() {
    this.ref.close(false);
  }
}
