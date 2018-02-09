import { Component, EventEmitter, OnInit, ModuleWithProviders, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CountryService } from '../services/country.service';
import { SearchFilterPipe } from '../utils/search-filter-pipe.utils';

@Component({
  selector: 'auto-complete',
  host: {
    '(document:click)': 'handleClick($event)',
  },
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css']
})
export class AutoCompleteComponent implements OnInit {
  public query = '';
  private countries = [];
  public filteredList = [];
  public elementRef;
  private txtCountry = '';
  private levelConfig = [{ key: 1, value: "region" }, { key: 2, value: "country" }];

  constructor(myElement: ElementRef, public countryService: CountryService) {
    this.elementRef = myElement;
  }

  ngOnInit() {
    this.countryService.getCountries().subscribe(raw => {
      this.countries = raw;
    })
  }

  handleClick(event) {
    var clickedComponent = event.target;
    var inside = false;
    do {
      if (clickedComponent === this.elementRef.nativeElement) {
        inside = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (!inside) {
      this.filteredList = [];
    }
  }

  select(item) {
    this.query = item;
    this.filteredList = [];
  }
}
