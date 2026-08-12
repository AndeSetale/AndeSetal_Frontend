import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepartitionIncidents } from './repartition-incidents';

describe('RepartitionIncidents', () => {
  let component: RepartitionIncidents;
  let fixture: ComponentFixture<RepartitionIncidents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepartitionIncidents],
    }).compileComponents();

    fixture = TestBed.createComponent(RepartitionIncidents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
