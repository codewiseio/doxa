
export default class DoxaCommon {
    
    toast(message, action) {
        var toast = this.$mdToast.simple()
          .textContent(message)
          .position('top right')
          .parent();
          
        if ( action ) {
            
          
        }
        if ( error.data['message-token'] == 'conflict-email' ) {
          toast.action('RESET YOUR PASSWORD?')
          .highlightAction(true)
          .highlightClass('md-accent');
        }
        
        this.$mdToast.show(toast);
    }

}