import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbAgent } from './breadcrumb-agent';

describe('BreadcrumbAgent', () => {
  let component: BreadcrumbAgent;
  let fixture: ComponentFixture<BreadcrumbAgent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbAgent],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbAgent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
