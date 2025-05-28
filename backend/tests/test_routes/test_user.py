from unittest.mock import patch
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


@patch("api.routes_user.get_management_token")
@patch("api.routes_user.requests.get")
def test_get_active_users(mock_get, mock_token):
    mock_token.return_value = "fake-token"
    mock_get.return_value.json.return_value = [
        {"user_id": "auth0|123"}, {"user_id": "auth0|456"}, {"user_id": "auth0|123"}
    ]
    response = client.get("/user/active")
    assert response.status_code == 200
    assert response.json() == {"active_users": 2}


@patch("repository.user_repository.actualizar_temporizador_usuario")
def test_configurar_temporizador_usuario(mock_update):
    user_id = "123"
    response = client.put(f"/user/timer/{user_id}", json=15)
    assert response.status_code == 200
    assert "message" in response.json()


@patch("api.routes_user.verificar_token")
@patch("core.scheduler.iniciar_scheduler")
def test_start_scheduler(mock_scheduler, mock_verificar_token):
    mock_verificar_token.return_value = {"sub": "auth0|123"}
    token = "Bearer fake-token"
    response = client.post("/user/start-scheduler", headers={"Authorization": token})
    assert response.status_code == 200
    assert response.json()["success"] is True
