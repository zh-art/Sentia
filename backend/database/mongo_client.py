from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde un archivo .env
load_dotenv()

# Obtener la URI de conexión desde la variable de entorno
MONGO_URI = os.getenv("MONGO_URI")

# Crear el cliente con la URI de Atlas
client = MongoClient(MONGO_URI)

# Seleccionar la base de datos y las colecciones
db = client["SentiaDb"]  # Asegúrate de que este sea el nombre de tu base en Atlas
chat_collection = db["chats"]
user_collection = db["users"]
report_collection = db["reports"]
