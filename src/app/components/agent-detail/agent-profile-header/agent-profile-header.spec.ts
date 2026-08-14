import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentProfileHeader } from './agent-profile-header';

describe('AgentProfileHeader', () => {
  let component: AgentProfileHeader;
  let fixture: ComponentFixture<AgentProfileHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentProfileHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentProfileHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
