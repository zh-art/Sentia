from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["sentia_db"]
chat_collection = db["chats"]
user_collection = db["users"]
report_collection = db["reports"]