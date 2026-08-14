import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupIncident } from './popup-incident';

describe('PopupIncident', () => {
  let component: PopupIncident;
  let fixture: ComponentFixture<PopupIncident>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupIncident],
    }).compileComponents();

    fixture = TestBed.createComponent(PopupIncident);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
