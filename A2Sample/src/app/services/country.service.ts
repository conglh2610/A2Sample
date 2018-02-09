import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { catchError, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class CountryService {

  constructor(private http: HttpClient) {

  }

  getCountries(): any {
    return this.http.get<any>('https://restcountries.eu/rest/v2/all');
  }
}
