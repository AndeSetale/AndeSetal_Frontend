import { TestBed } from '@angular/core/testing';

import { AgentIncident } from './agent-incident';

describe('AgentIncident', () => {
  let service: AgentIncident;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentIncident);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
