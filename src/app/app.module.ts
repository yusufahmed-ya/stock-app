import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PricesComponent } from './prices/prices.component';
import { CompanyCardComponent } from './shared/components/company-card/company-card.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { TileComponent } from './shared/components/tile/tile.component';
import { TitleComponent } from './shared/components/title/title.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TitleComponent,
    SpinnerComponent,
    TileComponent,
    CompanyCardComponent,
    PricesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
