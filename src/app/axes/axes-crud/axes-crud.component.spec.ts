import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AxesCrudComponent } from './axes-crud.component';

describe('AxesCrudComponent', () => {
  let component: AxesCrudComponent;
  let fixture: ComponentFixture<AxesCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AxesCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AxesCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
