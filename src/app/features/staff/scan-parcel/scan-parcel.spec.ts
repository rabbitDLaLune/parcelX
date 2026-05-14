import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanParcel } from './scan-parcel';

describe('ScanParcel', () => {
  let component: ScanParcel;
  let fixture: ComponentFixture<ScanParcel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanParcel],
    }).compileComponents();

    fixture = TestBed.createComponent(ScanParcel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
