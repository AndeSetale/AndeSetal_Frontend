import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailInterventionAgent } from './detail-intervention-agent';

describe('DetailInterventionAgent', () => {
  let component: DetailInterventionAgent;
  let fixture: ComponentFixture<DetailInterventionAgent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailInterventionAgent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailInterventionAgent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
