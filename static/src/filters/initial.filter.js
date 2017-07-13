
class InitialFilter {
  
  static filter( value ){
    return value ? '' : value.trim().charAt(0).toUpperCase();
  }
  
}

export default InitialFilter.filter;