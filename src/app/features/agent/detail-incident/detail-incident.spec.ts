import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailIncident } from './detail-incident';

describe('DetailIncident', () => {
  let component: DetailIncident;
  let fixture: ComponentFixture<DetailIncident>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailIncident],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailIncident);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
