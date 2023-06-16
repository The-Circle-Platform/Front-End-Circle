import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCardComponent } from './user-card.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("Should show offline user", ()=>{
    component.ngOnInit();

    component.User = {Id: 0, isOnline: false, UserName: "TestDonavan", followCount: 12, email: "donavan@test.nl", balance: 10};

    const span = fixture.nativeElement.querySelector("p");

    expect(span.textContent).toContain("Status: Offline ●");
  })

  it("Should show Online user", ()=>{
    component.User = {Id: 0, isOnline: true, UserName: "TestDonavan", followCount: 12, email: "donavan@test.nl", balance: 1000};

    fixture.detectChanges();
    component.ngOnInit();

    const span = fixture.nativeElement.querySelector("p");

    expect(span.textContent).toContain("Status: Online ●");
  })
});
