import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyquartierComponent } from './myquartier.component';

describe('MyquartierComponent', () => {
  let component: MyquartierComponent;
  let fixture: ComponentFixture<MyquartierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyquartierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyquartierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
