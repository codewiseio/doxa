class AppbarController {
    constructor(AuthenticationService, $state, $location, $mdSidenav) {
      'ngInject';
      
      this.title = 'Doxa Dashboard';
      this.$state = $state;
      this.$location = $location;
      
      this.AuthenticationService = AuthenticationService;
      this.$mdSidenav = $mdSidenav;
    }
  
    /**
     * @name logout
     * @desc Log the user out
     * @memberOf doxa.dashboard.controllers.AppbarController
     */
    logout() {
        this.AuthenticationService.logout().then(
            () => {
                this.$location.url('/');
            },
            (err) => {
                console.log('Could not logout user.');
                console.log(err);
            }
            
        );
    }
    
    /**
     * @name toggleSidebar
     * @desc Show or hide the sidebar navigation
     * @memberOf doxa.dashboard.controllers.appbar
     * */
    toggleSidebar() {
        this.$mdSidenav('dashboard-sidenav').toggle();
    }
}


export default AppbarController;