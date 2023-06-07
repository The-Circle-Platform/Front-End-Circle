import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCardComponent } from './user-card.component';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCardComponent ]
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

    component.User = {id: 0, isOnline: false, userName: "TestDonavan"};

    let span = fixture.nativeElement.querySelector("p");

    expect(span.textContent).toContain("Status: Offline ●");
  })

  it("Should show Online user", ()=>{
    component.User = {id: 0, isOnline: true, userName: "TestDonavan"};

    fixture.detectChanges();
    component.ngOnInit();

    let span = fixture.nativeElement.querySelector("p");

    expect(span.textContent).toContain("Status: Online ●");
  })
});
