import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelTimeline } from './parcel-timeline';

describe('ParcelTimeline', () => {
  let component: ParcelTimeline;
  let fixture: ComponentFixture<ParcelTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcelTimeline],
    }).compileComponents();

    fixture = TestBed.createComponent(ParcelTimeline);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
