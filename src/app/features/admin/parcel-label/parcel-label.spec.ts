import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelLabel } from './parcel-label';

describe('ParcelLabel', () => {
  let component: ParcelLabel;
  let fixture: ComponentFixture<ParcelLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcelLabel],
    }).compileComponents();

    fixture = TestBed.createComponent(ParcelLabel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
