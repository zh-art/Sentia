from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


@patch("services.chat_service.actualizar_temporizador_usuario")
def test_configurar_temporizador_usuario(mock_update):
    response = client.put("/chat/123/timer", json=15)
    assert response.status_code == 200
    assert "message" in response.json()


@patch("services.chat_service.handle_generate_response", new_callable=AsyncMock)
def test_generate_response(mock_handle):
    mock_handle.return_value = {"response": "Hola, ¿cómo estás?"}
    response = client.post("/chat/generate", json={"user_id": "123", "message": "Hola"})
    assert response.status_code == 200
    assert "response" in response.json()


@patch("services.chat_service.obtener_historial")
def test_obtener_historial(mock_historial):
    mock_historial.return_value = [{"user": "hola", "bot": "hola"}]
    response = client.get("/chat/historial/123")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@patch("services.rag_service.answer_with_context")
def test_chat_rag(mock_answer):
    mock_answer.return_value = "respuesta contextual"

