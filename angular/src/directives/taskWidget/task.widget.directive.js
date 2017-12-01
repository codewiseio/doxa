//@require "./*.html"

export default class taskWidget {
    constructor ($ngModel,$parse) {
        'ngInject';

        this.restrict = 'E';
        this.templateUrl = 'task.widget.html';
        // this.require = '?ngModel';
        this.controller = "TaskWidgetController as $ctrl";
        this.scope = { dxTitle: '=', dxIcon: '=', dxEntity: '=', ngModel: '=', dxEntityType: '=' };
        this.$parse = $parse;

        console.log('Contstruct');
        console.log($parse);


    }
  
    link($scope, $element, $attrs, $ctrl) {

        $ctrl.refresh();
        console.log('Linking');
        console.log($scope);
        console.log($attrs);
        console.log($ctrl);
        console.log($scope.$parent.$ctrl);

        // set the title if supplied
        $ctrl.title = $attrs.dxTitle;
        $ctrl.icon  = $attrs.dxIcon;

        // set the initial value of the entity
        $ctrl.entity = $ctrl.$parse($scope.$parent.$ctrl);

        // watch changes to the parent controller and update the entity
        $scope.$parent.$watch(
          $attrs.dxEntity,
          function (newValue, oldValue) {
            if ( newValue ) {
                $scope.$ctrl.entity = newValue;
            }
            else {
                $scope.$ctrl.entity = null;
            }

            // tell the controller to update the widget contents
            $ctrl.refresh();

          }
        );   


    }

    
    // Create an instance so that we can access this inside link
    static factory() {
        taskWidget.instance = new taskWidget();
        return taskWidget.instance;
    }
}

