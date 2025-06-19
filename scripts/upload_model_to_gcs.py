from google.cloud import storage
import os

def upload_model_to_gcs():
    """
    Upload your trained Keras model to Google Cloud Storage
    """
    # Initialize the client
    client = storage.Client()
    
    # Create bucket (must be globally unique)
    bucket_name = "dspd-diagnosis-models"  # Change this to something unique
    bucket = client.bucket(bucket_name)
    
    try:
        bucket.create(location="US")
        print(f"✅ Created bucket: {bucket_name}")
    except Exception as e:
        print(f"Bucket might already exist: {e}")
    
    # Upload your model file
    model_path = "/Users/krishaysingh/Downloads/6000_5_if_new_best_model.keras"
    blob_name = "models/6000_5_if_new_best_model.keras"
    
    blob = bucket.blob(blob_name)
    
    if os.path.exists(model_path):
        blob.upload_from_filename(model_path)
        print(f"✅ Model uploaded to gs://{bucket_name}/{blob_name}")
        
        # Make it publicly readable (optional)
        blob.make_public()
        print(f"🌐 Model URL: {blob.public_url}")
        
        return f"gs://{bucket_name}/{blob_name}"
    else:
        print(f"❌ Model file not found at {model_path}")
        return None

if __name__ == "__main__":
    # Set up authentication
    # Download service account key from Google Cloud Console
    # Set environment variable: GOOGLE_APPLICATION_CREDENTIALS
    
    model_url = upload_model_to_gcs()
    if model_url:
        print(f"🎯 Use this URL in your app: {model_url}")
