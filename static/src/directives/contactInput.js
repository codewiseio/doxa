//@require "./html/*.html"
import angular from 'angular';
require( "./html/CompoundInput.html");

class CompoundInputController {
  constructor($parse, $attrs, $scope) {
    'ngInject';
    
    this.$parse = $parse;
    this.$attrs = $attrs;
    this.$scope = $scope;    
    
    this.errors = [];
  }
}

class CompoundInput {
    constructor ($ngModel) {
        'ngInject';

        this.restrict = 'E';
        this.templateUrl = 'CompoundInput.html';
        this.require = '?ngModel';
        this.controller = "CompoundInputController as $ctrl";
        this.scope = { ngModel: '=' };


    }


    link($scope, $element, $attrs, ngModel) {

        // console.log($scope);
        // console.log($attrs);

        var modelGetter = $scope.$ctrl.$parse($attrs.ngModel);
        var modelSetter = modelGetter.assign;
        // console.log( modelGetter );
        

        $scope.$watch("$ctrl.value", function(newval) {
            console.log('Value changed.');
            console.log(newval);
            console.log( modelSetter($scope, newval) );
        });
          
    }

    // Create an instance so that we can access this inside link
    static factory() {
        CompoundInput.instance = new CompoundInput();
        return CompoundInput.instance;
    }
}



angular
    .module('doxa.directives.CompoundInput', [])
    .controller('CompoundInputController', CompoundInputController )
    .directive('CompoundInput', CompoundInput.factory )
    .name;