import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chargement } from './chargement';

describe('Chargement', () => {
  let component: Chargement;
  let fixture: ComponentFixture<Chargement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chargement],
    }).compileComponents();

    fixture = TestBed.createComponent(Chargement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
