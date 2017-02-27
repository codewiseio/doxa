export default function utcParser() {

    function link(scope, element, attrs, ngModel) {


        console.log('link');
        console.log(ngModel);
        /**
         * Converts a DateTime to a string
         * @param  {DateTime} val String representing a date time
         * @return {str}  
         */
        var parser = function (val) {
            console.log('Parse called.');
            val = moment.utc(val).format();
            return val;
        };

        /**
         * Converts string to date time object
         * @param  {str} val String representing a date time
         * @return {DateTime} 
         */                 
        var formatter = function (val) {
            console.log('Format called.');
            console.log(val);
            if (! val) {
                return null;
            }
            val = moment(val).toDate();
            console.log('Formatted');
            console.log(val);
            return val;
        };

        ngModel.$parsers.unshift(parser);
        ngModel.$formatters.unshift(formatter);
    }

    return {
        require: 'ngModel',
        link: link,
        restrict: 'A'
    }
}



// export default class utcParser {
//     constructor (ngModel) {
//         'ngInject';
//         this.restrict = 'A';
//         this.required = 'ngModel';

//         console.log('constructor');
//         console.log(ngModel);
//     }
  
//     link($scope, $element, $attrs, ngModel ) {      

//         var $this = this;
        
//         console.log('UTC Parser');
//         console.log(ngModel);
//     }
    
//     // Create an instance so that we can access this inside link
//     static factory() {
//         utcParser.instance = new utcParser();
//         return utcParser.instance;
//     }
// }

// utcParser.$inject = ['$timeout'];

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





