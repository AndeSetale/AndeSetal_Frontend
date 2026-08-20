import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationAgent } from './navigation-agent';

describe('NavigationAgent', () => {
  let component: NavigationAgent;
  let fixture: ComponentFixture<NavigationAgent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationAgent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationAgent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
