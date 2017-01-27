export default class externalSubmit {
    constructor ($timeout) {
        'ngInject';
        this.$timeout = $timeout;
        this.restrict = 'A';
        this.scope = {};
    }
  
    link($scope, $element, $attrs, $ctrl) {
        $scope.$on('submit-form', function(event, data){
            if( data.id === $attrs.id ) {
              setTimeout(function() {
                $element.triggerHandler('submit'); 
              }, 0);   
            }
        });
    }
    
    // Create an instance so that we can access this inside link
    static factory() {
        externalSubmit.instance = new externalSubmit();
        return externalSubmit.instance;
    }
};

