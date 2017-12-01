
class InitialFilter {
  
  static filter( value ){
  	if(value != undefined){
    	return value ? '' : value.trim().charAt(0).toUpperCase();
  	}
  }
  
}

export default InitialFilter.filter;