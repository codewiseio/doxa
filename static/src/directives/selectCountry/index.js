import angular from 'angular';

import selectCountry from './selectCountry.directive.js';
import SelectCountryController from './selectCountry.controller.js';

export default angular
                .module('doxa.directives.selectCountry', [])
                .controller('SelectCountryController', SelectCountryController )
                .directive('selectCountry',selectCountry.factory )
                .name;