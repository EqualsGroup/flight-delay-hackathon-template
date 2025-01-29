import express from "express";
import fs from "fs";
import { parse } from "csv-parse";

const app = express();
const port = 3010;

// Year,Month,DayofMonth,DayOfWeek,Carrier,OriginAirportID,OriginAirportName,OriginCity,OriginState,DestAirportID,DestAirportName,DestCity,DestState,CRSDepTime,DepDelay,DepDel15,CRSArrTime,ArrDelay,ArrDel15,Cancelled
const originAirportIdIndex = 5;
const originAirportNameIndex = 6;
const destAirportIdIndex = 9;
const destAirportNameIndex = 10;
const carrierIndex = 4;

type Airport = {
  name: string;
  id: string;
};

let allCarriers: string[] = [];
let allAirports: Airport[] = [];

readFlightsData();

app.get("/airports", (req, res) => {
  const name = req.query.name as string;
  if (name) {
    const filteredAirports = allAirports.filter((airport: Airport) =>
      airport.name.toLowerCase().includes(name.toLowerCase())
    );
    res.json(filteredAirports);
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

app.get("/delay", (req, res) => {});

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
      const airportsMap = new Map<string, string>();
      records.forEach((record: any, index: number) => {
        if (!index) {
          return;
        }

        carriersSet.add(record[carrierIndex]);

        const originAirportName = record[originAirportNameIndex];
        if (!airportsMap.has(record[originAirportNameIndex])) {
          const airportId = record[originAirportIdIndex];
          airportsMap.set(originAirportName, airportId);
        }

        const destAirportName = record[destAirportNameIndex];
        if (!airportsMap.has(destAirportName)) {
          const airportId = record[destAirportIdIndex];
          airportsMap.set(destAirportName, airportId);
        }
      });

      allCarriers = Array.from(carriersSet);

      for (const [name, id] of airportsMap.entries()) {
        allAirports.push({ id, name });
      }
    });
  });
}
