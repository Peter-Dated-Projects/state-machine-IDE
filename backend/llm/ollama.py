
import ollama


class OllamaClient:
    def __init__(self, backend_ip: str):
        self._ip = backend_ip

        # create a client
        self._client = ollama.Client(backend_ip)
