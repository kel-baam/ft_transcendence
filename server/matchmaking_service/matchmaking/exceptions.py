# exceptions.py

class CustomAPIException(Exception):
    """
    A custom exception for handling API errors.
    """
    def __init__(self, message, code=None):
        self.message = message
        self.code = code or 400  # Default to HTTP 400 Bad Request if no code is provided
        super().__init__(self.message)

    def to_dict(self):
        """
        Optionally convert the exception to a dictionary for better error response.
        """
        return {"error": self.message, "code": self.code}
