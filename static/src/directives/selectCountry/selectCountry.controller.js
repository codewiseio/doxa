import options from './countries.json';

export default class SelectCountryController {
  constructor($parse, $attrs, $scope) {
    'ngInject';
        
    this.options = options;
    this.selectedItem  = null;
    this.searchText    = null;
    
    this.$parse = $parse;
    this.$attrs = $attrs;
    this.$scope = $scope;    
    
    this.errors = [];
  }
  
  /*
   * Search through list of countries
   * */
  querySearch(query) {

    // create filter
    var lowercaseQuery = angular.lowercase(query);

    var filter = function filterFn(item) {
      return item.display.toLowerCase().indexOf(lowercaseQuery) >= 0;
    };
    var results = query ? this.options.filter( filter ) : this.options;

    return new Promise ( function(resolve,reject) {
      resolve(results);
    });
  }

  selectedItemChange(item) {
    var modelGetter = this.$parse(this.$attrs.ngModel);
    var modelSetter = modelGetter.assign;
    if ( item ) {
      modelSetter(this.$scope.$parent, item.display);
      console.log(this.selectedItem);
    }

  }

  
}
