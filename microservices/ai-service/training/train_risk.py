from risk_assessment import TouristRiskAssessment
from pathlib import Path

# Path to save the trained model
# Ensure this directory exists
model_dir = Path("models")
model_dir.mkdir(exist_ok=True)
model_path = model_dir / "risk_model.joblib"

# Initialize the model
risk_assessor = TouristRiskAssessment()

# Create synthetic training data
print("Generating synthetic risk assessment data...")
df_risk = risk_assessor.create_risk_training_data(n_samples=5000)

# Train the model
print("Training risk assessment model...")
risk_assessor.train(df_risk)

# Save the trained model
risk_assessor.save_model(str(model_path))

print("Risk assessment model training complete and saved.")