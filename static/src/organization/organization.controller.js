export default class OrganizationController {
  constructor(AuthenticationService, OrganizationService, $rootScope, $state, $mdToast ) {
    'ngInject';

    console.log($state);
    
    this.$state = $state;    
    this.errors = [];
    
    // if the user is not authenticated they should not be here
    // if ( ! AuthenticationService.isAuthenticated() ) {
    //     $location.url('/login');
    // }

    this.$rootScope = $rootScope;
    $rootScope.debug = true;

    // get the organization we are viewing
    console.log( `Retrieving organization ${$state.params.slug}` );
    this.organization = OrganizationService.get( $state.params.slug, {
            "context": "organization.profile",
            "user": $rootScope.user ? $rootScope.user.id : null
        } )
        .then(
            (response) => {
                this.organization = response.data;
                if ( $rootScope.debug ) {
                    console.log('Received organization data');
                    console.log(response.data);
                }
            },
            (error) => {
                if ( $rootScope.debug ) {
                    console.log('Error retrieving organization data');
                    console.log(response);
                }
            }
        );

    

    // get the users membership status for this organization
    // this.membership = MembershipService.getMembershipStatus( $organization, $rootScope.user );




  }
  
}
