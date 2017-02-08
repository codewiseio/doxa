class HttpException(Exception):
    
    """Exceptions with HTTP status codes."""
    def __init__(self, response, status):
        self.response = response
        self.status = status

class StorageException(Exception):
    
    """Exceptions thrown when storing an object to the database."""
    def __init__(self, message, errors):
        self.message = message
        self.errors = errors