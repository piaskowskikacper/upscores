import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchPreviewComponent } from './match-preview.component';

describe('MatchPreviewComponent', () => {
  let component: MatchPreviewComponent;
  let fixture: ComponentFixture<MatchPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
