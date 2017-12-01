//import 'bootstrap/dist/css/bootstrap.css';


import angular from 'angular';
import routing from './doxa.config';
import angularui from 'angular-ui';
import uirouter from 'angular-ui-router';
import ngCookies from 'angular-cookies';

import 'arrive';
import 'angular-animate';
import 'angular-aria';
import 'angular-material';
import 'angular-material/angular-material.css';
import 'angular-file-upload';
import 'angular1-star-rating';
import 'angular-material-picker';
import relativeDate from 'angular-relative-date'
import 'moment';
import 'ng-material-datetimepicker';
import 'ng-material-datetimepicker/css/material-datetimepicker.css';

// import 'roboto-fontface/css/roboto/sass/roboto-fontface-regular.scss';
// import 'roboto-npm-webfont';
import ngMessages from 'angular-messages';

import 'jquery';
import 'bootstrap-loader';
import 'angular-bootstrap-datetimepicker';

import './directives/index';
import './filters';


require('font-awesome/css/font-awesome.css');
require("./assets/css/material-dashboard.css");
require("./assets/css/jquery.dropdown.css");
require('./assets/css/default.less');

import './lib/sweetalert';

/* Application Components*/
import AppDataService from './services/appdata.service';
import OrganizationService from './services/organization.service';
import MemberService from './services/member.service';
import EventService from './services/event.service';
import GroupService from './services/group.service';
import GuestService from './services/guest.service';
import UserService from './services/user.service';
import TaskService from './services/task.service';

import EventsController from './controllers/events';
import EventController from './controllers/event';
import EventEditDialogController from './controllers/event.edit.dialog';
import EventGuestInviteController from './controllers/event.guest.invite';
import EventGuestListController from './controllers/event.guest.list';


import GroupController from './controllers/group';
import GroupsController from './controllers/groups';
import GroupEditDialogController from './controllers/group.edit.dialog';
import GroupMembersController from './controllers/group.members';
import GroupMembersAddDialogController from './controllers/group.members.add.dialog';
import GroupMemberEditDialogController from './controllers/group.member.edit.dialog';

import MemberEditDialogController from './controllers/member.edit.dialog';
import MembersController from './controllers/members';

import OrganizationEditDialogController from './controllers/organization.edit.dialog';

import TasksController from './controllers/tasks';
import TaskEditDialogController from './controllers/task.edit.dialog';



import './authentication';
import './dashboard';
import './landing-page';
import './registration';


/* App Dependencies */
let doxa = angular.module( "doxa", [
                'ui.router',
                'ngMaterial',
                'angularFileUpload',
                'doxa.authentication',
                'doxa.dashboard',
                'doxa.landing-page',
                'doxa.registration',
                'doxa.directives',
                'doxa.filters',
                'ngMaterialDatePicker',
                'SweetAlert',
                // 'socialbase.sweetAlert',
                ngMessages,
                ngCookies,
                angularui,
                'relativeDate'
    ])
    .service('AppDataService', AppDataService )
    .service('EventService', EventService)
    .service('GroupService', GroupService)
    .service('GuestService', GuestService)
    .service('MemberService',MemberService)
    .service('OrganizationService',OrganizationService)
    .service('TaskService', TaskService)

    .controller('EventsController', EventsController)
    .controller('EventController', EventController)
    .controller('EventGuestInviteController',EventGuestInviteController)
    .controller('EventGuestListController',EventGuestListController)
    .controller('EventEditDialogController', EventEditDialogController)

    .controller('GroupController', GroupController )
    .controller('GroupEditDialogController', GroupEditDialogController )
    .controller('GroupsController', GroupsController )

    .controller('GroupMembersController', GroupMembersController)
    .controller('GroupMembersAddDialogController', GroupMembersAddDialogController)
    .controller('GroupMemberEditDialogController', GroupMemberEditDialogController)
    
    .controller('OrganizationEditDialogController', OrganizationEditDialogController)
    .controller('MembersController',MembersController)
    .controller('MemberEditDialogController', MemberEditDialogController)


    .controller('TasksController', TasksController)
    .controller('TaskEditDialogController', TaskEditDialogController)

    .config(routing);

angular.module('doxa').run();

