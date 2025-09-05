# training/anomaly_detection.py
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import joblib
import pickle
from datetime import datetime, timedelta
import logging

class TouristAnomalyDetector:
    def __init__(self):
        self.isolation_forest = None
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_names = []

    def create_synthetic_training_data(self, n_samples=10000):
        """Create synthetic tourist behavior data for training"""
        np.random.seed(42)

        # Normal behavior patterns
        normal_data = []

        for i in range(int(n_samples * 0.9)):  # 90% normal behavior
            # Simulate normal tourist movement patterns
            hour = np.random.normal(12, 4)  # Peak activity around noon
            hour = max(0, min(23, hour))

            # Speed patterns (km/h)
            if 6 <= hour <= 22:  # Daytime
                speed = np.random.normal(3, 1)  # Walking speed
            else:  # Nighttime
                speed = np.random.normal(1, 0.5)  # Slower movement
            speed = max(0, speed)

            # Distance from entry point (gradually increases)
            days_since_entry = np.random.randint(1, 8)
            distance_from_entry = np.random.exponential(days_since_entry * 2)

            # Battery level (decreases over time)
            battery_level = max(10, 100 - np.random.exponential(20))

            # Location accuracy
            accuracy = np.random.normal(10, 3)  # GPS accuracy in meters
            accuracy = max(1, accuracy)

            # Risk zone proximity
            risk_zone_distance = np.random.exponential(5)  # km from risk zones

            normal_data.append([
                hour, speed, distance_from_entry, battery_level,
                accuracy, risk_zone_distance, days_since_entry, 0  # 0 = normal
            ])

        # Anomalous behavior patterns
        anomaly_data = []

        for i in range(int(n_samples * 0.1)):  # 10% anomalous behavior
            # Unusual patterns that might indicate distress
            hour = np.random.choice([2, 3, 23, 24])  # Unusual hours
            speed = np.random.choice([
                np.random.normal(0, 0.1),      # No movement (lost/stuck)
                np.random.normal(15, 3),       # Running (panic)
                np.random.normal(50, 10)       # Vehicle speed (kidnapping)
            ])
            speed = max(0, speed)

            days_since_entry = np.random.randint(1, 8)
            distance_from_entry = np.random.choice([
                np.random.normal(0.5, 0.2),    # Stuck near entry
                np.random.normal(50, 10)       # Too far from planned route
            ])

            battery_level = np.random.choice([
                np.random.normal(5, 2),         # Critical battery
                100                             # Always full (suspicious)
            ])
            battery_level = max(0, min(100, battery_level))

            accuracy = np.random.choice([
                np.random.normal(100, 20),      # Poor GPS signal
                np.random.normal(1, 0.1)        # Too accurate (spoofed)
            ])
            accuracy = max(1, accuracy)

            risk_zone_distance = np.random.exponential(0.5)  # Near risk zones

            anomaly_data.append([
                hour, speed, distance_from_entry, battery_level,
                accuracy, risk_zone_distance, days_since_entry, 1  # 1 = anomaly
            ])

        # Combine data
        all_data = normal_data + anomaly_data
        np.random.shuffle(all_data)

        df = pd.DataFrame(all_data, columns=[
            'hour', 'speed_kmh', 'distance_from_entry_km', 'battery_level',
            'gps_accuracy_m', 'risk_zone_distance_km', 'days_since_entry', 'is_anomaly'
        ])

        return df

    def engineer_features(self, df):
        """Create advanced features from raw data"""
        df = df.copy()

        # Time-based features
        df['is_night'] = ((df['hour'] < 6) | (df['hour'] > 22)).astype(int)
        df['is_peak_hours'] = ((df['hour'] >= 9) & (df['hour'] <= 17)).astype(int)

        # Movement patterns
        df['speed_category'] = pd.cut(df['speed_kmh'], 
                                    bins=[0, 1, 5, 15, float('inf')], 
                                    labels=['stationary', 'walking', 'fast', 'vehicle'])

        # Risk indicators
        df['low_battery'] = (df['battery_level'] < 20).astype(int)
        df['poor_gps'] = (df['gps_accuracy_m'] > 50).astype(int)
        df['near_risk_zone'] = (df['risk_zone_distance_km'] < 1).astype(int)

        # Behavioral anomaly indicators
        df['unusual_hour_activity'] = (
            ((df['hour'] < 6) | (df['hour'] > 23)) & (df['speed_kmh'] > 3)
        ).astype(int)

        df['excessive_distance'] = (
            df['distance_from_entry_km'] > (df['days_since_entry'] * 10)
        ).astype(int)

        return df

    def train(self, df):
        """Train the anomaly detection model"""
        # Engineer features
        df_features = self.engineer_features(df)

        # Select features for training
        feature_columns = [
            'hour', 'speed_kmh', 'distance_from_entry_km', 'battery_level',
            'gps_accuracy_m', 'risk_zone_distance_km', 'days_since_entry',
            'is_night', 'is_peak_hours', 'low_battery', 'poor_gps',
            'near_risk_zone', 'unusual_hour_activity', 'excessive_distance'
        ]

        # Handle categorical variables
        categorical_cols = ['speed_category']
        for col in categorical_cols:
            if col in df_features.columns:
                le = LabelEncoder()
                df_features[f'{col}_encoded'] = le.fit_transform(df_features[col].astype(str))
                feature_columns.append(f'{col}_encoded')
                self.label_encoders[col] = le

        X = df_features[feature_columns]
        y = df_features['is_anomaly']

        self.feature_names = feature_columns

        # Scale features
        X_scaled = self.scaler.fit_transform(X)

        # Train Isolation Forest (unsupervised approach)
        self.isolation_forest = IsolationForest(
            contamination=0.1,  # Expected proportion of anomalies
            random_state=42,
            n_estimators=100
        )

        # Use only normal data for training (unsupervised)
        X_normal = X_scaled[y == 0]
        self.isolation_forest.fit(X_normal)

        # Evaluate on full dataset
        y_pred = self.isolation_forest.predict(X_scaled)
        y_pred = (y_pred == -1).astype(int)  # Convert to binary

        print("Training completed!")
        print(f"Accuracy: {(y_pred == y).mean():.3f}")
        print("\nClassification Report:")
        print(classification_report(y, y_pred))

        return self

    def predict(self, data_point):
        """Predict if a data point is anomalous"""
        if isinstance(data_point, dict):
            df = pd.DataFrame([data_point])
        else:
            df = pd.DataFrame(data_point)

        # Engineer features
        df_features = self.engineer_features(df)

        # Apply same preprocessing as training
        X = df_features[self.feature_names]

        # Handle categorical encoding
        for col, encoder in self.label_encoders.items():
            if f'{col}_encoded' in self.feature_names:
                X[f'{col}_encoded'] = encoder.transform(df_features[col].astype(str))

        X_scaled = self.scaler.transform(X)

        # Predict
        prediction = self.isolation_forest.predict(X_scaled)
        anomaly_score = self.isolation_forest.score_samples(X_scaled)

        is_anomaly = (prediction == -1).astype(int)
        confidence = 1 / (1 + np.exp(anomaly_score))  # Convert to probability

        return {
            'is_anomaly': bool(is_anomaly[0]),
            'confidence': float(confidence[0]),
            'anomaly_score': float(anomaly_score[0])
        }

    def save_model(self, filepath):
        """Save trained model"""
        model_data = {
            'isolation_forest': self.isolation_forest,
            'scaler': self.scaler,
            'label_encoders': self.label_encoders,
            'feature_names': self.feature_names
        }
        joblib.dump(model_data, filepath)
        print(f"Model saved to {filepath}")

    def load_model(self, filepath):
        """Load trained model"""
        model_data = joblib.load(filepath)
        self.isolation_forest = model_data['isolation_forest']
        self.scaler = model_data['scaler']
        self.label_encoders = model_data['label_encoders']
        self.feature_names = model_data['feature_names']
        print(f"Model loaded from {filepath}")
        return self