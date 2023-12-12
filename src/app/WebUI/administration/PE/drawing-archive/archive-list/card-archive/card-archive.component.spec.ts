import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardArchiveComponent } from './card-archive.component';

describe('CardArchiveComponent', () => {
  let component: CardArchiveComponent;
  let fixture: ComponentFixture<CardArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardArchiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
