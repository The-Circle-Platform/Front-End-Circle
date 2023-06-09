import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { OnlineListComponent } from './online-list.component';
import { UserCardComponent } from './user-card/user-card.component';

describe('OnlineListComponent', () => {
    let component: OnlineListComponent;
    let fixture: ComponentFixture<OnlineListComponent>;
    let httpMock: jasmine.SpyObj<HttpClient>;
    // const mockData: User[] = [{id: 1, isOnline: true, userName: "TestDamian", followCount: 12}, {id: 2, isOnline: false, userName: "TestSofie", followCount: 1234},]

    beforeEach(async () => {
        httpMock = jasmine.createSpyObj('HttpClient', ['get']);

        await TestBed.configureTestingModule({
            declarations: [OnlineListComponent, UserCardComponent],
            providers: [{ provide: HttpClient, useValue: httpMock }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(OnlineListComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('Should show list of online and offline streamers', fakeAsync (()=>{
    //   //Assert
    //   expect(component.list$.value).toBeUndefined();

    //   //- Mock http response
    //   httpMock.get.and.returnValue(of(mockData));
    //   // //Assert
    //   component.RefreshList();
    //   tick(2000);

    //   fixture.detectChanges();

    //   let result = component.list$.value!;
    //   //Assert primitive values.
    //   expect(result[0].isOnline).toBeTrue();
    //   expect(result[1].isOnline).toBeFalse();
    // }))
});
