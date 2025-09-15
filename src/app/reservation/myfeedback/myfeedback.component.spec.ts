import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyfeedbackComponent } from './myfeedback.component';

describe('MyfeedbackComponent', () => {
  let component: MyfeedbackComponent;
  let fixture: ComponentFixture<MyfeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyfeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyfeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
