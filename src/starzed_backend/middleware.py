"""
Custom middleware for the starzed_backend project.
"""


class DisableCSRFForAPI:
    """
    No-op middleware. CsrfViewMiddleware has been removed from the
    middleware stack since this is a pure JSON API backend consumed by
    a React frontend — no Django templates or CSRF tokens are used.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)
