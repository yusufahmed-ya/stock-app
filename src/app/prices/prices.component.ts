import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Highcharts from 'highcharts';
import { map } from 'rxjs/operators';

import { StockPrice } from '../shared/models/stock-price';
import { AlphaVantageService } from '../shared/services/alpha-vantage.service';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss']
})
export class PricesComponent implements OnInit {

  loading = true;
  symbol: string;
  stockPrices: StockPrice[];

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    series: [{
      data: [1, 2, 3],
      type: 'line'
    }]
  };

  constructor(private route: ActivatedRoute, private alphaVantageSvc: AlphaVantageService) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.symbol = params.get('symbol');
      this.getStockPrices(this.symbol);
    });
  }

  getStockPrices(symbol: string): void {
    this.stockPrices = null;
    this.alphaVantageSvc
      .getInstruments(symbol)
      .pipe(
        map(res => {
          this.stockPrices = this.mapStockPrices(res);
          this.loading = false;
        }))
      .subscribe();
  }

  mapStockPrices(data: any): StockPrice[] {

    const res = new Array<StockPrice>();

    if (data) {
      const prices = data['Time Series (Daily)'];

      if (prices) {
        for (const [key, value] of Object.entries(prices)) {
          const date = key;
          const open = value['1. open'];
          const high = value['2. high'];
          const low = value['3. low'];
          const close = value['4. close'];
          const volume = value['5. volume'];

          res.push({
            date: new Date(date),
            open,
            high,
            low,
            close,
            volume
          } as StockPrice);
        }
      }
    }
    console.log(res);
    return res;
  }

}
