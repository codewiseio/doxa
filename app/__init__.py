
# def connect_user_create_callbacks():

# 	scope = {}
# 	def on_create_before(self,data):
		
# 		""" Capture additional entity data sent with the request. """
# 		for entity in ('organization','person','contacts'):
# 			scope[entity+'data'] = data.pop(entity+'data', None)

# 	def on_create_success(self,instance):
# 		""" Create entity instances from data sent with request."""

# 		# create a new organization
# 		data = scope['organization_data'].copy()
# 		data['contacts'] = scope['contacts_data']
# 		organization = agape.entity('organization').create( data )

# 		# create a new person
# 		data = scope['person_data'].copy()
# 		data['contacts'] = scope['contacts_data']
# 		person = agape.entity('person').create( data )

# 		# add this person as a member of the organization
# 		data = { 'progenitor': organization.moniker(), 'person': person, 'role': 'leader' }
# 		member = agape.entity('member').create( data )


# 		members = agape.entity('member').list('progenitor':organization.id)


# 	on('user.create:before', on_create_before)
# 	on('user.create:success', on_create_success)
# 	connect_user_create_callbacks();


# def connect_person_create_callbacks():

# 	scope = {}
# 	def on_create_before(self,data):
		
# 		""" Capture additional entity data sent with the request. """
# 		for entity in ('contacts'):
# 			scope[entity+'data'] = data.pop(entity+'data', None)


# 	def on_create_success(self,instance):
# 		""" Create entity instances from data sent with request."""

# 		# create contacts
# 		data = scope['contact_data'].copy()
# 		for contact in data:
# 			contact['progenitor'] = instance.moniker()
# 		organization = agape.entity('contact').create( data )

# 	on('person.create:before', on_create_before)
# 	on('person.create:success', on_create_success)


# connect = ContactsConnector();
# connect.to('organizations')
# connect.to('people')


# from agape.members.connector import MembersConnector

# connect = MembersConnector
# connect.to('agape.organizations')
# connect.to('agape.groups')


