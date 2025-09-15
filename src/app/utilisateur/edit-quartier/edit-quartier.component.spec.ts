import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditQuartierComponent } from './edit-quartier.component';

describe('EditQuartierComponent', () => {
  let component: EditQuartierComponent;
  let fixture: ComponentFixture<EditQuartierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditQuartierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditQuartierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
