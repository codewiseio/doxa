export default class RegistrationService {
    constructor($http) {
        'ngInject';
        
        this.$http = $http;
    }
    
    /**
    * @name registerOrganization
    * @desc Create a new organization and owner account
    * @param {object} organization The organization data entered by the user
    * @param {object} user The user data entered by the user
    * @returns {Promise}
    * @memberOf doxa.registration.service
    */
    registerOrganization(organization, user){
        console.log('Registering new organization');
        
        // create user account
        return this.$http.post('/api/v1/users/', {'email': user.email, 'password': user.password} );
        
        // create new organization
        //$http.post('/api/v1/organizations/', {'email': user.email, 'password': user.password} );
    }
}