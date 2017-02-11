export default class DashboardAppbarController {
    constructor(AuthenticationService, $state, $location, $mdSidenav, $rootScope) {
      'ngInject';
      

      this.$state = $state;
      this.$location = $location;
      this.$rootScope = $rootScope;

      this.title = $state.current.title;
      
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
    
    /**
    * @name submitForm
    * @desc Submits a given form using the form id
    * @param {object} id The user data entered by the user
    * @returns {Promise}
    * @memberOf doxa.registration.controller
    */
    submitForm(id) {
        // if no form id given, use the first form in the content area
        if ( ! id ) {
            id = $('form')[0].id;
        }
        
        console.log('submitting-form ' + id);
        
        this.$rootScope.$broadcast('submit-form',{'id':id} );
    }
    
    /**
     * @name goBack
     * @desc Return to previous page
     * @memberOf doxa.dashboard.controllers.appbar
     **/
    goBack() {
        //var destination = $('form').attr('go-back');
        //if ( destination ) {
        //    console.log('Going to '+destination);
        //    this.$state.go(destination);
        //    
        //}
        //else {
            window.history.back();
        //}
        
    }
}