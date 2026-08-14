import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilAgent } from './accueil-agent';

describe('AccueilAgent', () => {
  let component: AccueilAgent;
  let fixture: ComponentFixture<AccueilAgent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueilAgent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccueilAgent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
