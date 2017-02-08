class FooController {
  constructor( FooService, $stateParams ) {
    'ngInject';
    
    this.FooService = FooService;
    this.$stateParams = $stateParams;
    
    console.log( $stateParams );
    
    if ( this.$stateParams.id ) {
      this.FooService.get(this.$stateParams.id)
        .then(
           (response) => {
            this.item = response.data;
           }
          );
                                                                ;
    }
    else {
      this.item = {};
    }
    

  }
  
  save() {
      this.FooService.save(this.item).then(
          (response) => {
            console.log('Saved data');
            console.log(response);
          },
          (err) => {
            console.log('Error saving data.');
            console.log(err);
          }
      );
    }
  
}


export default FooController;