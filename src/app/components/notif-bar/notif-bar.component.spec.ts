import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifBarComponent } from './notif-bar.component';

describe('NotifBarComponent', () => {
  let component: NotifBarComponent;
  let fixture: ComponentFixture<NotifBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotifBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotifBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
