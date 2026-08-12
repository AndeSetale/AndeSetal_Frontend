import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnTeteAuthentification } from './en-tete-authentification';

describe('EnTeteAuthentification', () => {
  let component: EnTeteAuthentification;
  let fixture: ComponentFixture<EnTeteAuthentification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnTeteAuthentification],
    }).compileComponents();

    fixture = TestBed.createComponent(EnTeteAuthentification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
