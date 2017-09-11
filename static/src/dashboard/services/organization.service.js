import CrudService from '../../common/crud.service.js';

export default class OrganizationService extends CrudService {
 constructor($http, $cookies) {
    'ngInject';
    super();
    
    this.$http = $http;
    this.$cookies = $cookies;
    
    // Object to store our user properties
    this.current = null;

    this._plural = 'organizations';
    this._single = 'organization';
 }
   
}

