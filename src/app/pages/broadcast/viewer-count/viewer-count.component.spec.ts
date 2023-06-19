import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerCountComponent } from './viewer-count.component';

describe('ViewerCountComponent', () => {
  let component: ViewerCountComponent;
  let fixture: ComponentFixture<ViewerCountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewerCountComponent]
    });
    fixture = TestBed.createComponent(ViewerCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
