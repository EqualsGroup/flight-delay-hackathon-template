from flask import Flask, request, jsonify
from flask_cors import CORS
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
    
    # Add carrier mapping from file carrierEncodingDictionary.txt
    carrier_mapping = {
        '9E': 0,
        'AA': 1,
        'AS': 2,
        'B6': 3,
        'DL': 4,
        'EV': 5,
        'F9': 6,
        'FL': 7,
        'HA': 8,
        'MQ': 9,
        'OO': 10,
        'UA': 11,
        'US': 12,
        'VX': 13,
        'WN': 14,
        'YV': 15
    }
    
    # Convert airport ids from strings to integers
    origin_airport_id = int(data.get('originAirportId'))
    dest_airport_id = int(data.get('destAirportId'))
    # Map carrier string (e.g. "UA") to its encoded number:
    carrier_str = data.get('carrierId')
    carrier_id = carrier_mapping.get(carrier_str, -1)
    dayOfWeek = data.get('dayOfWeek')
    month = data.get('month')
    dayOfMonth = data.get('dayOfMonth')
    prediction_case = {
        'Carrier_Encoded': carrier_id,
        'DayofMonth': dayOfMonth,
        'DayOfWeek': dayOfWeek,
        'Month': month,
        'DestAirportID': dest_airport_id,
        'OriginAirportID': origin_airport_id,
    }
    print(prediction_case)

    # Convert to DataFrame with same structure as training data
    test_input = pd.DataFrame([prediction_case])

    # Scale the input
    scaled_input = loaded_scaler.transform(test_input)
    print(scaled_input)
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
