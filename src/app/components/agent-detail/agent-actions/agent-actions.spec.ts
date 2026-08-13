import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentActions } from './agent-actions';

describe('AgentActions', () => {
  let component: AgentActions;
  let fixture: ComponentFixture<AgentActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentActions],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentActions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
