import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchfilter'
})

@Injectable()
export class SearchFilterPipe implements PipeTransform {
  transform(items: any[], value: string, field: string, parentValue: string): any[] {
    if (field != "category" && value) {
      items = items.filter(function (el) {
        return el.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
      });
    }

    switch (field) {
      case "region":
        var lstRegions = [];
        for (let itmRegion of items) {
          if (lstRegions.filter(t => t.name == itmRegion.region).length < 1) {
            lstRegions.push({ "name": itmRegion.region })
          }
        }
        return lstRegions;

      case "country":
        return items.filter(it => it.region == parentValue);
      case "category":
        if (value) {
          this.filterMutipleLevel(items, value);
        }
      default:

      return items;
    }
  }

  filterMutipleLevel(list, valueSearch) {
    for (let item of list) {
      if (item.children && item.children.length > 0) {
        if (item.children.filter(t => t.children && t.children.length > 0).length > 0) {
          this.filterMutipleLevel(item.children, valueSearch);
        }
        else {

          item.children = item.children.filter(function (el) {
            return el.name.toLowerCase().indexOf(valueSearch.toLowerCase()) > -1;
          }.bind(list));
        }
      }
    }
  }
}
