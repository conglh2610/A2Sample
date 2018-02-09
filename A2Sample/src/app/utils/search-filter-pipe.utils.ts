import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchfilter'
})

@Injectable()
export class SearchFilterPipe implements PipeTransform {
  transform(items: any[], value: string,  field: string, parentValue: string): any[] {

    if (value) {
      items = items.filter(function (el) {
        return el.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
      }.bind(this));
    }

    if (!items) return [];
    if (field == "region") {
      var lstRegions = [];
      for (let itmRegion of items) {
        if (lstRegions.filter(t=>t.name == itmRegion.region).length < 1) {
          lstRegions.push({ "name": itmRegion.region})
        }
      }
      return lstRegions;
    }
    if (field == "country") {
      return items.filter(it => it.region == parentValue);
    }

    return items;
    
  }
}
