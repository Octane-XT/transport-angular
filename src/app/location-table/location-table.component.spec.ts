import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationTableComponent } from './location-table.component';

describe('LocationTableComponent', () => {
  let component: LocationTableComponent;
  let fixture: ComponentFixture<LocationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
