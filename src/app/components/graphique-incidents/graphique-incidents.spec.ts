import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphiqueIncidents } from './graphique-incidents';

describe('GraphiqueIncidents', () => {
  let component: GraphiqueIncidents;
  let fixture: ComponentFixture<GraphiqueIncidents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphiqueIncidents],
    }).compileComponents();

    fixture = TestBed.createComponent(GraphiqueIncidents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
