import pytest
from unittest.mock import patch, AsyncMock
from types import SimpleNamespace
from services.chat_service import handle_generate_response


@pytest.mark.asyncio
@patch("services.chat_service.guardar_chat")
@patch("services.chat_service.obtener_configuracion_temporizador_usuario")
async def test_handle_generate_response_welcome(mock_config, mock_guardar):
    # Simular request tipo "welcome"
    mock_config.return_value = {"enabled": True, "duration": 10}
    request = SimpleNamespace(json=AsyncMock(return_value={
        "user_id": "123", "message": "Hola", "type": "user", "message_type": "normal"
    }))

    response = await handle_generate_response(request)
    assert "response" in response
    assert "Hola" in response["response"]
    mock_guardar.assert_called_once()


@pytest.mark.asyncio
@patch("services.chat_service.obtener_historial")
@patch("services.chat_service.guardar_chat")
async def test_handle_generate_response_normal(mock_guardar, mock_historial):
    mock_historial.return_value = [{"message": "Hola", "response": "Hola", "message_type": "normal"}]

    request = SimpleNamespace(json=AsyncMock(return_value={
        "user_id": "123", "message": "¿Cómo estás?", "type": "user", "message_type": "normal"
    }))

    response = await handle_generate_response(request)
    assert isinstance(response, dict)
    assert "response" in response


@pytest.mark.asyncio
async def test_handle_generate_response_missing_fields():
    request = SimpleNamespace(json=AsyncMock(return_value={
        "message": "Falta user_id"
    }))

    with pytest.raises(Exception) as exc:
        await handle_generate_response(request)
    assert "Faltan campos requeridos" in str(exc.value)
