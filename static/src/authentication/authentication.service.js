class AuthenticationService {
   constructor($http, $cookies) {
      'ngInject';
      
      this.$http = $http;
      this.$cookies = $cookies;
      
      // Object to store our user properties
      this.current = null;
   }
   
    /**
    * @name login
    * @desc Try to log in with the email `email` and password `password`
    * @param {string} email The email entered by the user
    * @param {string} password The password entered by the user
    * @returns {Promise}
    * @memberOf doxa.authentication
    */
    login(email,password) {
      return this.$http.post('/api/v1/auth/login/', {
         email: email, password: password
      })
      .then(
        // Callback for success
        (res) => {
            this.setAuthenticatedAccount(res.data);
         }
      );
   }
   
   /**
    * @name logout
    * @desc Try to log out the current user
    * @returns {Promise}
    * @memberOf doxa.authentication
    */
   logout() {
      return this.$http.post('/api/v1/auth/logout/')
      .then(
         // Callback on success
        () => {
            console.log('Logged out.');
            this.unauthenticate();
         }
      );
   }
    

   /**
    * @name getAuthenticatedAccount
    * @desc Return the currently authenticated account
    * @returns {object|undefined} Account if authenticated, else `undefined`
    * @memberOf doxa.authentication.services.Authentication
    */
   getAuthenticatedAccount() {
       if ( ! this.$cookies.authenticatedAccount) {
          return;
       }
       return JSON.parse(this.$cookies.authenticatedAccount);
   }
   
   /**
    * @name isAuthenticated
    * @desc Check if the current user is authenticated
    * @returns {boolean} True if user is authenticated, else false
    * @memberOf doxa.authentication.services.Authentication
    */
   isAuthenticated() {
      return !! this.$cookies.get('authenticatedAccount');
   }
   
   /**
    * @name setAuthenticatedAccount
    * @desc Stringify the account object and store it in a cookie
    * @param {Object} use The account object to be stored
    * @returns {undefined}
    * @memberOf doxa.authentication.services.Authentication
    */
   setAuthenticatedAccount(account) {
      this.$cookies.put('authenticatedAccount',JSON.stringify(account));
      return true;
   }
   
   /**
    * @name unauthenticate
    * @desc Delete the cookie where the user object is stored
    * @returns {undefined}
    * @memberOf doxa.authentication.services.Authentication
    */
   unauthenticate() {
       this.$cookies.remove('authenticatedAccount');
   }
}

//AuthenticationService.$inject['$http','$cookies'];
export default AuthenticationService;
