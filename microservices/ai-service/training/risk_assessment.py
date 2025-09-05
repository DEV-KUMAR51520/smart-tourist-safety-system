# training/risk_assessment.py
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix
import joblib
from datetime import datetime, timedelta

class TouristRiskAssessment:
    def __init__(self):
        self.risk_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.encoders = {}

    def create_risk_training_data(self, n_samples=5000):
        """Create synthetic risk assessment training data"""
        np.random.seed(42)
        data = []

        # Define risk factors and their weights
        risk_factors = {
            'weather_risk': ['clear', 'cloudy', 'rain', 'storm', 'fog'],
            'terrain_type': ['urban', 'forest', 'mountain', 'river', 'desert'],
            'time_of_day': ['morning', 'afternoon', 'evening', 'night'],
            'season': ['spring', 'summer', 'monsoon', 'winter'],
            'tourist_experience': ['beginner', 'intermediate', 'expert'],
            'group_size': [1, 2, 3, 4, 5, 6, 7, 8],
            'has_guide': [0, 1],
            'emergency_equipment': [0, 1]
        }

        # Risk level mapping
        def calculate_risk_level(weather, terrain, time, season, experience, group, guide, equipment):
            risk_score = 0

            # Weather risk
            weather_risk = {'clear': 0, 'cloudy': 1, 'rain': 3, 'storm': 5, 'fog': 4}
            risk_score += weather_risk[weather]

            # Terrain risk
            terrain_risk = {'urban': 0, 'forest': 2, 'mountain': 4, 'river': 3, 'desert': 4}
            risk_score += terrain_risk[terrain]

            # Time risk
            time_risk = {'morning': 1, 'afternoon': 0, 'evening': 2, 'night': 4}
            risk_score += time_risk[time]

            # Season risk (specific to Northeast India)
            season_risk = {'spring': 1, 'summer': 2, 'monsoon': 4, 'winter': 2}
            risk_score += season_risk[season]

            # Experience modifier
            exp_modifier = {'beginner': 2, 'intermediate': 0, 'expert': -1}
            risk_score += exp_modifier[experience]

            # Group size (lone travelers are riskier)
            if group == 1:
                risk_score += 2
            elif group > 5:
                risk_score += 1

            # Safety equipment
            risk_score -= guide * 2  # Guide reduces risk
            risk_score -= equipment * 1  # Equipment reduces risk

            # Convert to categorical risk level
            if risk_score <= 2:
                return 'low'
            elif risk_score <= 5:
                return 'medium'
            elif risk_score <= 8:
                return 'high'
            else:
                return 'critical'

        # Generate samples
        for _ in range(n_samples):
            weather = np.random.choice(risk_factors['weather_risk'])
            terrain = np.random.choice(risk_factors['terrain_type'])
            time = np.random.choice(risk_factors['time_of_day'])
            season = np.random.choice(risk_factors['season'])
            experience = np.random.choice(risk_factors['tourist_experience'])
            group_size = np.random.choice(risk_factors['group_size'])
            has_guide = np.random.choice(risk_factors['has_guide'])
            emergency_equipment = np.random.choice(risk_factors['emergency_equipment'])

            risk_level = calculate_risk_level(
                weather, terrain, time, season, experience, 
                group_size, has_guide, emergency_equipment
            )

            # Add some additional numerical features
            elevation = np.random.normal(1000, 500) if terrain == 'mountain' else np.random.normal(100, 50)
            temperature = np.random.normal(25, 10)
            humidity = np.random.normal(70, 20)

            data.append([
                weather, terrain, time, season, experience, group_size,
                has_guide, emergency_equipment, elevation, temperature,
                humidity, risk_level
            ])

        df = pd.DataFrame(data, columns=[
            'weather_risk', 'terrain_type', 'time_of_day', 'season',
            'tourist_experience', 'group_size', 'has_guide',
            'emergency_equipment', 'elevation', 'temperature',
            'humidity', 'risk_level'
        ])

        return df

    def train(self, df):
        """Train the risk assessment model"""
        # Encode categorical variables
        categorical_cols = ['weather_risk', 'terrain_type', 'time_of_day', 'season', 'tourist_experience']

        df_encoded = df.copy()

        for col in categorical_cols:
            encoder = LabelEncoder()
            df_encoded[f'{col}_encoded'] = encoder.fit_transform(df[col])
            self.encoders[col] = encoder

        # Features and target
        feature_cols = [
            'weather_risk_encoded', 'terrain_type_encoded', 'time_of_day_encoded',
            'season_encoded', 'tourist_experience_encoded', 'group_size',
            'has_guide', 'emergency_equipment', 'elevation', 'temperature', 'humidity'
        ]

        X = df_encoded[feature_cols]
        y = df_encoded['risk_level']

        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        # Scale numerical features
        numerical_cols = ['group_size', 'elevation', 'temperature', 'humidity']
        X_train_scaled = X_train.copy()
        X_test_scaled = X_test.copy()

        X_train_scaled[numerical_cols] = self.scaler.fit_transform(X_train[numerical_cols])
        X_test_scaled[numerical_cols] = self.scaler.transform(X_test[numerical_cols])

        # Train model
        self.risk_model.fit(X_train_scaled, y_train)

        # Evaluate
        train_score = self.risk_model.score(X_train_scaled, y_train)
        test_score = self.risk_model.score(X_test_scaled, y_test)

        print(f"Training completed!")
        print(f"Train accuracy: {train_score:.3f}")
        print(f"Test accuracy: {test_score:.3f}")

        # Cross-validation
        cv_scores = cross_val_score(self.risk_model, X_train_scaled, y_train, cv=5)
        print(f"CV accuracy: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")

        # Feature importance
        feature_importance = pd.DataFrame({
            'feature': feature_cols,
            'importance': self.risk_model.feature_importances_
        }).sort_values('importance', ascending=False)

        print("\nTop 5 Important Features:")
        print(feature_importance.head())

        return self

    def predict_risk(self, conditions):
        """Predict risk level for given conditions"""
        # Convert to DataFrame
        if isinstance(conditions, dict):
            df = pd.DataFrame([conditions])
        else:
            df = pd.DataFrame(conditions)

        # Encode categorical variables
        df_encoded = df.copy()
        categorical_cols = ['weather_risk', 'terrain_type', 'time_of_day', 'season', 'tourist_experience']

        for col in categorical_cols:
            if col in df.columns and col in self.encoders:
                df_encoded[f'{col}_encoded'] = self.encoders[col].transform(df[col])

        # Prepare features
        feature_cols = [
            'weather_risk_encoded', 'terrain_type_encoded', 'time_of_day_encoded',
            'season_encoded', 'tourist_experience_encoded', 'group_size',
            'has_guide', 'emergency_equipment', 'elevation', 'temperature', 'humidity'
        ]

        X = df_encoded[feature_cols]

        # Scale numerical features
        numerical_cols = ['group_size', 'elevation', 'temperature', 'humidity']
        X_scaled = X.copy()
        X_scaled[numerical_cols] = self.scaler.transform(X[numerical_cols])

        # Predict
        prediction = self.risk_model.predict(X_scaled)[0]
        probabilities = self.risk_model.predict_proba(X_scaled)[0]

        # Get probability for each class
        classes = self.risk_model.classes_
        prob_dict = {cls: prob for cls, prob in zip(classes, probabilities)}

        return {
            'risk_level': prediction,
            'probabilities': prob_dict,
            'confidence': max(probabilities)
        }

    def save_model(self, filepath):
        """Save the trained model"""
        model_data = {
            'risk_model': self.risk_model,
            'scaler': self.scaler,
            'encoders': self.encoders
        }
        joblib.dump(model_data, filepath)
        print(f"Risk assessment model saved to {filepath}")

    def load_model(self, filepath):
        """Load the trained model"""
        model_data = joblib.load(filepath)
        self.risk_model = model_data['risk_model']
        self.scaler = model_data['scaler']
        self.encoders = model_data['encoders']
        print(f"Risk assessment model loaded from {filepath}")
        return self