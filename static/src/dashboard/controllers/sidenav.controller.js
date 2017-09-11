class SidenavController {
    constructor($state) {
      'ngInject';

        this.$state = $state;

        this.menuItems = [
            {
                label: 'Dashboard',
                type: 'link',
                icon: 'dashboard',
                state:"dashboard.home()"
            },
            {
                label: 'Members',
                type: 'link',
                icon: 'face',
                state: 'dashboard.members()'
            },
            {
                label: 'Groups',
                type: 'link',
                icon: 'group',
                state: 'dashboard.groups()'
            },
            {
                label: 'Events',
                type: 'link',
                icon: 'event',
                state: 'dashboard.events()'
            }
        ];
    }
  
    /**
     * Check if a menu item is currently active by comparing to the current state
     * @param  {Object} Menu item to check 
     * @return {String} Returns 'active' if true, empty string if false
     */
    isActive(item) {
        return this.$state.current.name == item.state.replace(/\(.*\)/, '') ? 'active' : '';
    }
    
}


export default SidenavController;