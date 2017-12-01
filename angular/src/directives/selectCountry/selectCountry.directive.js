//@require "./*.html"

export default class selectCountry {
    constructor ($ngModel) {
        'ngInject';

        this.restrict = 'E';
        this.templateUrl = 'selectCountry.html';
        this.require = '?ngModel';
        this.controller = "SelectCountryController as $ctrl";
        this.scope = { ngModel: '=', required: '=' };


    }
  
    link($scope, $element, $attrs, $ctrl) {
        if ( $attrs.required === undefined ) {
            $scope.$ctrl.required = false;
        }
        else {
            $scope.$ctrl.required = true;
        }
        
        
        $scope.$parent.$watch(
          $attrs.ngModel,
          function (newValue, oldValue) {
            if ( newValue ) {
                $scope.$ctrl.selectedItem = { 'value': newValue, 'display': newValue };
            }
            else {
                $scope.$ctrl.selectedItem = null;
            }
          }
        );   
    }

    
    // Create an instance so that we can access this inside link
    static factory() {
        selectCountry.instance = new selectCountry();
        return selectCountry.instance;
    }
}

