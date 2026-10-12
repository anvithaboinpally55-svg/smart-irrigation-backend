
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// All readings in this version are simulated.
// No physical sensor or water pump is connected.
let soilMoisture = 25;
let pumpOn = true;

let temperature = 30;
let humidity = 62;

const history = [
  { soilMoisture: 35, time: new Date().toISOString() },
  { soilMoisture: 32, time: new Date().toISOString() },
  { soilMoisture: 30, time: new Date().toISOString() },
  { soilMoisture: 28, time: new Date().toISOString() },
  { soilMoisture: 25, time: new Date().toISOString() }
];

function applyIrrigationLogic(moisture) {
  if (moisture < 30) {
    pumpOn = true;
  } else if (moisture >= 60) {
    pumpOn = false;
  }
  // Between 30% and 59%, retain the previous pump state.
}

function getStatus() {
  return {
    soilMoisture,
    pumpOn,
    temperature,
    humidity,
    history,
    simulated: true,
    message: "Demo mode: no physical pump is connected."
  };
}

app.get("/", (req, res) => {
  res.json({
    message: "Smart Irrigation API is running.",
    simulated: true
  });
});

app.get("/api/status", (req, res) => {
  res.json(getStatus());
});

app.post("/api/simulate", (req, res) => {
  const moisture = Number(req.body.soilMoisture);

  if (
    req.body.soilMoisture === undefined ||
    req.body.soilMoisture === null ||
    req.body.soilMoisture === "" ||
    !Number.isFinite(moisture) ||
    moisture < 0 ||
    moisture > 100
  ) {
    return res.status(400).json({
      error: "Soil moisture must be a number between 0 and 100."
    });
  }

  soilMoisture = moisture;

  // Simulated environmental values for demonstration only.
  temperature = Math.floor(Math.random() * 11) + 25;
  humidity = Math.floor(Math.random() * 31) + 50;

  applyIrrigationLogic(soilMoisture);

  history.push({
    soilMoisture,
    time: new Date().toISOString()
  });

  if (history.length > 10) {
    history.shift();
  }

  res.json(getStatus());
});

app.listen(PORT, () => {
  console.log(`Smart Irrigation API running on port ${PORT}`);
  console.log("Demo mode: sensor readings and pump status are simulated.");
});
