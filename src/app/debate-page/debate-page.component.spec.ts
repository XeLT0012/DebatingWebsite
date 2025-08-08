import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebatePageComponent } from './debate-page.component';

describe('DebatePageComponent', () => {
  let component: DebatePageComponent;
  let fixture: ComponentFixture<DebatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
