from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["SentiaDb"]
chat_collection = db["chats"]
user_collection = db["users"]
report_collection = db["reports"]
