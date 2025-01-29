from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:*"}})  # Enable CORS for localhost

# Load the model
with open('../fd_model_logistric_regression.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    origin_airport_id = data.get('originAirportId')
    dest_airport_id = data.get('destAirportId')
    carrier_id = data.get('carrierId')
    date = data.get('date')

    prediction_case = {
        'Carrier_Encoded': carrier_id,
        'DayofMonth': date.day,
        'DayOfWeek': date.weekday(),
        'Month': date.month,
        'DestAirportID': dest_airport_id,
        'OriginAirportID': origin_airport_id,
    }

    # print prediction_case
    print(prediction_case)

    # Convert to DataFrame with same structure as training data
    test_input = pd.DataFrame([random_test_case])

    # Scale the input
    scaled_input = loaded_scaler.transform(test_input)


    # Assuming the model expects these features in a specific order
    prediction = model.predict_proba(scaled_input)[0]
    
    return jsonify({'prediction': prediction.tolist()})

if __name__ == '__main__':
    app.run(port=5000)
    print('Flask server is running on port 5000')

# Create a random test case
random_test_case = {
}


# Make prediction