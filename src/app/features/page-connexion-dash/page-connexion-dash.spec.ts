import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageConnexionDash } from './page-connexion-dash';

describe('PageConnexionDash', () => {
  let component: PageConnexionDash;
  let fixture: ComponentFixture<PageConnexionDash>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageConnexionDash],
    }).compileComponents();

    fixture = TestBed.createComponent(PageConnexionDash);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
