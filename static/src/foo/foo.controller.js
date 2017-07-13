class FooController {
    constructor( FooService, $rootScope, $timeout ) {
      'ngInject';
      
      this.FooService = FooService;
      this.$rootScope = $rootScope;
      this.item = {};   
      this.$timeout = $timeout;

    }
  
    save() {
      console.log('Save triggered');
      alert('Save triggered');
    }
    
    submitForm(id) {
        // if no form id given, use the first form in the content area
        if ( ! id ) id = $('form')[0].id;
        this.$rootScope.$broadcast('submit-form',{'id':id} );
    }
  
}


export default FooController;