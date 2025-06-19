from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
import time
import re
import io
import os
from google.cloud import storage

app = Flask(__name__)
CORS(app)

# Global model variable
model = None
model_loaded = False

def download_model_from_gcs():
    """
    Download model from Google Cloud Storage
    """
    global model, model_loaded
    
    try:
        # Initialize GCS client
        client = storage.Client()
        bucket_name = "dspd-diagnosis-models"  # Your bucket name
        blob_name = "models/6000_5_if_new_best_model.keras"
        
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(blob_name)
        
        # Download to temporary file
        temp_model_path = "/tmp/6000_5_if_new_best_model.keras"
        blob.download_to_filename(temp_model_path)
        
        # Load the model
        model = tf.keras.models.load_model(temp_model_path)
        model_loaded = True
        
        print(f"✅ Model downloaded and loaded from GCS")
        print(f"Model input shape: {model.input_shape}")
        print(f"Model output shape: {model.output_shape}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error downloading model from GCS: {e}")
        return False

def onehotencoder(fasta_sequence, max_length=13000):
    """
    One-hot encode genetic sequence exactly like your implementation
    """
    sequence_array = np.array(list(fasta_sequence))
    label_encoder = LabelEncoder()
    integer_encoded = label_encoder.fit_transform(sequence_array)
    onehotencoder_obj = OneHotEncoder(sparse_output=False, dtype=np.float32)
    integer_encoded = integer_encoded.reshape(len(integer_encoded), 1)
    onehot_sequence = onehotencoder_obj.fit_transform(integer_encoded).astype(np.float32)
    
    if onehot_sequence.shape[0] < max_length:
        pad_size = max_length - onehot_sequence.shape[0]
        padding = np.zeros((pad_size, onehot_sequence.shape[1]))
        onehot_sequence = np.vstack([onehot_sequence, padding])
    else:
        onehot_sequence = onehot_sequence[:max_length, :]
    
    return onehot_sequence.flatten()

def process_sequence(sequence):
    """
    Process sequence (one-hot encoded) and return it in a format suitable for RNN
    """
    encoded_seq = onehotencoder(sequence)
    return np.array([encoded_seq])

@app.route('/predict', methods=['POST'])
def predict():
    try:
        start_time = time.time()
        
        # Download model if not loaded
        if not model_loaded:
            print("📥 Downloading model from Google Cloud Storage...")
            if not download_model_from_gcs():
                return jsonify({'error': 'Failed to load model from GCS'}), 500
        
        # Handle file upload
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        filename = file.filename
        file_content = file.read()
        
        print(f"🔄 Processing file: {filename}")
        
        # Process based on file type
        if filename.lower().endswith('.npz'):
            # Load NPZ data
            npz_file = np.load(io.BytesIO(file_content))
            possible_keys = ['data', 'X', 'sequences', 'encoded_sequences', 'features']
            data = None
            
            for key in possible_keys:
                if key in npz_file:
                    data = npz_file[key]
                    break
            
            if data is None and len(npz_file.keys()) > 0:
                first_key = list(npz_file.keys())[0]
                data = npz_file[first_key]
            
            if data is None:
                raise ValueError("No data found in NPZ file")
            
            if len(data.shape) == 1:
                data = data.reshape(1, -1)
            elif len(data.shape) == 2 and data.shape[0] > 1:
                data = data[0:1]
            
            processed_sequence = data.astype(np.float32)
            sequence_length = "Preprocessed"
            preprocessing_method = "NPZ (already preprocessed)"
            
        else:
            # Process raw sequence
            sequence_text = file_content.decode('utf-8')
            
            # Clean sequence
            sequence = re.sub(r'>.*\n', '', sequence_text)
            sequence = re.sub(r'\s+', '', sequence)
            sequence = sequence.upper()
            sequence = re.sub(r'[^ATGC]', '', sequence)
            
            if len(sequence) == 0:
                raise ValueError("No valid nucleotides found in sequence")
            
            print(f"📏 Original sequence length: {len(sequence)}")
            processed_sequence = process_sequence(sequence)
            sequence_length = len(sequence)
            preprocessing_method = "One-hot encoding (max_length=13000)"
        
        print(f"🔢 Processed sequence shape: {processed_sequence.shape}")
        
        # Make prediction with your actual model
        print("🧠 Making prediction with your RNN model from GCS...")
        prediction = model.predict(processed_sequence, verbose=0)
        print(f"📊 Raw prediction: {prediction}")
        
        # Process prediction results
        if len(prediction.shape) > 1 and prediction.shape[1] > 1:
            # Binary classification (2 outputs)
            dspd_probability = float(prediction[0][1])
            non_dspd_probability = float(prediction[0][0])
            predicted_class = 'DSPD' if dspd_probability > 0.5 else 'No DSPD'
        else:
            # Single output
            dspd_probability = float(prediction[0][0])
            non_dspd_probability = 1.0 - dspd_probability
            predicted_class = 'DSPD' if dspd_probability > 0.5 else 'No DSPD'
        
        processing_time = time.time() - start_time
        confidence = max(dspd_probability, non_dspd_probability)
        
        result = {
            'prediction': predicted_class,
            'mutation_probability': dspd_probability,
            'non_mutation_probability': non_dspd_probability,
            'confidence': confidence,
            'processing_time': processing_time,
            'sequence_length': sequence_length,
            'filename': filename,
            'processed_shape': list(processed_sequence.shape),
            'preprocessing_method': preprocessing_method,
            'backend_type': 'google_cloud_storage_model',
            'model_status': 'actual_rnn_prediction_from_gcs',
            'raw_prediction': prediction.tolist()
        }
        
        print(f"✅ Prediction complete: {predicted_class} ({confidence:.1%} confidence)")
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ Prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model_loaded,
        'model_source': 'Google Cloud Storage',
        'supported_formats': ['FASTA (.fasta, .fa)', 'Text (.txt)', 'Sequence (.seq)', 'Preprocessed (.npz)']
    })

if __name__ == '__main__':
    print("🚀 Starting DSPD Diagnosis Backend with Google Cloud Storage...")
    app.run(host='0.0.0.0', port=5000, debug=True)
