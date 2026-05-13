import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelForm } from './parcel-form';

describe('ParcelForm', () => {
  let component: ParcelForm;
  let fixture: ComponentFixture<ParcelForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcelForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ParcelForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
