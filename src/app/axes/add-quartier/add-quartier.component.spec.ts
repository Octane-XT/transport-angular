import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQuartierComponent } from './add-quartier.component';

describe('AddQuartierComponent', () => {
  let component: AddQuartierComponent;
  let fixture: ComponentFixture<AddQuartierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddQuartierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddQuartierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
