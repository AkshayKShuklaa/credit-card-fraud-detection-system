from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        amount = float(data.get('amount', 0))
        merchant = data.get('merchant', '')
        location = data.get('location', '')

        # Mock ML Model Prediction
        # In a real scenario, you would load a trained .pkl model here
        # e.g., model = joblib.load('model.pkl')
        # prediction = model.predict(features)
        
        # Simple heuristic for mock prediction
        fraud_score = random.uniform(0, 0.2) # Base low risk
        
        # 1. High Value Transactions
        if amount >= 10000:
            fraud_score += 0.8  # Guaranteed Fraud (Score > 0.8)
        elif amount > 5000:
            fraud_score += 0.5  # Likely Fraud (Score ~ 0.5 - 0.7)
        elif amount > 1000:
            fraud_score += 0.2  # Suspicious (Score ~ 0.2 - 0.4)
            
        # 2. Suspicious Merchant Names
        if len(merchant) > 15:
            fraud_score += 0.15
            
        # 3. High-Risk Locations
        if location.lower() in ['unknown', 'darkweb', 'international']:
            fraud_score += 0.3
            
        # Cap the score at 0.99
        fraud_score = min(fraud_score, 0.99)
        
        # Threshold: Any score strictly greater than 0.65 is marked as FRAUD
        is_fraud = fraud_score > 0.65

        response = {
            'isFraud': is_fraud,
            'fraudScore': round(fraud_score, 4)
        }
        
        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
