import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';

import { Company } from '../shared/models/company';
import { StockPrice } from '../shared/models/stock-price';
import { AlphaVantageService } from '../shared/services/alpha-vantage.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchForm: FormGroup;
  searchInput = '';
  loading = false;
  stockPrices: StockPrice[];
  companies: Company[];
  searchCompanies = '';

  constructor(private alphaVantageSvc: AlphaVantageService) {

  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      pricesCtrl: new FormControl(''),
      companiesCtrl: new FormControl('')
    });
  }

  onChangeSearchInput(e) {
    this.stockPrices = null;
    this.searchInput = e.currentTarget.value;
    this.loading = true;
    this.alphaVantageSvc
      .getInstruments(this.searchInput)
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

  mapCompanies(data: any): Company[] {

    const res = new Array<Company>();

    if (data) {
      const companies = data.bestMatches;

      if (companies) {
        companies.forEach(c => {
          const symbol = c['1. symbol'];
          const name = c['2. name'];
          const type = c['3. type'];
          const region = c['4. region'];
          const marketOpen = c['5. marketOpen'];
          const marketClose = c['6. marketClose'];
          const currency = c['7. currency'];

          res.push({
            symbol,
            name,
            type,
            region,
            marketOpen,
            marketClose,
            currency
          } as Company);
        });
      }
      return res;
    }
  }

  onChangeSearchCompanies(event) {
    this.companies = null;
    this.searchCompanies = event.currentTarget.value;
    this.loading = true;
    this.alphaVantageSvc
      .getCompanies(this.searchCompanies)
      .pipe(
        map(res => {
          this.companies = this.mapCompanies(res);
          this.loading = false;
        }))
      .subscribe();
  }
}
