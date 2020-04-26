import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PricesComponent } from './shared/components/prices/prices.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home/google',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'home/:searchInput',
    component: HomeComponent
  },
  {
    path: 'home/prices/:symbol',
    component: PricesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
