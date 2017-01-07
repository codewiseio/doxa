class SidenavController {
    constructor() {
      'ngInject';
      
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
                label: 'Contacts',
                type: 'link',
                icon: 'people',
                state: ''
            },
        ];

    }
  
    
}


export default SidenavController;