import firebase_admin
from firebase_admin import credentials, db, storage
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    firebase_cert_path: str = "serviceAccountKey.json"
    firebase_storage_bucket: str = "phoenix-successful-version.firebasestorage.app"
    firebase_database_url: str = "https://phoenix-successful-version-default-rtdb.asia-southeast1.firebasedatabase.app"

settings = Settings()

# Initialize Firebase Admin SDK
cred = credentials.Certificate(settings.firebase_cert_path)
firebase_app = firebase_admin.initialize_app(cred, {
    'storageBucket': settings.firebase_storage_bucket,
    'databaseURL': settings.firebase_database_url
})

# Get a reference to the Realtime Database service
rtdb = db.reference()
bucket = storage.bucket()
