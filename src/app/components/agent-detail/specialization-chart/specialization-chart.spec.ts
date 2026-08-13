import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecializationChart } from './specialization-chart';

describe('SpecializationChart', () => {
  let component: SpecializationChart;
  let fixture: ComponentFixture<SpecializationChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecializationChart],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecializationChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
