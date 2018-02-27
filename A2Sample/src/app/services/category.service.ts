import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { catchError, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class CategoryService {

  private categoriesUrl: string
  constructor(private http: HttpClient) {
    this.categoriesUrl = "http://localhost:52661/api/category/getcategories";
  }

  getCategory(): any {
    return this.http.get<any>(this.categoriesUrl);
  }
}
