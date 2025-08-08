import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminArgumentsComponent } from './admin-arguments.component';

describe('AdminArgumentsComponent', () => {
  let component: AdminArgumentsComponent;
  let fixture: ComponentFixture<AdminArgumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminArgumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminArgumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
