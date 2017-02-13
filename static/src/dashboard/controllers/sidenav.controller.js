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
        ];

    }

    closeSidenav() {
        this.$mdSidenav('dashboard-sidenav').close();
    }
  
    
}


export default SidenavController;