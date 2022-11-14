import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoSuchPageComponent } from './no-such-page.component';

describe('NoSuchPageComponent', () => {
  let component: NoSuchPageComponent;
  let fixture: ComponentFixture<NoSuchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoSuchPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoSuchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
