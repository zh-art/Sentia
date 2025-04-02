from mongoengine import connect
import os

def init_db():
    """
    Configura la conexión a la base de datos MongoDB.
    """
    DB_NAME = os.getenv("MONGO_INITDB_DATABASE", "sentia_db")
    DB_HOST = "mongodb"  # Nombre del servicio definido en docker-compose
    DB_PORT = 27017  # Puerto interno de MongoDB en Docker
    
    try:
        connect(
            db=DB_NAME,
            host=f"mongodb://{DB_HOST}:{DB_PORT}/{DB_NAME}",
            alias="default"
        )
        print("✅ Conectado a MongoDB correctamente")
    except Exception as e:
        print(f"❌ Error al conectar con MongoDB: {e}")

# Ejecutar la conexión al importar el módulo
init_db()
