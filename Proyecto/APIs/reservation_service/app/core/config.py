from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    MONGO_URL: str = os.getenv("MONGO_URL", "mongodb://localhost:27018")
    DB_NAME: str = os.getenv("DB_NAME", "db_reservation")
    API_PREFIX: str = "/api/v1"
    ADMIN_TOKEN: str = os.getenv("ADMIN_TOKEN", "secretadmin")

settings = Settings()
