export default class externalSubmit {
    constructor ($timeout) {
        'ngInject';
        this.restrict = 'A';
        this.scope = {};
        this.$timeout = $timeout;

        // console.log('Timeout');
        // console.log( $timeout );
        // $timeout( function() {
        //     alert('timeout');
        // }, 0 );
    }
  
    link($scope, $element, $attrs, $ctrl ) {      

        var $this = this;
        
        $scope.$on('submit-form', function(event, data){
            
            
            if( data.id === $attrs.id ) {
              let formName = $attrs.name;

              setTimeout(function() {
                
                var $formScope = angular.element($element).scope();
                var $formController = $formScope[formName];
                $formController.$setDirty();
                $formController.$setSubmitted();
                angular.forEach($formController.$error.required, function(field) {
                    field.$setDirty();
                });

                if ( $formController.$valid ) {
                    $element.triggerHandler('submit');
                }

                $scope.$apply();
                
              }, 0);   
            }
        });
    }
    
    // Create an instance so that we can access this inside link
    static factory() {
        externalSubmit.instance = new externalSubmit();
        return externalSubmit.instance;
    }
}



