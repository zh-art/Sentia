import pytest
import sys
import os
from unittest.mock import MagicMock, AsyncMock, patch
from pymongo.errors import ServerSelectionTimeoutError

# Configuración de paths - Asegúrate que apunta al directorio correcto
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, root_dir)

# Fixture global para mockear MongoDB
@pytest.fixture(autouse=True)
def mock_database():
    with patch('pymongo.MongoClient') as mock_client:
        mock_db = MagicMock()
        mock_collection = MagicMock()
        mock_client.return_value.__getitem__.return_value = mock_db
        mock_db.__getitem__.return_value = mock_collection
        mock_collection.find.return_value = []
        mock_collection.insert_one.return_value = MagicMock(inserted_id='mock_id')
        yield mock_collection

# Fixture para mock_request
@pytest.fixture
def mock_request():
    request = MagicMock()
    request.json = AsyncMock()
    return request

# Fixture mejorado para componentes del chat
@pytest.fixture
def mock_chat_components():
    with patch('backend.services.chat_service.obtener_configuracion_temporizador_usuario') as mock_timer, \
         patch('backend.services.chat_service.guardar_chat') as mock_guardar, \
         patch('backend.services.chat_service.obtener_historial') as mock_historial, \
         patch('backend.services.chat_service.construir_input_con_historial') as mock_construir, \
         patch('transformers.AutoTokenizer.from_pretrained') as mock_tokenizer, \
         patch('transformers.AutoModelForCausalLM.from_pretrained') as mock_model, \
         patch('backend.services.user_service.crear_usuario_si_no_existe') as mock_crear_usuario:
        
        # Configuración realista del tokenizer y modelo
        mock_tokenizer_instance = MagicMock()
        mock_tokenizer_instance.encode_plus.return_value = {
            'input_ids': MagicMock(to=MagicMock(return_value='fake_input_ids')),
            'attention_mask': MagicMock(to=MagicMock(return_value='fake_attention_mask'))
        }
        mock_tokenizer_instance.decode.return_value = "Respuesta mock"
        mock_tokenizer.return_value = mock_tokenizer_instance
        
        mock_model_instance = MagicMock()
        mock_model_instance.generate.return_value = "fake_reply_ids"
        mock_model.return_value = mock_model_instance

        yield {
            'mock_timer': mock_timer,
            'mock_guardar': mock_guardar,
            'mock_historial': mock_historial,
            'mock_construir': mock_construir,
            'mock_tokenizer': mock_tokenizer_instance,
            'mock_model': mock_model_instance,
            'mock_crear_usuario': mock_crear_usuario
        }