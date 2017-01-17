class DashboardController {
  constructor(AuthenticationService, $state, $location) {
    'ngInject';
    
    this.title = $state.current.title;    
    this.errors = [];
    
  }
}


export default DashboardController;