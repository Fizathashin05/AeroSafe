import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5121/api";

function App() {
  const [flightId, setFlightId] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [msg, setMsg] = useState("");

  async function createFlight() {
    const payload = {
      flightNumber: "AS" + Math.floor(Math.random()*9000+1000),
      aircraftId: "A320-TEST",
      scheduledDeparture: new Date().toISOString(),
      scheduledArrival: new Date(Date.now() + 2*3600*1000).toISOString()
    };
    const res = await axios.post(`${API}/flights`, payload);
    setFlightId(res.data.id);
    setMsg("Flight created: " + res.data.flightNumber);
  }

  async function sendTelemetry(lowFuel=false) {
    if (!flightId) { setMsg("Create a flight first"); return; }
    const payload = {
      flightId,
      latitude: 12.9716,
      longitude: 77.5946,
      altitude: 10000,
      speedKts: 250,
      fuelPercent: lowFuel ? 10 : 60,
      engineTempC: lowFuel ? 105 : 75
    };
    await axios.post(`${API}/telemetry`, payload);
    setMsg("Telemetry sent");
  }

  async function fetchAlerts() {
    if (!flightId) { setMsg("Create a flight first"); return; }
    const res = await axios.get(`${API}/alerts/flight/${flightId}`);
    setAlerts(res.data);
  }

  useEffect(() => {
    // poll alerts every 6 seconds
    const id = setInterval(() => {
      if (flightId) fetchAlerts();
    }, 6000);
    return () => clearInterval(id);
  }, [flightId]);

  return (
    <div style={{padding:20}}>
      <h1>AeroSafe Demo</h1>
      <button onClick={createFlight}>Create Flight</button>
      <button onClick={() => sendTelemetry(false)}>Send Normal Telemetry</button>
      <button onClick={() => sendTelemetry(true)}>Send Alert Telemetry</button>
      <button onClick={fetchAlerts}>Fetch Alerts</button>

      <p>{msg}</p>

      <h3>Alerts</h3>
      <ul>
        {alerts.map(a => (
          <li key={a.id}>
            [{a.severity}] {a.type} — {a.message} — {new Date(a.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
