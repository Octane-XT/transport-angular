import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserreservationComponent } from './userreservation.component';

describe('UserreservationComponent', () => {
  let component: UserreservationComponent;
  let fixture: ComponentFixture<UserreservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserreservationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserreservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
