import numpy as np
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
import re

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

def test_preprocessing():
    """
    Test the preprocessing with sample sequences
    """
    # Test with a simple sequence
    test_sequence = "ATGCATGCATGC"
    
    print("Testing preprocessing...")
    print(f"Input sequence: {test_sequence}")
    print(f"Sequence length: {len(test_sequence)}")
    
    # Process the sequence
    processed_data = process(test_sequence)
    print(f"Processed data shape: {processed_data.shape}")
    
    # Test with FASTA format
    fasta_sequence = """>Test sequence
ATGCATGCATGCATGCATGCATGCATGCATGCATGC
ATGCATGCATGCATGCATGCATGCATGCATGCATGC"""
    
    # Clean FASTA sequence
    clean_sequence = re.sub(r'>.*\n', '', fasta_sequence)
    clean_sequence = re.sub(r'\s+', '', clean_sequence)
    clean_sequence = clean_sequence.upper()
    
    print(f"\nFASTA input: {fasta_sequence}")
    print(f"Cleaned sequence: {clean_sequence}")
    print(f"Cleaned sequence length: {len(clean_sequence)}")
    
    processed_fasta = process(clean_sequence)
    print(f"Processed FASTA shape: {processed_fasta.shape}")
    
    # Test with different max_length
    short_processed = process("ATGC")
    print(f"\nShort sequence processed shape: {short_processed.shape}")
    
    print("\nPreprocessing test completed successfully!")

if __name__ == "__main__":
    test_preprocessing()
