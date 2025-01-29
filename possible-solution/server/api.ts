import express from 'express';
import csv from 'csv-parser';
import fs from 'fs';
import { parse } from 'date-fns';
import pickle from 'picklejs';

const app = express();
const port = 3000;

interface Airport {
  OriginAirportID: number;
  OriginAirportName: string;
}

const airports: Airport[] = [];

const model = pickle.load(fs.readFileSync('data/model.pkl'));

// Load airports data from CSV
fs.createReadStream('airports.csv')
  .pipe(csv())
  .on('data', (row) => {
    airports.push({
      OriginAirportID: parseInt(row.OriginAirportID),
      OriginAirportName: row.OriginAirportName,
    });
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

// GET endpoint to return list of airports
app.get('/airports', (req, res) => {
  const { name } = req.query;
  let filteredAirports = airports;

  if (name) {
    filteredAirports = airports.filter((airport) =>
      airport.OriginAirportName.toLowerCase().includes((name as string).toLowerCase())
    );
  }

  res.json(filteredAirports);
});

app.get('/delay', (req, res) => {
  const { airport_id, date } = req.query;

  if (!airport_id || !date) {
    return res.status(400).json({ error: 'Missing required query parameters: airport_id and date' });
  }

  const parsedDate = parse(date as string, 'yyyy-MM-dd', new Date());
  const dayOfWeek = parsedDate.getDay() + 1; // getDay() returns 0 for Sunday, 1 for Monday, etc.

  const prediction = model.predict_proba([[dayOfWeek, parseInt(airport_id as string)]]);
  const delayProbability = prediction[0][1]; // probability of delay

  res.json({ delayProbability });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
