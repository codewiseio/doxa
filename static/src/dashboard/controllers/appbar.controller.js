export default class DashboardAppbarController {
    constructor(AuthenticationService, AppDataService, $scope, $state, $location, $mdSidenav, $mdDialog, $rootScope) {
      'ngInject';
      

      this.$state = $state;
      this.$location = $location;
      this.$rootScope = $rootScope;
      this.$mdDialog = $mdDialog;

      this.AuthenticationService = AuthenticationService;
      this.$mdSidenav = $mdSidenav;

      // Watch changes to the page title and update appbar title
      this.AppDataService = AppDataService;
      $scope.$watch( '$ctrl.AppDataService.pageTitle',
        function (newValue) {
          $scope.$ctrl.title = newValue;
        }
      ); 
      this.title = AppDataService.pageTitle;

      $scope.$watch( '$ctrl.AppDataService.pageType',
        function (newValue) {
          $scope.$ctrl.mode = newValue;
        }
      ); 
      this.mode = AppDataService.pageType ?  AppDataService.pageType : 'dashboard';


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

    editAccount(item, $event) {
      this.$mdDialog.show({
        templateUrl: 'dashboard.user.edit.html',
        parent: angular.element(document.body),
        targetEvent: $event,
        controller: 'UserController as $ctrl',
        clickOutsideToClose:true,
        fullscreen: true,
        locals: {
          "item": item
        }
      })
      .then(function(answer) {
          console.log(answer);
      }, function() {
          console.log('canceled');
      });
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