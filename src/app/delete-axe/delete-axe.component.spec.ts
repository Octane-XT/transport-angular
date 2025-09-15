import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAxeComponent } from './delete-axe.component';

describe('DeleteAxeComponent', () => {
  let component: DeleteAxeComponent;
  let fixture: ComponentFixture<DeleteAxeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAxeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteAxeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
