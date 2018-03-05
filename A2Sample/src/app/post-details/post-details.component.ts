import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoryService } from '../services/category.service';


@Component({
  selector: 'post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']

})
export class PostDetailsComponent implements OnInit {
  postForm: FormGroup;
  category: FormControl;
  title: FormControl;
  email: FormControl;

  private rawCategories = [];
  private selectedItems = [];


  constructor(private categoryService: CategoryService) {

    this.categoryService.getCategory().subscribe(raw => {
      this.rawCategories = raw;
    });


  }

  ngOnInit(): void {
    this.initFormControls();
    this.createForm();
  }

  initFormControls() {
    this.category = new FormControl('', Validators.required);
    this.title = new FormControl('', Validators.required);
  }

  createForm() {
    this.postForm = new FormGroup({
      category: this.category,
      title: this.title
    })
  }

  public handleEvent(childData: any) {
    this.selectedItems = childData;
  }

}
