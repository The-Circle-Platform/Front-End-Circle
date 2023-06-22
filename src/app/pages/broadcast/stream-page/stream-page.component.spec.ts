import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatStreamComponent } from '../chat-stream/chat-stream.component';
import { StreamingPlayerComponent } from '../streaming-player/streaming-player.component';
import { StreamPageComponent } from './stream-page.component';

describe('StreamPageComponent', () => {
    let component: StreamPageComponent;
    let fixture: ComponentFixture<StreamPageComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                StreamPageComponent,
                StreamingPlayerComponent,
                ChatStreamComponent,
            ],
        });
        fixture = TestBed.createComponent(StreamPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
