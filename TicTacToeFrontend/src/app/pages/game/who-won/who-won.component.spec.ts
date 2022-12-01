import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoWonComponent } from './who-won.component';

describe('WhoWonComponent', () => {
  let component: WhoWonComponent;
  let fixture: ComponentFixture<WhoWonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoWonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoWonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
