from django.test import TestCase
from rest_framework.test import APIRequestFactory
from rest_framework.test import APIClient

from agape.authentication.models import User


class ApplicationTestCase(TestCase):

    def setUp(self):
        self.client =  APIClient()
        self.api_end_point = '/api/v1/'

        # create a new super user
        user = User.objects.create(email="admin@example.com")
        user.set_password('password')
        user.save();

    def test_register_user_and_organization(self):
        
        data = {
            'email':'test@example.com',
            'password': 'password',
            'person': { 
                    'first_name': 'Elvis',
                    'last_name': 'Presley'
                },
            'organization': {
                    'name': 'Umbrella Corporation'
                },
        }
        response = self.client.post('/api/v1/users/', data );
        self.assertEqual(response.status_code, 201);

    # def test_create_new_organization(self):

    #     # register organization (unathorized)
    #     response = self.client.post('/api/v1/organizations/', {'name':'Umbrella Corporation'} )
    #     self.assertEqual(response.status_code, 403, "Unauthorized to create new organization")

    #     # login as super administrator
        

    #     # register organization (authorized)
    #     response = self.client.post('/api/v1/organizations/', {'name':'Umbrella Corporation'} )
    #     self.assertEqual(response.status_code, 200, "Successfully created new organization")
        
    
    # def update_organization(self):

    #     # must have organization owner rights or super admin rights

    # def delete_organization(self):

    #     # must have super admin rights

 
    # def register_user(self):
    #     # register user
    #     response = self.client.post('/api/v1/users/', {'email': 'testing@example.com', 'password':'testing'})
    #     self.assertEqual(response.status_code, 201, "Created new user")
