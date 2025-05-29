class EmptyMessageException(Exception):
    """Se lanza cuando el mensaje del usuario está vacío"""
    pass

class AIAPIException(Exception):
    """Se lanza cuando falla la API de IA"""
    pass