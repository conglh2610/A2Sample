import { Component, EventEmitter, OnInit, ModuleWithProviders, OnChanges, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchFilterPipe } from '../utils/search-filter-pipe.utils';
import * as $ from 'jquery';
@Component({
  selector: 'auto-complete',

  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css']
})
export class AutoCompleteComponent implements OnChanges {
  private searchText = "";
  private filteredDataSource: Array<any>;
  @Input('dataSource') rawDataSource = [];
  @Input('placeHolder') placeHolder: string;
  @Output('itemsSelected') itemsSelected: Array<any> = [];

  constructor() {
  }

  ngOnChanges(changes) {
    this.initialDataSourceMultipleLevel(this.rawDataSource);
    this.filteredDataSource = this.clone(this.initialDataSourceMultipleLevel(this.rawDataSource));
  }

  clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  initialDataSourceMultipleLevel(raw, isKeepRaw = false) {
    //
    var result = [];
    if (!isKeepRaw) {
      this.rawDataSource = this.clone(raw);
    }
    else {
      raw.sort(function (a, b) { return (a.level > b.level) ? 1 : ((b.level > a.level) ? -1 : 0); });
    }


    for (let itemRoot of raw.filter(t => !t.parentId)) {
      itemRoot.level = 0;
      result.push(itemRoot);
      this.rawDataSource.filter(t => t.id == itemRoot.id)[0].level = itemRoot.level;
    }

    for (let itemNotRoot of raw.filter(t => t.parentId)) {
      this.addItemIntoGroup(result, itemNotRoot);
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
        element.level = item.level + 1;
        this.rawDataSource.filter(t => t.id == element.id)[0].level = element.level;
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
    var rawCloned = this.clone(this.rawDataSource);
    if (this.searchText) {
      var max = Math.max.apply(Math, rawCloned.map(function (o) { return o.level; }))
      for (var i = max; 0 <= i; i--) {
        if (i == max) {
          filterData = rawCloned.filter(function (el) {
            return (!this.searchText || el.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1) && el.level == i;
          }.bind(this));
        }
        else {
          var filterByLevel = rawCloned.filter(function (el) {
            return el.level == i;
          }.bind(this));
          for (let item of filterByLevel) {
            if (filterData.length && filterData.filter(x => x.parentId == item.id).length > 0) {
              //item.children = filterData.filter(x => x.parentId == item.id);
              item.children = [];
              filterData.push(item);
            }
            else if (item.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1) {
              item.children = [];
              filterData.push(item);
            }
          }
        }
      }

      this.filteredDataSource = this.initialDataSourceMultipleLevel(filterData, true);
    }
    else {
      this.filteredDataSource = this.initialDataSourceMultipleLevel(rawCloned);
    }
  }


  filterMutipleLevel(currentList, valueSearch) {
    // 1. if has any item in current list has at least 1 children.
    if (currentList.filter(lst => lst.children && lst.children.length > 0).length > 0) {
      // 1.1 check existing children of each item in the current list
      for (let item of currentList) {
        if (currentList.filter(lst => lst.children && lst.children.length > 0).length <= 0) {
          currentList = currentList.filter(function (el) {
            return el.name.toLowerCase().indexOf(valueSearch.toLowerCase()) > -1;
          }.bind(this));
        }
        //1.1.1 if has do filter mutiple level for children of of each item in the current list
        if (item.children && item.children.filter(t => t.children && t.children.length > 0).length > 0) {
          this.filterMutipleLevel(item.children, valueSearch);
        }
        else {
          if (item.children) {
            item.children = item.children.filter(function (el) {
              return el.name.toLowerCase().indexOf(valueSearch.toLowerCase()) > -1;
            }.bind(this));
          }
        }
      }

    }
    // 2. do filtering the current list
    else {
      currentList = currentList.filter(function (el) {
        return el.name.toLowerCase().indexOf(valueSearch.toLowerCase()) > -1;
      }.bind(this));
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
    $(".auto-complete-content").css("display", "block");
  }


  onItemSelected(e) {
    if (this.itemsSelected.filter(x => x.id == e.id).length == 0) {
      this.itemsSelected.push(e);
      this.rawDataSource = this.rawDataSource.filter(x => x.id != e.id);
      this.initialDataSourceMultipleLevel(this.rawDataSource);
      this.filteredDataSource = this.clone(this.initialDataSourceMultipleLevel(this.rawDataSource));
      $(".auto-complete-content").css("display", "none");
    }

  }

  removeSelectedItem(e) {
    this.itemsSelected = this.itemsSelected.filter(x => x.id != e.id);
    if (this.rawDataSource.filter(x => x.id == e.id).length == 0) {
      this.rawDataSource.push(e);
      this.initialDataSourceMultipleLevel(this.rawDataSource);
      this.filteredDataSource = this.clone(this.initialDataSourceMultipleLevel(this.rawDataSource));
    }
  }
}
