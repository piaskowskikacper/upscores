import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteViewComponent } from './favourite-view.component';

describe('FavouriteViewComponent', () => {
  let component: FavouriteViewComponent;
  let fixture: ComponentFixture<FavouriteViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavouriteViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavouriteViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
