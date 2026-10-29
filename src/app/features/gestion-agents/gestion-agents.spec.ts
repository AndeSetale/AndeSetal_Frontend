import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAgents } from './gestion-agents';

describe('GestionAgents', () => {
  let component: GestionAgents;
  let fixture: ComponentFixture<GestionAgents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAgents],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionAgents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
