import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAgentModal } from './add-agent-modal';

describe('AddAgentModal', () => {
  let component: AddAgentModal;
  let fixture: ComponentFixture<AddAgentModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAgentModal],
    }).compileComponents();

    fixture = TestBed.createComponent(AddAgentModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
