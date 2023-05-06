import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerViewComponent } from './datepicker-view.component';

describe('DatepickerViewComponent', () => {
  let component: DatepickerViewComponent;
  let fixture: ComponentFixture<DatepickerViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatepickerViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatepickerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
