class HttpException(Exception):
    
    """Exceptions with HTTP status codes."""
    def __init__(self, response, status):
        self.response = response
        self.status = status
