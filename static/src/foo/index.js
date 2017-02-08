import angular from 'angular';

import FooConfig from './foo.config';

import FooController from './foo.controller';
import FooService from './foo.service';

let fooModule = angular.module('doxa.foo', [])
    .config(FooConfig)
    .controller('FooController', FooController)
    .service('FooService',FooService);

export default fooModule;