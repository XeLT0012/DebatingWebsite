import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebateModerationComponent } from './debate-moderation.component';

describe('DebateModerationComponent', () => {
  let component: DebateModerationComponent;
  let fixture: ComponentFixture<DebateModerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebateModerationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebateModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
