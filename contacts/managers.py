from .serializers import ContactSerializer
from .models import Contact

class ContactManager():
    
    def postaddress(owner=None,street=None,municipality=None,region=None,postcode=None,country=None,label=None,type=None,subtype=None,primary=False):
        return {
            'kind':'postal-address',
            
            'owner':owner,
            'label':label,
            'type':type,
            'subtype':subtype,
            'primary':primary,
            
            'data1':street,
            'data2':municipality,
            'data3':region,
            'data4':postcode,
            'data5':country
        }
    
    def email(owner,address,label=None,type=None,subtype=None,primary=False):
        return {
            'kind': 'email',
            'owner':owner,
            'label':label,
            'type':type,
            'subtype':subtype,
            'primary':primary,
            'data1':address
        }
    
    def telephone(owner,address,label=None,type=None,subtype=None,primary=False):
        return {
            'kind' : 'telephone',
            'owner':owner,
            'label':label,
            'type':type,
            'subtype':subtype,
            'primary':primary,
            'data1':address
        }
    
    def kind_to_generic(data):
        
        output = {
            'id':data.get('id'),
            'owner':data.get('owner'),
            'label':data.get('label'),
            'type':data.get('type'),
            'subtype':data.get('subtype'),
            'primary':data.get('primary')
        }
        
        if data.get('kind') == 'postaddress':
            output['data1'] = data.get('street');
            output['data2'] = data.get('municipality');
            output['data3'] = data.get('region');
            output['data4'] = data.get('postcode');
            output['data5'] = data.get('country');
        elif data.get('kind') == 'telephone':
            output['data1'] = data.get('address');
        elif data.get('kind') == 'email':
            output['data1'] = data.get('address');
        else:
            raise StorageException("Invalid kind of contact ({})".format(data.get('kind')));
        
        return output;
    
    def save(data):
        generic_data = ContactManager.kind_to_generic( data )
        if data.get('id'):
            instance = Contact.objects.get(pk=generic_data.get('id'))
            serializer = ContactSerializer(instance, data=generic_data, partial=True)
        else:
            serializer = ContactSerializer(data=generic_data)
        
        # update data
        if serializer.is_valid():
            object = serializer.save()
            return object.serialize();
        else:
            raise StorageException( 'Error saving item to database', serializer.errors )
