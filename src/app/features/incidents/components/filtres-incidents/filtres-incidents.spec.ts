import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltresIncidents } from './filtres-incidents';

describe('FiltresIncidents', () => {
  let component: FiltresIncidents;
  let fixture: ComponentFixture<FiltresIncidents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltresIncidents],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltresIncidents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
