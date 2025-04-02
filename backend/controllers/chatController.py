from models.chats import ChatMessage;
from models.user import User;

def save_chat_message(username: str, message: str, chat_room: str = "general"):
    """
    Guarda un mensaje en la base de datos.
    :param username: Nombre del usuario que envía el mensaje (puede ser anónimo)
    :param message: Contenido del mensaje
    :param chat_room: Nombre de la sala de chat (opcional)
    :return: Mensaje guardado
    """
    try:
        # Si no se proporciona un nombre de usuario, usar "Anónimo"
        if not username:
            username = "Anónimo"
        
        # Crear y guardar el mensaje sin necesidad de usuario registrado
        chat_msg = ChatMessage(user=username, message=message, timestamp=datetime.utcnow(), chat_room=chat_room)
        chat_msg.save()
        
        print("✅ Mensaje guardado en la base de datos")
        return chat_msg
    except Exception as e:
        print(f"❌ Error al guardar el mensaje: {e}")
        return None

def get_chat_history(username: str, chat_room: str = "general"):
    """
    Obtiene el historial de chats de un usuario registrado en una sala específica.
    :param username: Nombre del usuario registrado
    :param chat_room: Sala de chat a consultar (opcional, por defecto "general")
    :return: Lista de mensajes del usuario en la sala
    """
    try:
        # Verificar si el usuario está registrado
        user = User.objects(username=username).first()
        if not user:
            print("❌ Usuario no registrado")
            return []
        
        # Obtener los mensajes del usuario en la sala especificada
        chat_history = ChatMessage.objects(user=user, chat_room=chat_room).order_by("+timestamp")
        
        return list(chat_history)
    except Exception as e:
        print(f"❌ Error al obtener el historial de chats: {e}")
        return []
