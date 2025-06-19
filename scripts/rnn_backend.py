from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import time
import re

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

def preprocess_sequence(sequence_text):
    """
    Preprocess genetic sequence for RNN input
    Adjust this based on your model's requirements
    """
    # Remove headers and whitespace
    sequence = re.sub(r'>.*\n', '', sequence_text)
    sequence = re.sub(r'\s+', '', sequence)
    
    # Convert to uppercase
    sequence = sequence.upper()
    
    # Create nucleotide mapping
    nucleotide_map = {'A': 0, 'T': 1, 'G': 2, 'C': 3, 'N': 4}
    
    # Convert sequence to numerical representation
    numerical_sequence = []
    for nucleotide in sequence:
        if nucleotide in nucleotide_map:
            numerical_sequence.append(nucleotide_map[nucleotide])
        else:
            numerical_sequence.append(4)  # Unknown nucleotide
    
    # Pad or truncate to fixed length (adjust based on your model)
    max_length = 1000  # Adjust based on your RNN input size
    if len(numerical_sequence) > max_length:
        numerical_sequence = numerical_sequence[:max_length]
    else:
        numerical_sequence.extend([4] * (max_length - len(numerical_sequence)))
    
    return np.array(numerical_sequence).reshape(1, -1, 1)

def extract_features(sequence):
    """
    Extract additional features for your RNN
    """
    sequence = sequence.upper().replace('\n', '').replace('>', '')
    
    # Calculate nucleotide frequencies
    total_length = len(sequence)
    if total_length == 0:
        return np.zeros(8)
    
    features = [
        sequence.count('A') / total_length,  # A frequency
        sequence.count('T') / total_length,  # T frequency
        sequence.count('G') / total_length,  # G frequency
        sequence.count('C') / total_length,  # C frequency
        (sequence.count('G') + sequence.count('C')) / total_length,  # GC content
        total_length,  # Sequence length
        sequence.count('CG') / max(1, total_length - 1),  # CpG frequency
        len(re.findall(r'(A|T){3,}', sequence)) / max(1, total_length)  # AT-rich regions
    ]
    
    return np.array(features)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        start_time = time.time()
        
        data = request.get_json()
        sequence = data.get('sequence', '')
        filename = data.get('filename', 'unknown')
        
        if not sequence:
            return jsonify({'error': 'No sequence provided'}), 400
        
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Preprocess the sequence
        processed_sequence = preprocess_sequence(sequence)
        
        # Extract additional features if your model uses them
        features = extract_features(sequence)
        
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
            'sequence_length': len(sequence.replace('\n', '').replace('>', '')),
            'filename': filename
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

if __name__ == '__main__':
    load_rnn_model()
    app.run(host='0.0.0.0', port=5000, debug=True)
