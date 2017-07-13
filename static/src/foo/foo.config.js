require('./foo.html');

export default function FooConfig($stateProvider) {
  'ngInject';
  
    // Define the routes
    $stateProvider
      .state('foo', {
        url: '/foo',
        controller: 'FooController as $ctrl',
        templateUrl: 'foo.html'
      })
      .state('editfoo', {
        url: '/foo/:id',
        controller: 'FooController as $ctrl',
        templateUrl: 'foo.html'
      });
}
