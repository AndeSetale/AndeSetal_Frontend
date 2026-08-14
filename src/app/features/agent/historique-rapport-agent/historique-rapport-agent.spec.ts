import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueRapportAgent } from './historique-rapport-agent';

describe('HistoriqueRapportAgent', () => {
  let component: HistoriqueRapportAgent;
  let fixture: ComponentFixture<HistoriqueRapportAgent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueRapportAgent],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoriqueRapportAgent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
