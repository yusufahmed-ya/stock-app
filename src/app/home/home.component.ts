import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { Company } from '../shared/models/company';
import { AlphaVantageService } from '../shared/services/alpha-vantage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  searchForm: FormGroup;
  loading = false;
  companies: Company[];
  searchInput: string;

  constructor(private alphaVantageSvc: AlphaVantageService, private activatedRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.searchInput = params.get('searchInput');
      this.searchForm = new FormGroup({
        companiesCtrl: new FormControl(this.searchInput ? this.searchInput : '')
      });
      this.getCompanies(this.searchInput);
    });
  }

  onChangeSearchCompanies(event) {
    this.companies = null;
    this.searchInput = event.currentTarget.value;
    this.getCompanies(this.searchInput);
    this.router.navigate(['home', this.searchInput]);
  }

  getCompanies(searchInput: string): void {
    this.loading = true;
    this.alphaVantageSvc
      .getCompanies(searchInput)
      .pipe(
        map(res => {
          this.companies = this.mapCompanies(res);
          this.loading = false;
        }))
      .subscribe();
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
          const timezone = c['7. timezone'];
          const currency = c['8. currency'];

          res.push({
            symbol,
            name,
            type,
            region,
            marketOpen,
            marketClose,
            timezone,
            currency,
          } as Company);
        });
      }
      return res;
    }
  }

}
