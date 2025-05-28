import pytest
from unittest.mock import patch
from services import user_service


@patch("services.user_service.user_collection")
def test_usuario_existe_true(mock_collection):
    mock_collection.find_one.return_value = {"user_id": "123"}
    assert user_service.usuario_existe("123") is True


@patch("services.user_service.user_collection")
def test_usuario_existe_false(mock_collection):
    mock_collection.find_one.return_value = None
    assert user_service.usuario_existe("456") is False


@patch("services.user_service.user_collection")
@patch("services.user_service.usuario_existe", return_value=False)
def test_crear_usuario_si_no_existe(mock_exists, mock_collection):
    user_service.crear_usuario_si_no_existe("789")
    mock_collection.insert_one.assert_called_once_with({
        "user_id": "789",
        "name": "Usuario Anónimo"
    })


@patch("services.user_service.user_collection")
def test_actualizar_temporizador_usuario(mock_collection):
    user_service.actualizar_temporizador_usuario("123", 10)
    mock_collection.update_one.assert_called_once_with(
        {"user_id": "123"},
        {"$set": {"timer_enabled": True, "timer_duration": 600}},
        upsert=True
    )


def test_actualizar_temporizador_usuario_invalido():
    with pytest.raises(ValueError):
        user_service.actualizar_temporizador_usuario("", -1)
