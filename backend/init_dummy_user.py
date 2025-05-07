from database.mongo_client import user_collection

def run():
    if not user_collection.find_one({"_id": "healthcheck"}):
        user_collection.insert_one({
            "_id": "healthcheck",
            "timer_enabled": True,
            "timer_duration": 5
        })
        print("Usuario healthcheck creado.")
    else:
        print("Usuario healthcheck ya existe.")

if __name__ == "__main__":
    run()
