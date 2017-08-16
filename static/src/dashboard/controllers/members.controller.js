
import ListViewController from '../../common/list.view.controller.js';
export default class DashboardMembersController extends ListViewController {
  constructor(AppDataService, DashboardMemberService, $cookies, $state, $scope, $stateParams, $mdDialog, $mdToast) {
    'ngInject';

    super();

    this.DashboardMemberService = DashboardMemberService;
    this.$mdToast = $mdToast;
    this.$mdDialog = $mdDialog;
    this.$scope = $scope;

    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$cookies = $cookies;
    
    this.context = "dashboard.members";
    this.errors = [];

    this.AppDataService = AppDataService
    this.AppDataService.pageTitle = `Members`;

    this.items = [];
    this.selectedItems = [];
    this.allItemsSelected = false;

    console.log(this.$scope);

    var $this = this;
    this.$scope.$watch('$ctrl.selectedItems', function (newValue, oldValue, scope) {
        $this.checkAllItemsSelected();
    }, true);
    this.$scope.$watch('$ctrl.items', function (newValue, oldValue, scope) {
        $this.checkAllItemsSelected();
    }, true);
    
    this.initPage();    
  }
  

  /**
   * Retrieves the currently active organization as an object.
   */
  initPage() {
    // get currently set organization
    let id = this.$stateParams.id;
    this.organization = this.AppDataService.organization;
    this.refreshResults();
  }

  refreshResults() {
    console.log('refreshing');

    var params = this.getFilterParams();

    // Retrieve record data
    this.DashboardMemberService.list( this.organization.id, params ).then(
        (response) => {
          console.log('retrieved members: ',response.data)
          this.items = response.data;
        },
        (err) => {
          var toast = this.$mdToast.simple()
            .textContent(error.data.message)
            .position('bottom center')
            .parent();

          this.$mdToast.show(toast);
        }
    );   
  }
      

  /**
   * Opens a dialog to edit member.
   * @param  {object} $item   The item to be edited
   * @param  {event} $event   The event triggering the dialog to open
   */
  new(item=null, $event=null) {

    if ( ! item ) item = { person: {}, organization_id: this.AppDataService.organization.id, role: 'Member' };

    return this.$mdDialog.show({
          controller: 'DashboardMemberDialogController as $ctrl',
          templateUrl: 'dashboard.member.dialog.edit.html',
          locals: { "item": item },
          clickOutsideToClose:true,
          fullscreen: true,
          parent: angular.element(document.body),
          targetEvent: $event
        })
        .then(
          (item) => {

            // if and item was returned the action completed successfuly
            if ( item ) {
              console.log('Members Controller Received edited item:')
              console.log(item);

              // add it to the beginning of list
              this.items.unshift(item);

              // notify the user
              var toast = this.$mdToast.simple()
                .textContent("New member created" )
                .position('bottom center')
                .parent();
              this.$mdToast.show(toast);
            }
        }, (error) => {
            console.log('error');
        });
  }

  /**
   * Opens a dialog to edit member.
   * @param  {object} $item   The item to be edited
   * @param  {event} $event   The event triggering the dialog to open
   */
  edit(item, $event=null) {

    $event.stopPropagation();
    // $event.preventDefault();
    


    return this.$mdDialog.show({
          controller: 'DashboardMemberDialogController as $ctrl',
          templateUrl: 'dashboard.member.dialog.edit.html',
          locals: { "item": item },
          clickOutsideToClose:true,
          fullscreen: true,
          parent: angular.element(document.body),
          targetEvent: $event
        })
        .then(
          (item) => {

            // if and item was returned the action completed successfuly
            if ( item ) {
              console.log('Members Controller Received edited item:')
              console.log(item);

              // add it to the beginning of list
              // this.items.unshift(item);

              // notify the user
              var toast = this.$mdToast.simple()
                .textContent(" Member Updated" )
                .position('bottom center')
                .parent();
              this.$mdToast.show(toast);
            }
        }, (error) => {
            console.log('error');
        });
  }

  view(item, $event) {
    this.$mdDialog.show({
      templateUrl: 'dashboard.member.dialog.view.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      controller: 'DashboardMemberDialogController as $ctrl',
      clickOutsideToClose:true,
      fullscreen: true,
      locals: {
        "item": item
      }
    })
    .then(function(answer) {
        console.log(answer);
    }, function() {
        console.log('canceled');
    });
  }

  delete(item, event) {
      var confirm = this.$mdDialog.confirm()
        .title(`Really delete ${item.person.first_name} ${item.person.last_name}?`)
        .textContent('This is permanent.')
        .ariaLabel('Really delete?')
        .targetEvent(event)
        .ok('Yes')
        .cancel('No');

      this.$mdDialog.show(confirm).then(
        () => {
          this._deleteItem(item);

        }
      );
  }

  _deleteItem(item) {
    this.DashboardMemberService.delete(item.person.id).then(
      (response) => {
          this.$mdDialog.hide();

          var toast = this.$mdToast.simple()
              //.textContent(`Deleted ${item.person.first_name} ${item.person.last_name}`)
              .textContent(`Deleted Successfully`)
              .position('bottom center')
              .parent();
          this.$mdToast.show(toast);

          $(`#member-${item.id}`).remove();
          console.log($(`#member:${item.id}`));
        },
      (error) => {
            //console.log('Could not add member to group.')
            var message = error.data.message;
            var toast = this.$mdToast.simple()
              .textContent(message)
              .position('bottom center')
              .parent();
            this.$mdToast.show(toast);
          }
    );
  }

  cancel() {
    console.log('Canceled');
    this.$mdDialog.cancel();
  }

  

  /**
  *Remove all or selected members collectively
  */
  removeMembers(items,event){
    var confirm = this.$mdDialog.confirm()
      //.title(`Really delete ${item.entity.first_name} ${item.entity.last_name}?`)
      .title(`Really delete all selected members ?`)
      .textContent('This is permanent.')
      .ariaLabel('Really delete?')
      .targetEvent(event)
      .ok('Yes')
      .cancel('No');

    this.$mdDialog.show(confirm).then(
      () => {
        this.DashboardMemberService.removeMembers(items,this.organization.id).then(
          (response) => {
            console.log('response',response)
              this.items = response.data;
              var toast = this.$mdToast.simple()
                .textContent('Deleted successfully')
                .position('bottom left')
                .parent();
                this.$mdToast.show(toast);
          },
          (err) => {
            var toast = this.$mdToast.simple()
            .textContent('error')
            .position('bottom left')
            .parent();
            this.$mdToast.show(toast);
          }
        ); 
      }
    );
  }

}