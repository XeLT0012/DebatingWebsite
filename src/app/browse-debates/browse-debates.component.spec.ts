import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseDebatesComponent } from './browse-debates.component';

describe('BrowseDebatesComponent', () => {
  let component: BrowseDebatesComponent;
  let fixture: ComponentFixture<BrowseDebatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseDebatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseDebatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
