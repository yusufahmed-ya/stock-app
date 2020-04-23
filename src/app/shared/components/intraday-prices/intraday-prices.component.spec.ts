import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntradayPricesComponent } from './intraday-prices.component';

describe('IntradayPricesComponent', () => {
  let component: IntradayPricesComponent;
  let fixture: ComponentFixture<IntradayPricesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntradayPricesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntradayPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
