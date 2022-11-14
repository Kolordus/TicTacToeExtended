import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NominalsComponent } from './nominals.component';

describe('NominalsComponent', () => {
  let component: NominalsComponent;
  let fixture: ComponentFixture<NominalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NominalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NominalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
