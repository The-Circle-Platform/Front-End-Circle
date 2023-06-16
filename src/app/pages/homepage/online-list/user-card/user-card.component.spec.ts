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

    component.User = {Id: 0, IsOnline: false, UserName: "TestDonavan", FollowCount: 12, Email: "donavan@test.nl", Balance: 10};

    const span = fixture.nativeElement.querySelector("p");

    expect(span.textContent).toContain("Status: Offline ●");
  })

  it("Should show Online user", ()=>{
    component.User = {Id: 0, IsOnline: true, UserName: "TestDonavan", FollowCount: 12, Email: "donavan@test.nl", Balance: 1000};

    fixture.detectChanges();
    component.ngOnInit();

    const span = fixture.nativeElement.querySelector("p");

    expect(span.textContent).toContain("Status: Online ●");
  })
});
