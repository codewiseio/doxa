export default class utcParser {
    constructor (ngModel) {
        'ngInject';
        this.restrict = 'A';
        this.required = 'ngModel';

        console.log('constructor');
        console.log(ngModel);
    }
  
    link($scope, $element, $attrs, ngModel ) {      

        var $this = this;
        
        console.log('UTC Parser');
        console.log(ngModel);
    }
    
    // Create an instance so that we can access this inside link
    static factory() {
        utcParser.instance = new utcParser();
        return utcParser.instance;
    }
}

utcParser.$inject = ['$timeout'];

// export default class utcParser {
//     constructor (ngModel) {
//         'ngInject';
//         this.restrict = 'A';
//         // this.require('ngModel');
//         // this.ngModel = ngModel
//     }
  
//     // link($scope, $element, $attrs, ngModel ) {      

//     //     var parser = function (val) {
//     //         val = moment.utc(val).format();
//     //         return val;
//     //     };

//     //     var formatter = function (val) {
//     //         if (! val) {
//     //             return val;
//     //         }
//     //         val = moment(val).toDate();
//     //         return val;
//     //     };

//     //     ngModel.$parsers.unshift(parser);
//     //     ngModel.$formatters.unshift(formatter);
//     // }
    
//     // Create an instance so that we can access this inside link
//     factory() {
//         utcParser.instance = new utcParser();
//         return utcParser.instance;
//     }
// }





