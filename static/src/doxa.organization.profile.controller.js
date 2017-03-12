
/**
 * Organization Profile
 */
export default class OrganizationProfileController {

    /**
     * Instantiate object
     * @param  {obj} Organization Organization service
     * @param  {obj} $state       Angular $state service
     */
    constructor( Organization, $state ) {
        'ngInject';

        this.context = 'organization.profile';
        this.Organization = Organization;

        /* Fetch organization based on given id or slug */
        Organization.get($state.params.slug).then( 
            (response) => {
                this.organization = response.data;
            },
            (error) => {
                // Doxa.fatalError('Could not retrieve organization.');
                console.log('Could not retrieve organization data.');
                console.log(error);
            }
        );
    }




}