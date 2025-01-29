import express from "express";
import fs from "fs";
import { parse } from "csv-parse";

const app = express();
const port = 3010;

let allCarriers: string[] = [];
let allAirports: string[] = [];

readFlightsData();

app.get("/airports", (req, res) => {
  const name = req.query.name;
  if (name) {
    res.json(
      allAirports.filter((airport: string) =>
        airport.toLowerCase().includes(name.toString().toLowerCase())
      )
    );
    return;
  }

  res.json(allAirports);
});

app.get("/carriers", (req, res) => {
  // get the name query parameter
  const name = req.query.name;

  // if the name query parameter is provided then filter the carriers
  if (name) {
    res.json(
      allCarriers.filter((carrier: string) =>
        carrier.toLowerCase().includes(name.toString().toLowerCase())
      )
    );
    return;
  }

  // otherwise return all carriers
  res.json(allCarriers);
});

app.get("/delay", (req, res) => {
  res.json({});
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// a function to read flights data from ../../data/flights.csv
// and return it as json
function readFlightsData() {
  // read the CSV file and store it in an array
  fs.readFile(__dirname + "/../../data/flights.csv", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }

    parse(data, { delimiter: "," }, (err, records: any[]) => {
      if (err) {
        console.error("Error parsing the CSV data:", err);
        return;
      }

      const carriersSet = new Set<string>();
      const airportsSet = new Set<string>();
      records.forEach((record: any, index: number) => {
        if (!index) {
          return;
        }

        carriersSet.add(record[4]);

        airportsSet.add(record[6]);
        airportsSet.add(record[10]);
      });

      allCarriers = Array.from(carriersSet);
      allAirports = Array.from(airportsSet);
      console.log({ allCarriers, allAirports });
    });
  });
}
