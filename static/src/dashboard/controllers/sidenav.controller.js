class SidenavController {
    constructor($mdSidenav) {
      'ngInject';

        this.$mdSidenav = $mdSidenav;
      
        this.menuItems = [
            {
                label: 'Dashboard',
                type: 'link',
                icon: 'dashboard',
                state:"dashboard.home()"
            },
            {
                label: 'Organization',
                type: 'link',
                icon: 'domain',
                href: '/dashboard/organization',
                state:"dashboard.organization()"
            },
            {
                label: 'Members',
                type: 'link',
                icon: 'people',
                state: 'dashboard.members()'
            },
            {
                label: 'Groups',
                type: 'link',
                icon: 'group',
                state: 'dashboard.groups()'
            },
        ];

    }

    closeSidenav() {
        this.$mdSidenav('dashboard-sidenav').close();
    }
  
    
}


export default SidenavController;