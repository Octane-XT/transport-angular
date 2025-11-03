import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuartiersCrudComponent } from './quartiers-crud.component';

describe('QuartiersCrudComponent', () => {
  let component: QuartiersCrudComponent;
  let fixture: ComponentFixture<QuartiersCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuartiersCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuartiersCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
