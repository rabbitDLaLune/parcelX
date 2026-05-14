import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMovement } from './update-movement';

describe('UpdateMovement', () => {
  let component: UpdateMovement;
  let fixture: ComponentFixture<UpdateMovement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateMovement],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateMovement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
