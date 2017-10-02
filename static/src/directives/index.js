import angular from 'angular';

import externalSubmit from './form.external.submit';
import utcParser from './utcParser';

// import './contactInput';
import './selectCountry';
import './taskWidget';

export default angular
                .module('doxa.directives', [
                    'doxa.directives.selectCountry',
                    'doxa.directives.taskWidget',
                ])
                .directive('externalSubmit', externalSubmit.factory )
                .directive('utcParser', utcParser )
                .name;
