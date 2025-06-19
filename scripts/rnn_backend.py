from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
import time
import re
import io

app = Flask(__name__)
CORS(app)

# Load your trained RNN model
model = None

def load_rnn_model():
    global model
    try:
        # Replace with your actual model path
        model = tf.keras.models.load_model("/Users/krishaysingh/Downloads/6000_5_if_new_best_model.keras") 
        print("RNN model loaded successfully")
    except Exception as e:
        print(f"Error loading model: {e}")

def onehotencoder(fasta_sequence, max_length=13000):
    """
    One-hot encode genetic sequence exactly like your implementation
    """
    sequence_array = np.array(list(fasta_sequence))
    label_encoder = LabelEncoder()
    integer_encoded = label_encoder.fit_transform(sequence_array)
    onehotencoder = OneHotEncoder(sparse_output=False, dtype=np.float32)
    integer_encoded = integer_encoded.reshape(len(integer_encoded), 1)
    onehot_sequence = onehotencoder.fit_transform(integer_encoded).astype(np.float32)
    
    if onehot_sequence.shape[0] < max_length:
        pad_size = max_length - onehot_sequence.shape[0]
        padding = np.zeros((pad_size, onehot_sequence.shape[1]))
        onehot_sequence = np.vstack([onehot_sequence, padding])
    else:
        onehot_sequence = onehot_sequence[:max_length, :]
    
    return onehot_sequence.flatten()

def process(sequence):
    """
    Process sequence (one-hot encoded) and return it in a format suitable for RNN
    """
    encoded_seq = onehotencoder(sequence)  # One-hot encode the input sequence
    return np.array([encoded_seq])  # Return the one-hot encoded sequence as a 2D array (1 sequence)

def load_npz_data(file_content):
    """
    Load and validate preprocessed NPZ data
    """
    try:
        # Load NPZ file from bytes
        npz_file = np.load(io.BytesIO(file_content))
        
        # Try common key names for preprocessed data
        possible_keys = ['data', 'X', 'sequences', 'encoded_sequences', 'features']
        data = None
        
        print(f"NPZ file keys: {list(npz_file.keys())}")
        
        for key in possible_keys:
            if key in npz_file:
                data = npz_file[key]
                print(f"Found data under key: {key}")
                break
        
        # If no common key found, use the first array
        if data is None and len(npz_file.keys()) > 0:
            first_key = list(npz_file.keys())[0]
            data = npz_file[first_key]
            print(f"Using first available key: {first_key}")
        
        if data is None:
            raise ValueError("No data found in NPZ file")
        
        # Ensure data is in the right format
        if len(data.shape) == 1:
            # If 1D, reshape to (1, features)
            data = data.reshape(1, -1)
        elif len(data.shape) == 2:
            # If 2D, check if it needs to be reshaped
            if data.shape[0] > 1:
                print(f"Warning: NPZ contains {data.shape[0]} sequences, using the first one")
                data = data[0:1]  # Take only the first sequence
        
        print(f"Loaded NPZ data shape: {data.shape}")
        return data.astype(np.float32)
        
    except Exception as e:
        raise ValueError(f"Error loading NPZ file: {str(e)}")

def preprocess_sequence(sequence_text, max_length=13000):
    """
    Preprocess genetic sequence for RNN input using your exact method
    """
    # Remove FASTA headers and whitespace
    sequence = re.sub(r'>.*\n', '', sequence_text)
    sequence = re.sub(r'\s+', '', sequence)
    
    # Convert to uppercase
    sequence = sequence.upper()
    
    # Remove any non-nucleotide characters (keep only A, T, G, C)
    sequence = re.sub(r'[^ATGC]', '', sequence)
    
    if len(sequence) == 0:
        raise ValueError("No valid nucleotides found in sequence")
    
    # Use your exact preprocessing method
    processed_data = process(sequence)
    
    return processed_data

@app.route('/predict', methods=['POST'])
def predict():
    try:
        start_time = time.time()
        
        # Check if it's form data (file upload) or JSON
        if request.content_type and 'multipart/form-data' in request.content_type:
            # Handle file upload
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['file']
            filename = file.filename
            file_content = file.read()
            
            # Determine file type and process accordingly
            if filename.lower().endswith('.npz'):
                print("Processing NPZ file...")
                processed_sequence = load_npz_data(file_content)
                sequence_length = "Preprocessed"
                preprocessing_method = "NPZ (already preprocessed)"
                
            else:
                print("Processing raw sequence file...")
                sequence_text = file_content.decode('utf-8')
                processed_sequence = preprocess_sequence(sequence_text)
                
                # Calculate original sequence length
                clean_sequence = re.sub(r'>.*\n', '', sequence_text)
                clean_sequence = re.sub(r'\s+', '', clean_sequence)
                clean_sequence = re.sub(r'[^ATGC]', '', clean_sequence.upper())
                sequence_length = len(clean_sequence)
                preprocessing_method = "One-hot encoding"
        
        else:
            # Handle JSON request (backward compatibility)
            data = request.get_json()
            sequence_text = data.get('sequence', '')
            filename = data.get('filename', 'unknown')
            
            if not sequence_text:
                return jsonify({'error': 'No sequence provided'}), 400
            
            processed_sequence = preprocess_sequence(sequence_text)
            
            # Calculate original sequence length
            clean_sequence = re.sub(r'>.*\n', '', sequence_text)
            clean_sequence = re.sub(r'\s+', '', clean_sequence)
            clean_sequence = re.sub(r'[^ATGC]', '', clean_sequence.upper())
            sequence_length = len(clean_sequence)
            preprocessing_method = "One-hot encoding"
        
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        print(f"Processed sequence shape: {processed_sequence.shape}")
        
        # Make prediction
        prediction = model.predict(processed_sequence, verbose=0)
        
        # Process prediction results
        if len(prediction.shape) > 1 and prediction.shape[1] > 1:
            # Binary classification
            dspd_probability = float(prediction[0][1])
            non_dspd_probability = float(prediction[0][0])
            predicted_class = 'DSPD' if dspd_probability > 0.5 else 'No DSPD'
        else:
            # Single output
            dspd_probability = float(prediction[0][0])
            non_dspd_probability = 1.0 - dspd_probability
            predicted_class = 'DSPD' if dspd_probability > 0.5 else 'No DSPD'
        
        processing_time = time.time() - start_time
        
        # Calculate confidence
        confidence = max(dspd_probability, non_dspd_probability)
        
        return jsonify({
            'prediction': predicted_class,
            'mutation_probability': dspd_probability,
            'non_mutation_probability': non_dspd_probability,
            'confidence': confidence,
            'processing_time': processing_time,
            'sequence_length': sequence_length,
            'filename': filename,
            'processed_shape': list(processed_sequence.shape),
            'preprocessing_method': preprocessing_method
        })
        
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'supported_formats': ['FASTA (.fasta, .fa)', 'Text (.txt)', 'Sequence (.seq)', 'Preprocessed (.npz)']
    })

if __name__ == '__main__':
    load_rnn_model()
    app.run(host='0.0.0.0', port=5000, debug=True)
