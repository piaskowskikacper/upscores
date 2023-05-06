import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComingViewComponent } from './coming-view.component';

describe('ComingViewComponent', () => {
  let component: ComingViewComponent;
  let fixture: ComponentFixture<ComingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComingViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
