import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviTransportComponent } from './suivi-transport.component';

describe('SuiviTransportComponent', () => {
  let component: SuiviTransportComponent;
  let fixture: ComponentFixture<SuiviTransportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiviTransportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuiviTransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
