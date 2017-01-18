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
        console.log('Registeration Service');
        console.log(organization);
        console.log(user);
        
        // create new user and organization
        return this.$http.post('/api/v1/register/', {'user': user, 'organization': organization} );

    }
}