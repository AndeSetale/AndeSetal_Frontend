import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteIntervention } from './carte-intervention';

describe('CarteIntervention', () => {
  let component: CarteIntervention;
  let fixture: ComponentFixture<CarteIntervention>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteIntervention],
    }).compileComponents();

    fixture = TestBed.createComponent(CarteIntervention);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
