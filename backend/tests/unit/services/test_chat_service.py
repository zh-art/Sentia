import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi import HTTPException
import sys
import os

# Añadir el directorio backend al path de Python
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Fixtures mejorados para evitar duplicación
@pytest.fixture
def mock_request():
    request = MagicMock()
    request.json = AsyncMock(return_value={
        "user_id": "test_user",
        "message": "Test message",
        "type": "registered"
    })
    return request

@pytest.fixture
def mock_components():
    with patch('backend.services.chat_service.obtener_configuracion_temporizador_usuario') as mock_timer, \
         patch('backend.services.chat_service.guardar_chat') as mock_guardar, \
         patch('backend.services.chat_service.obtener_historial') as mock_historial, \
         patch('backend.services.chat_service.construir_input_con_historial') as mock_construir, \
         patch('transformers.AutoTokenizer.from_pretrained') as mock_tokenizer, \
         patch('transformers.AutoModelForCausalLM.from_pretrained') as mock_model, \
         patch('backend.services.user_service.crear_usuario_si_no_existe') as mock_crear_usuario:

        # Configuración detallada del tokenizer
        mock_tokenizer_instance = MagicMock()
        mock_tokenizer_instance.encode_plus.return_value = {
            'input_ids': MagicMock(to=MagicMock(return_value='fake_input')),
            'attention_mask': MagicMock(to=MagicMock(return_value='fake_mask'))
        }
        mock_tokenizer_instance.decode.return_value = "Respuesta mock"
        mock_tokenizer.return_value = mock_tokenizer_instance

        # Configuración detallada del modelo
        mock_model_instance = MagicMock()
        mock_output = MagicMock()
        mock_output.cpu.return_value = MagicMock()
        mock_model_instance.generate.return_value = mock_output
        mock_model.return_value = mock_model_instance

        # Resto de la configuración
        mock_timer.return_value = {"enabled": False, "duration": 0}
        mock_historial.return_value = []
        mock_guardar.return_value = None
        mock_construir.return_value = "prompt construido"
        mock_crear_usuario.return_value = None

        yield {
            'mock_timer': mock_timer,
            'mock_guardar': mock_guardar,
            'mock_historial': mock_historial,
            'mock_construir': mock_construir,
            'mock_tokenizer': mock_tokenizer_instance,
            'mock_model': mock_model_instance,
            'mock_crear_usuario': mock_crear_usuario
        }

@pytest.mark.asyncio
async def test_handle_generate_response_success(mock_request, mock_components):
    mock_request.json.return_value = {
        "user_id": "test123",
        "message": "Me siento triste hoy",
        "type": "registered"
    }

    from backend.services.chat_service import handle_generate_response
    result = await handle_generate_response(mock_request)

    assert result == {"response": "Respuesta mock"}
    mock_components['mock_tokenizer'].encode_plus.assert_called_once_with(
        "prompt construido",
        return_tensors="pt",
        padding=True,
        truncation=True,
        max_length=1024
    )
    mock_components['mock_model'].generate.assert_called_once()

@pytest.mark.asyncio
async def test_empty_message_raises_exception(mock_request):
    mock_request.json.return_value = {
        "user_id": "test123",
        "message": "",
        "type": "registered"
    }

    from backend.services.chat_service import handle_generate_response

    with pytest.raises(HTTPException) as exc_info:
        await handle_generate_response(mock_request)

    assert exc_info.value.status_code == 400
    assert "Faltan campos requeridos" in str(exc_info.value.detail)

@pytest.mark.asyncio
async def test_model_generation_failure(mock_request, mock_components):
    mock_components['mock_model'].generate.side_effect = Exception("Error en el modelo")

    from backend.services.chat_service import handle_generate_response

    with pytest.raises(HTTPException) as exc_info:
        await handle_generate_response(mock_request)

    assert exc_info.value.status_code == 500
    assert "Error generando respuesta" in str(exc_info.value.detail)
    mock_components['mock_guardar'].assert_not_called()

@pytest.mark.asyncio
async def test_anonymous_user_handling(mock_request, mock_components):
    mock_request.json.return_value = {
        "user_id": "anon123",
        "message": "Mensaje anónimo",
        "type": "anonymous"
    }

    from backend.services.chat_service import handle_generate_response

    result = await handle_generate_response(mock_request)

    assert result == {"response": "Respuesta mock"}
    mock_components['mock_historial'].assert_not_called()
    mock_components['mock_guardar'].assert_not_called()
    mock_components['mock_crear_usuario'].assert_not_called()

@pytest.mark.asyncio
async def test_user_creation_for_registered_users(mock_request, mock_components):
    mock_request.json.return_value = {
        "user_id": "new_user123",
        "message": "Mensaje nuevo usuario",
        "type": "registered"
    }

    from backend.services.chat_service import handle_generate_response

    await handle_generate_response(mock_request)

    mock_components['mock_crear_usuario'].assert_called_once_with("new_user123")

@pytest.mark.asyncio
async def test_timer_configuration_handling(mock_request, mock_components):
    mock_components['mock_timer'].return_value = {"enabled": True, "duration": 30}

    from backend.models.chats import ChatEntrada
    from backend.services.chat_service import handle_generate_response

    await handle_generate_response(mock_request)

    args, kwargs = mock_components['mock_guardar'].call_args
    assert isinstance(args[0], ChatEntrada)
    assert kwargs["timer_enabled"] is True
    assert kwargs["timer_duration"] == 30

@pytest.mark.asyncio
async def test_tokenizer_encoding_process(mock_request, mock_components):
    mock_request.json = AsyncMock(return_value={
        "user_id": "test123",
        "message": "Mensaje para probar tokenizer",
        "type": "registered"
    })

    from backend.services.chat_service import handle_generate_response

    await handle_generate_response(mock_request)

    mock_components['mock_tokenizer'].encode_plus.assert_called_once_with(
        "prompt construido",
        return_tensors="pt",
        padding=True,
        truncation=True,
        max_length=1024
    )
