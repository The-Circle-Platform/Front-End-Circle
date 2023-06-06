import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineListComponent } from './online-list.component';

describe('OnlineListComponent', () => {
  let component: OnlineListComponent;
  let fixture: ComponentFixture<OnlineListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
