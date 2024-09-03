import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexCodeOutputComponent } from './flex-code-output.component';

describe('FlexCodeOutputComponent', () => {
  let component: FlexCodeOutputComponent;
  let fixture: ComponentFixture<FlexCodeOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlexCodeOutputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlexCodeOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
