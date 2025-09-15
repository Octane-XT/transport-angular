import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsermodifreservationComponent } from './usermodifreservation.component';

describe('UsermodifreservationComponent', () => {
  let component: UsermodifreservationComponent;
  let fixture: ComponentFixture<UsermodifreservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsermodifreservationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsermodifreservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
