import angular from 'angular';

class Filters {
  
  static initial( value ){
    if(value != undefined){
      return value ? '' : value.trim().charAt(0).toUpperCase();
    }
  }

  static toLowerCase( value ) {
    if(value != undefined ){
      return value.toLowerCase();
    }
  }
}

export default angular
                .module('doxa.filters', [ ])
                .filter('InitialFilter', () => Filters.initial )
                .filter('toLowerCase', () => Filters.toLowerCase )
                .name;
                
                