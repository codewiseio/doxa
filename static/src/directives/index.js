import angular from 'angular';

import externalSubmit from './form.external.submit';

import './selectCountry';

export default angular
                .module('doxa.directives', [
                    'doxa.directives.selectCountry'
                ])
                .directive('externalSubmit', externalSubmit.factory )
                .name;
                
                