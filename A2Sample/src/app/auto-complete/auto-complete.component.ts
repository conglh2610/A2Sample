import { Component, EventEmitter, OnInit, ModuleWithProviders, OnChanges, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchFilterPipe } from '../utils/search-filter-pipe.utils';
import Helpers from '../utils/helpers.utils';
import * as $ from 'jquery';
@Component({
  selector: 'auto-complete',

  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css']
})
export class AutoCompleteComponent implements OnChanges {
  private searchText = "";
  private currentDataSource: Array<any>;
  private filteredDataSource: Array<any>;
  // input of raw list datasource
  @Input('dataSource') rawDataSource = [];
  // input text placeholder
  @Input('placeHolder') placeHolder: string;
  // output selected items
  @Output('itemsSelected') selectedItems: Array<any> = [];

  constructor() {
  }

  ngOnChanges(changes) {
    // clone the raw datasource
    this.currentDataSource = Helpers.clone(this.rawDataSource);
    if (this.currentDataSource.length) {
      this.filteredDataSource = this.initialDataSourceMultipleLevel();
    }

  }

  indexLevels(dataSource) {
    for (let item of dataSource) {
      item.level = this.findLevelElementInList(item, dataSource);
    }
  }

  findLevelElementInList(element, list) {
    if (element.parentId == null) {
      return 0;
    }
    else {
      var parent = list.filter(x => x.id == element.parentId)[0];
      if (parent) {
        if (parent.level != null) {
          return parent.level + 1;
        }
        else {
          debugger;
          return this.findLevelElementInList(parent, list) + 1;
        }
      }

    }
  }

  initialDataSourceMultipleLevel(data = null) {
    //
    var result = [];
    // 1. specific current datasource.
    if (data == null) {
      this.currentDataSource = Helpers.clone(this.rawDataSource);
    }
    else {
      this.currentDataSource = data;
    }
    //2. index levels
    this.indexLevels(this.currentDataSource);
    //3. sort list by level, name
    this.currentDataSource.sort(this.compare);

    //4. group by by parents/children
    //4.1 add parent group
    for (let itemRoot of this.currentDataSource.filter(t => !t.parentId)) {
      result.push(Helpers.clone(itemRoot));
    }
    // 4.2 add children group
    for (let itemNotRoot of this.currentDataSource.filter(t => t.parentId)) {
      this.addItemIntoGroup(result, Helpers.clone(itemNotRoot));
    }

    return result;
  }


  // list: [e1: {name: "Name1", ... children: [{}, {}, ...]]
  checkExistingInGroup(list, element) {
    for (let item of list) {
      if (JSON.stringify(item) == JSON.stringify(element)) {
        return true;
      }

      if (item.hasOwnProperty("children")) {
        if (this.checkExistingInGroup(item.children, element)) {
          return true;
        }
      }
    }

    return false
  }

  addItemIntoGroup(list, element) {
    for (let item of list) {
      if (element.parentId == item.id) {
        if (!item.children) {
          item.children = [];
        }
        item.children.push(element);
        return;
      }

      else if (item.hasOwnProperty("children") && item.children.indexOf(element) < 0) {
        this.addItemIntoGroup(item.children, element);
      }
    }

  }


  filterDataSource() {
    var filterData = [];
    // 1. clone and indexing levels the raw datascource for adding parent in the list filter.
    var rawCloned = Helpers.clone(this.rawDataSource);
    this.indexLevels(rawCloned);
    this.currentDataSource = Helpers.clone(rawCloned);

    // 2. filter current source by selected items
    if (this.selectedItems.length > 0) {
      this.currentDataSource = this.currentDataSource.filter(x => this.selectedItems.map(function (e) { return e.id; }).indexOf(x.id) < 0);
    }

    // 3. filter by text
    if (this.searchText) {

      // 3.1 loop by level
      var max = Math.max.apply(Math, rawCloned.map(function (o) { return o.level; }))
      for (var i = max; 0 <= i; i--) {
        // 3.2 filter leaf children.
        if (i == max) {
          filterData = this.currentDataSource.filter(x => x.level == i && x.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1);
        }
        else {
          var filterByLevel = rawCloned.filter(x => x.level == i);
          for (let item of filterByLevel) {
            if (this.selectedItems.filter(x => x.id == item.id).length < 1) {
              // 3.3 add parent do not match the filter but has children match.
              if (filterData.length && filterData.filter(x => x.parentId == item.id).length > 0) {
                item.children = [];
                filterData.push(item);
              }

              // 3.4 add item by specific levels
              else if (item.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1) {
                item.children = [];
                filterData.push(item);
              }
            }
          } 
        }
      }

      this.filteredDataSource = this.initialDataSourceMultipleLevel(filterData);
    }
    else {
      this.filteredDataSource = this.initialDataSourceMultipleLevel(this.currentDataSource);
    }
  }

  onClassChange(event) {
    var currentEl = $($(event.currentTarget)[0]).find("i")[0];
    if (currentEl.className.indexOf("fa-angle-down") > 0) {
      $(currentEl).removeClass("fa-angle-down").addClass("fa-angle-right");
      $(currentEl).css("margin-right", "4px");
    }

    else if (currentEl.className.indexOf("fa-angle-right") > 0) {
      $(currentEl).removeClass("fa-angle-right").addClass("fa-angle-down");
      $(currentEl).css("margin-right", "0");
    }

    $(".auto-complete-content").css("display", "block");
  }

  searchTextFocusOut(e) {
    if ($(e.relatedTarget).closest(".auto-complete-content").length > 0) {

    }
    else {
      $(".auto-complete-content").css("display", "none");
    }
  }
  searchTextFocusIn() {
    this.filterDataSource();
    $(".auto-complete-content").css("display", "block");
  }


  onItemSelected(e) {
    this.currentDataSource = Helpers.clone(this.rawDataSource);

    this.selectedItems.push(e);
    if (e.children && e.children.length) {
      for (let child of e.children) {
        this.selectedItems = this.selectedItems.filter(x => x.id != child.id);
      }
    }
   
    this.removeAllChildrenItems(e, this.selectedItems);
    
    for (let item of this.selectedItems) {
      this.currentDataSource = this.currentDataSource.filter(x => x.id != item.id);
    }

    this.filteredDataSource = this.initialDataSourceMultipleLevel(this.currentDataSource);
    $(".auto-complete-content").css("display", "none");
  }

  removeSelectedItem(e) {

    this.currentDataSource = Helpers.clone(this.rawDataSource);
    Helpers.removeItemFromArray(e, this.selectedItems);
    this.currentDataSource = Helpers.clone(this.rawDataSource);
    for (let item of this.selectedItems) {
      this.currentDataSource = this.currentDataSource.filter(x => x.id != item.id);
    }

    this.filteredDataSource = this.initialDataSourceMultipleLevel(this.currentDataSource);
  }

  removeAllChildrenItems(itemToRemove, list) {
    if (!list.length) {
      return;
    }
    for (var i = 0; i < list.length; i++) {
      var diffLevel = list[i].level - itemToRemove.level;
      var parent = list[i];
      if (diffLevel > 0) {
        while (diffLevel > 0) {
          parent = this.currentDataSource.filter(x => x.id == parent.parentId)[0];
          diffLevel--;
        }
        if (parent.id == itemToRemove.id) {
          Helpers.removeItemFromArray(list[i], list);
          i--;
        }
      }
    }
  }

  compare(a, b) {
    if (a.level < b.level)
      return -1;
    if (a.level > b.level)
      return 1;
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  }
}
