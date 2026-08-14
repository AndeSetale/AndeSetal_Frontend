import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteIncidents } from './carte-incidents';

describe('CarteIncidents', () => {
  let component: CarteIncidents;
  let fixture: ComponentFixture<CarteIncidents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteIncidents],
    }).compileComponents();

    fixture = TestBed.createComponent(CarteIncidents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
