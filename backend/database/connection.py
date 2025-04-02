import mongoengine as me
import os

# Configuración de la conexión a MongoDB
def connect_db():
    DB_NAME = "chat_db"
    MONGO_HOST = os.getenv("MONGO_HOST", "localhost")  # Usa la variable de entorno o localhost por defecto
    MONGO_PORT = os.getenv("MONGO_PORT", "27017")
    
    # Construcción de la URI
    mongo_uri = f"mongodb://{MONGO_HOST}:{MONGO_PORT}/{DB_NAME}"
    
    try:
        me.connect(DB_NAME, host=mongo_uri)
        print(f"✅ Conectado a MongoDB en {mongo_uri}")
    except Exception as e:
        print(f"❌ Error al conectar con MongoDB: {e}")

# Llamar a la función para conectar cuando se importe este archivo
connect_db()
