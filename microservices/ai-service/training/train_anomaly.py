from anomaly_detection import TouristAnomalyDetector
from pathlib import Path

# Path to save the trained model
# Ensure this directory exists
model_dir = Path("models")
model_dir.mkdir(exist_ok=True)
model_path = model_dir / "anomaly_model.joblib"

# Initialize the model
detector = TouristAnomalyDetector()

# Create synthetic training data
print("Generating synthetic anomaly detection data...")
df_anomaly = detector.create_synthetic_training_data(n_samples=10000)

# Train the model
print("Training anomaly detection model...")
detector.train(df_anomaly)

# Save the trained model
detector.save_model(str(model_path))

print("Anomaly detection model training complete and saved.")