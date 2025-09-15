import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFormUserComponent } from './add-form-user.component';

describe('AddFormComponent', () => {
  let component: AddFormUserComponent;
  let fixture: ComponentFixture<AddFormUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFormUserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddFormUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
