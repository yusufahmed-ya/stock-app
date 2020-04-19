import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Highcharts from 'highcharts';
import * as _ from 'lodash';
import * as moment from 'moment';
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
  chartOptions: Highcharts.Options;

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
          this.stockPrices = _.orderBy(this.mapStockPrices(res), 'date', 'desc');
          this.buildChart();
          this.loading = false;
        }))
      .subscribe();
  }

  buildChart(): void {

    const latestStockPrices = _.orderBy(_.take(this.stockPrices, 30), 'date', 'asc');

    const volume = latestStockPrices.map(s => s.volume);
    const dates = latestStockPrices.map(s => moment(s.date).format('DD-MMM-YYYY'));
    const prices = latestStockPrices.map(s => s.close);

    this.chartOptions = {
      chart: {
        zoomType: 'xy',
        backgroundColor: 'transparent'
      },
      title: {
        text: ''
      },
      xAxis: [{
        categories: dates,
        crosshair: true
      }],
      yAxis: [{
        labels: {
          format: '${value}'
        },
        title: {
          text: 'Price'
        }
      },
      {
        title: {
          text: 'Volume'
        },
        labels: {
          format: '{value}'
        },
        opposite: true
      }],
      tooltip: {
        shared: true
      },
      series: [{
        name: 'Volume',
        type: 'column',
        yAxis: 1,
        data: volume
      },
      {
        name: 'Price',
        type: 'spline',
        data: prices,
        tooltip: {
          valuePrefix: '$'
        }
      }]
    };
  }

  mapStockPrices(data: any): StockPrice[] {

    const res = new Array<StockPrice>();

    if (data) {
      const prices = data['Time Series (Daily)'];

      if (prices) {
        for (const [key, value] of Object.entries(prices)) {
          const date = key;
          const open = parseInt(value['1. open'], 10);
          const high = parseInt(value['2. high'], 10);
          const low = parseInt(value['3. low'], 10);
          const close = parseInt(value['4. close'], 10);
          const volume = parseInt(value['5. volume'], 10);

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
