import express from 'express';

const app = express();
const port = 3000;

app.get('/airports', (req, res) => {
  res.json({});
});

app.get('/carriers', (req, res) => {
  res.json({});
});

app.get('/delay', (req, res) => {
  res.json({});
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});