from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:*"}})  # Enable CORS for localhost

# Load the model
with open('../fd_model_logistric_regression.pkl', 'rb') as file:
    loaded_model = pickle.load(file)
    
with open('../fd_model_logistric_regression_scaler.pkl', 'rb') as f:
    loaded_scaler = pickle.load(f)



@app.route('/', methods=['GET'])
def index():
    return 'Hello, World!'


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()


    origin_airport_id = data.get('originAirportId')
    dest_airport_id = data.get('destAirportId')
    carrier_id = data.get('carrierId')
    dayOfWeek=data.get('dayOfWeek')
    month=data.get('month')
    dayOfMonth=data.get('dayOfMonth')
    prediction_case = {
        'Carrier_Encoded': carrier_id,
        'DayofMonth': dayOfMonth,
        'DayOfWeek': dayOfWeek,
        'Month': month,
        'DestAirportID': dest_airport_id,
        'OriginAirportID': origin_airport_id,
    }

    # Convert to DataFrame with same structure as training data
    test_input = pd.DataFrame([prediction_case])

    # Scale the input
    scaled_input = loaded_scaler.transform(test_input)
    prediction_prob = loaded_model.predict_proba(scaled_input)[0]


    print(f"Probability of On-Time: {prediction_prob[0]:.2%}")
    print(f"Probability of Delay: {prediction_prob[1]:.2%}")
    
    return jsonify({
        'onTime': float(prediction_prob[0]),
        'delayed': float(prediction_prob[1])
    })

if __name__ == '__main__':
    app.run(port=5000)
    print('Flask server is running on port 5000')

# Create a random test case
random_test_case = {
}


# Make prediction