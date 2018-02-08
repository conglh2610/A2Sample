import { Component, EventEmitter, OnInit, ModuleWithProviders, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CountryService } from '../services/country.service';

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
  public countries = ["Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus",
    "Belgium", "Bosnia & Herzegovina", "Bulgaria", "Croatia", "Cyprus",
    "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Georgia",
    "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kosovo",
    "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Malta",
    "Moldova", "Monaco", "Montenegro", "Netherlands", "Norway", "Poland",
    "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia",
    "Spain", "Sweden", "Switzerland", "Turkey", "Ukraine", "United Kingdom", "Vatican City"];
  public filteredList = [];
  public elementRef;

  constructor(myElement: ElementRef, public countryService: CountryService) {
    this.elementRef = myElement;
  }


  ngOnInit() {
    this.countryService.getCountries().subscribe(raw => {
      debugger
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

  filter() {
    if (this.query !== "") {
      this.filteredList = this.countries.filter(function (el) {
        return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
      }.bind(this));
    } else {
      this.filteredList = [];
    }
  }

  select(item) {
    this.query = item;
    this.filteredList = [];
  }
}
