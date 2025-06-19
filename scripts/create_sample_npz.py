import numpy as np
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

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

def create_sample_npz():
    """
    Create sample NPZ files for testing
    """
    # Sample sequences
    sequences = [
        "ATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGC",
        "GGCCGGCCGGCCGGCCGGCCGGCCGGCCGGCCGGCCGGCCGGCCGGCCGGCC",
        "AAAATTTTAAAATTTTAAAATTTTAAAATTTTAAAATTTTAAAATTTTAAAA"
    ]
    
    for i, seq in enumerate(sequences):
        # Process the sequence
        processed_data = process(seq)
        
        # Save as NPZ file
        filename = f"sample_sequence_{i+1}.npz"
        np.savez_compressed(filename, data=processed_data[0])  # Save flattened version
        
        print(f"Created {filename}")
        print(f"  Original sequence length: {len(seq)}")
        print(f"  Processed shape: {processed_data.shape}")
        print(f"  Saved data shape: {processed_data[0].shape}")
        print()

if __name__ == "__main__":
    create_sample_npz()
