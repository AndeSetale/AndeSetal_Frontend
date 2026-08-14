import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentStatsGrid } from './agent-stats-grid';

describe('AgentStatsGrid', () => {
  let component: AgentStatsGrid;
  let fixture: ComponentFixture<AgentStatsGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentStatsGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentStatsGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
