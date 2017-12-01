import angular from 'angular';

import taskWidget from './task.widget.directive.js';
import TaskWidgetController from './task.widget.controller.js';

export default angular
                .module('doxa.directives.taskWidget', [])
                .controller('TaskWidgetController', TaskWidgetController )
                .directive('taskWidget',taskWidget.factory )
                .name;