import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditArchiveComponent } from './edit-archive.component';

describe('EditArchiveComponent', () => {
  let component: EditArchiveComponent;
  let fixture: ComponentFixture<EditArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditArchiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
