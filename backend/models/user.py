import mongoengine as me
import datetime

class User(me.Document):
    username = me.StringField(required=True, unique=True)
    email = me.EmailField(required=True, unique=True)
    password_hash = me.StringField(required=True)  # Almacenar la contraseña de forma segura (hashed)
    created_at = me.DateTimeField(default=datetime.datetime.utcnow)

    def __str__(self):
        return f'Usuario: {self.username} ({self.email})'
