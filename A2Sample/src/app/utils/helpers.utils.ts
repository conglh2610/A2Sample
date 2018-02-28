export default class Helpers {
  static rewriteParamsUrl(objCriterias: any) {
  }

  static clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  static removeItemFromArray(item, arr) {
    var index = arr.indexOf(item);
    if (index > -1) {
      arr.splice(index, 1);
    }
  }

  static emptyArray(arr): void {
    while (arr.length > 0)
      arr.splice(0, 1);
  }
}
