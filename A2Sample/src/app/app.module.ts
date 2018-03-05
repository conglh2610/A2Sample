import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { AutoCompleteComponent } from './web-components/auto-complete/auto-complete.component';
import { PostDetailsComponent } from './post-details/post-details.component';

import { CountryService } from './services/country.service';
import { CategoryService } from './services/category.service';
import { AppComponent } from './app.component';

import { SearchFilterPipe } from './utils/search-filter-pipe.utils';

import { ImageUploadModule } from "angular2-image-upload";


@NgModule({
  declarations: [
    AppComponent,
    PostDetailsComponent,
    AutoCompleteComponent,
    SearchFilterPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule.forRoot(),
    HttpClientModule,
    HttpModule,
    ReactiveFormsModule,
    ImageUploadModule.forRoot()
  ],
  providers: [CountryService, CategoryService, HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
