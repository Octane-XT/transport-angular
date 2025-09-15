import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraireViewComponent } from './itineraire-view.component';

describe('ItineraireViewComponent', () => {
  let component: ItineraireViewComponent;
  let fixture: ComponentFixture<ItineraireViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItineraireViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItineraireViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
