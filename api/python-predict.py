import json
import numpy as np
import io
import re
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
import time
import os

# Try to import TensorFlow, fall back to mock if not available
try:
    import tensorflow as tf
    TF_AVAILABLE = True
    print("TensorFlow loaded successfully")
except ImportError:
    TF_AVAILABLE = False
    print("TensorFlow not available - using mock predictions")

# Global model variable
model = None

def load_model_if_available():
    """
    Load the RNN model if TensorFlow is available and model file exists
    """
    global model
    if not TF_AVAILABLE:
        return False
    
    try:
        # Your specific model path
        model_paths = [
            "/Users/krishaysingh/Downloads/6000_5_if_new_best_model.keras",  # Your actual model
            "/tmp/6000_5_if_new_best_model.keras",  # Uploaded to temp
            "6000_5_if_new_best_model.keras",       # Root directory
            "models/6000_5_if_new_best_model.keras", # Models directory
            "/tmp/model.keras",  # Generic uploaded model
            "model.keras",       # Generic root directory
        ]
        
        for path in model_paths:
            if os.path.exists(path):
                model = tf.keras.models.load_model(path)
                print(f"Model loaded successfully from {path}")
                print(f"Model input shape: {model.input_shape}")
                print(f"Model output shape: {model.output_shape}")
                return True
        
        print("No model file found - using mock predictions")
        print(f"Searched paths: {model_paths}")
        return False
        
    except Exception as e:
        print(f"Error loading model: {e}")
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

def load_npz_data(file_content):
    """
    Load and validate preprocessed NPZ data
    """
    try:
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
        elif len(data.shape) == 2:
            if data.shape[0] > 1:
                data = data[0:1]
        
        return data.astype(np.float32)
        
    except Exception as e:
        raise ValueError(f"Error loading NPZ file: {str(e)}")

def make_prediction(processed_sequence):
    """
    Make actual RNN prediction using your trained model
    """
    global model
    
    if model is not None and TF_AVAILABLE:
        try:
            print(f"Making prediction with input shape: {processed_sequence.shape}")
            
            # Make actual prediction with your model
            prediction = model.predict(processed_sequence, verbose=0)
            print(f"Raw prediction output: {prediction}")
            print(f"Prediction shape: {prediction.shape}")
            
            # Process prediction results based on your model's output format
            if len(prediction.shape) > 1 and prediction.shape[1] > 1:
                # Binary classification (2 outputs) - softmax output
                dspd_probability = float(prediction[0][1])
                non_dspd_probability = float(prediction[0][0])
                predicted_class = 'DSPD' if dspd_probability > 0.5 else 'No DSPD'
                print(f"Binary classification: DSPD={dspd_probability:.3f}, No DSPD={non_dspd_probability:.3f}")
            else:
                # Single output (sigmoid) - binary classification
                dspd_probability = float(prediction[0][0])
                non_dspd_probability = 1.0 - dspd_probability
                predicted_class = 'DSPD' if dspd_probability > 0.5 else 'No DSPD'
                print(f"Single output: DSPD probability={dspd_probability:.3f}")
            
            return {
                'prediction': predicted_class,
                'mutation_probability': dspd_probability,
                'non_mutation_probability': non_dspd_probability,
                'confidence': max(dspd_probability, non_dspd_probability),
                'model_status': 'actual_rnn_prediction_6000_5_model',
                'raw_prediction': prediction.tolist()
            }
            
        except Exception as e:
            print(f"Error during prediction: {e}")
            return mock_prediction(processed_sequence, f"prediction_error: {e}")
    
    else:
        return mock_prediction(processed_sequence, "model_not_loaded")

def mock_prediction(processed_sequence, reason="fallback"):
    """
    Mock RNN prediction when actual model is not available
    """
    # Generate consistent results based on sequence
    sequence_hash = hash(str(processed_sequence.flatten()[:100])) % 2**32
    np.random.seed(sequence_hash)
    
    dspd_prob = 0.3 + np.random.random() * 0.4  # 30-70%
    non_dspd_prob = 1.0 - dspd_prob
    
    return {
        'prediction': 'DSPD' if dspd_prob > 0.5 else 'No DSPD',
        'mutation_probability': float(dspd_prob),
        'non_mutation_probability': float(non_dspd_prob),
        'confidence': float(max(dspd_prob, non_dspd_prob)),
        'model_status': f'mock_prediction ({reason})',
        'raw_prediction': [[float(non_dspd_prob), float(dspd_prob)]]
    }

def handler(request):
    try:
        start_time = time.time()
        
        # Try to load model on first request
        if model is None:
            model_loaded = load_model_if_available()
            print(f"Model loading attempt: {'Success' if model_loaded else 'Failed'}")
        
        # Parse multipart form data
        if request.method != 'POST':
            return {
                'statusCode': 405,
                'body': json.dumps({'error': 'Method not allowed'})
            }
        
        # Get file from request
        files = request.files
        if 'file' not in files:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'No file provided'})
            }
        
        file = files['file']
        filename = file.filename
        file_content = file.read()
        
        print(f"Processing file: {filename} ({len(file_content)} bytes)")
        
        # Process based on file type
        if filename.lower().endswith('.npz'):
            processed_sequence = load_npz_data(file_content)
            sequence_length = "Preprocessed"
            preprocessing_method = "NPZ (already preprocessed)"
        else:
            sequence_text = file_content.decode('utf-8')
            
            # Clean sequence
            sequence = re.sub(r'>.*\n', '', sequence_text)
            sequence = re.sub(r'\s+', '', sequence)
            sequence = sequence.upper()
            sequence = re.sub(r'[^ATGC]', '', sequence)
            
            if len(sequence) == 0:
                raise ValueError("No valid nucleotides found in sequence")
            
            print(f"Cleaned sequence length: {len(sequence)}")
            processed_sequence = process_sequence(sequence)
            sequence_length = len(sequence)
            preprocessing_method = f"One-hot encoding (max_length=13000)"
        
        print(f"Final processed sequence shape: {processed_sequence.shape}")
        
        # Make actual prediction
        prediction_result = make_prediction(processed_sequence)
        
        processing_time = time.time() - start_time
        
        result = {
            'prediction': prediction_result['prediction'],
            'mutation_probability': prediction_result['mutation_probability'],
            'non_mutation_probability': prediction_result['non_mutation_probability'],
            'confidence': prediction_result['confidence'],
            'processing_time': processing_time,
            'sequence_length': sequence_length,
            'filename': filename,
            'processed_shape': list(processed_sequence.shape),
            'preprocessing_method': preprocessing_method,
            'backend_type': 'vercel_python_with_6000_5_model',
            'model_status': prediction_result['model_status'],
            'tensorflow_available': TF_AVAILABLE,
            'model_loaded': model is not None,
            'raw_prediction': prediction_result.get('raw_prediction', [])
        }
        
        print(f"Final result: {result}")
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': json.dumps(result)
        }
        
    except Exception as e:
        print(f"Handler error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
