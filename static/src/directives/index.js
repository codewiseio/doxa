import angular from 'angular';

import externalSubmit from './form.external.submit';

import utcParser from './utcParser';

// import './contactInput';
import './selectCountry';

export default angular
                .module('doxa.directives', [
                    'doxa.directives.selectCountry',
                ])
                .directive('externalSubmit', externalSubmit.factory )
                .directive('utcParser', utcParser.factory )
                .name;
                
                