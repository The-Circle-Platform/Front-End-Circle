import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamingVideoComponent } from './streaming-video.component';

describe('StreamingVideoComponent', () => {
  let component: StreamingVideoComponent;
  let fixture: ComponentFixture<StreamingVideoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StreamingVideoComponent]
    });
    fixture = TestBed.createComponent(StreamingVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
