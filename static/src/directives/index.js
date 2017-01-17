import angular from 'angular';

import externalSubmit from './form.external.submit';

export default angular
                .module('doxa.directives', [])
                .directive('externalSubmit', externalSubmit.factory )
                .name;