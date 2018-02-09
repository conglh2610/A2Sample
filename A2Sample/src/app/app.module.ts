import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { CountryService } from './services/country.service';

import { AppComponent } from './app.component';
import { SearchFilterPipe } from './utils/search-filter-pipe.utils';


@NgModule({
  declarations: [
    AppComponent,
    AutoCompleteComponent,
    SearchFilterPipe
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
