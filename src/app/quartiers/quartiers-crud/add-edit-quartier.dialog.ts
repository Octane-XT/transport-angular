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

import { QuartierApiService } from './quartier-api.service';
import { Quartier } from './quartier.model';

type DialogData = { mode: 'create' } | { mode: 'edit'; quartier: Quartier };

// Typed reactive form (label is optional -> no required validator)
type QuartierForm = FormGroup<{
  quartier_libelle: FormControl<string>;
}>;

@Component({
  selector: 'app-add-edit-quartier-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './add-edit-quartier.dialog.html',
})
export class AddEditQuartierDialogComponent {
  isEdit = false;
  busy = false;
  form: QuartierForm;

  constructor(
    private fb: NonNullableFormBuilder,
    private api: QuartierApiService,
    private ref: MatDialogRef<AddEditQuartierDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.form = this.fb.group({
      // not required because backend accepts null
      quartier_libelle: this.fb.control('', {
        validators: [Validators.maxLength(255)],
      }),
    });

    if (data.mode === 'edit') {
      this.isEdit = true;
      this.form.patchValue({
        quartier_libelle: data.quartier.quartier_libelle ?? '',
      });
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.busy = true;

    // Convert "" -> null to respect backend contract
    const labelOrNull = this.form.controls.quartier_libelle.value?.trim() || '';
    const payload: string | null = labelOrNull === '' ? null : labelOrNull;

    if (this.data.mode === 'edit') {
      this.api.update(this.data.quartier.quartier_id, payload).subscribe({
        next: () => {
          this.busy = false;
          this.ref.close(true);
        },
        error: () => {
          this.busy = false;
        },
      });
    } else {
      this.api.create(payload).subscribe({
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
