import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterParcel } from './register-parcel';

describe('RegisterParcel', () => {
  let component: RegisterParcel;
  let fixture: ComponentFixture<RegisterParcel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterParcel],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterParcel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
