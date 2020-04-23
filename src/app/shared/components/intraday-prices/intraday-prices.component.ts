import { Component, Input, OnInit } from '@angular/core';

import { IntradayPrice } from '../../models/intraday-price';

@Component({
  selector: 'app-intraday-prices',
  templateUrl: './intraday-prices.component.html',
  styleUrls: ['./intraday-prices.component.scss']
})
export class IntradayPricesComponent implements OnInit {

  @Input() prices: IntradayPrice[];

  ngOnInit(): void {
  }

}
