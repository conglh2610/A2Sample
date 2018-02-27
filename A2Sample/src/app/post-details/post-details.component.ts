import { Component, EventEmitter, ModuleWithProviders, ElementRef, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../services/category.service';


@Component({
  selector: 'post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']

})
export class PostDetailsComponent  {
  private rawCategories = [];
  private filteredList = [];


  constructor(private categoryService: CategoryService) {

    this.categoryService.getCategory().subscribe(raw => {
      this.rawCategories = raw;
    });
  }

  
}
