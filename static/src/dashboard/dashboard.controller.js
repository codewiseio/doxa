class DashboardController {
  constructor(AuthenticationService, AppDataService, $cookies, $rootScope, $state) {
    'ngInject';

    this.AppDataService = AppDataService
    this.AppDataService.pageType = 'dashboard';
    this.AppDataService.pageTitle = `Dashboard`;

    // If the user is not authenticated they should not be here
    if (! AuthenticationService.isAuthenticated()) {
        $state.go('login');
    }

    // Get the active organization using cookie
    this.AppDataService.user = $rootScope.user = JSON.parse($cookies.get('authenticatedAccount'));
    this.AppDataService.organization = $rootScope.organization = JSON.parse($cookies.get('organization'));
  }

}


export default DashboardController;