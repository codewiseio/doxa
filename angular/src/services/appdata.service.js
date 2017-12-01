export default class AppDataService {
   constructor() {
      'ngInject';
      
      this.pageTitle = "Testing";
      this.pageType = 'component';
      this._bindings = { 'get':[], 'set':[] };
   }

   enumerate(list) {
      var returnList = {}
      list.forEach( function(item) {
         returnList[item.value] = item.label;
      });
      return returnList;
   }


   // set(key,value) {
   // 		this.trigger('set',this[key],value);
   // 		return this[key] = value;
   // }

   // get(key,value) {
   // 		let returnValue = null
   // 		if ( this.hasOwnProperty(key) ) {
   // 			returnValue = this[key];
   // 		}
   // 		else {
   // 			returnValue = value;
   // 		}
   // 		this.trigger('get',key,returnValue);
   // }

   // bind(action,func,args) {
   // 		this._bindings[action].append( [func, args] );
   // }

   // trigger(action,args) {
   // 		for ( binding in this._bindings[action] ) {
   			
   // 			binding[0](args, binding[1]); 
   // 		}
   // }
   
}

