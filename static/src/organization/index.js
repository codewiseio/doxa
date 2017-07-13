import angular from 'angular';
import OrganizationConfig from './organization.config';
import OrganizationController from './organization.controller';
import OrganizationService from './organization.service';

let organizationModule = angular.module('doxa.organization', [])
    .config(OrganizationConfig)
    .controller('OrganizationController', OrganizationController)
    .service('OrganizationService', OrganizationService );


export default organizationModule;