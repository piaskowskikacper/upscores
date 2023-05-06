import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedViewComponent } from './finished-view.component';

describe('FinishedViewComponent', () => {
  let component: FinishedViewComponent;
  let fixture: ComponentFixture<FinishedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishedViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
