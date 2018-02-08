import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { CountryService } from './services/country.service';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
    AutoCompleteComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule.forRoot(),
    HttpClientModule
  ],
  providers: [CountryService],
  bootstrap: [AppComponent, AutoCompleteComponent]
})
export class AppModule { }
