import mongoengine as me
from models.user import User
import datetime

class ChatMessage(me.Document):
    user = me.ReferenceField(User, required=True)  # Relación con el usuario
    message = me.StringField(required=True)
    timestamp = me.DateTimeField(default=datetime.datetime.utcnow)
    chat_room = me.StringField(default="general")  # Nombre de la sala

    def __str__(self):
        return f'[{self.timestamp}] {self.user.username}: {self.message}'
