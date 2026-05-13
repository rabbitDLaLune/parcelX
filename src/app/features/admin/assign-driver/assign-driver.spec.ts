import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignDriver } from './assign-driver';

describe('AssignDriver', () => {
  let component: AssignDriver;
  let fixture: ComponentFixture<AssignDriver>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignDriver],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignDriver);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
