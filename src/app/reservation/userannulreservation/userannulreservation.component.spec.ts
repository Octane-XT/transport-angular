import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserannulreservationComponent } from './userannulreservation.component';

describe('UserannulreservationComponent', () => {
  let component: UserannulreservationComponent;
  let fixture: ComponentFixture<UserannulreservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserannulreservationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserannulreservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
