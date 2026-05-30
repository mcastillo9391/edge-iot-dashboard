import { useEffect, useState } from "react";

import axios from "axios";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import "./App.css";

const TELEMETRY_API =
  "https://func-edge-iot-mqtt-dsgvcgaucfdab9f8.canadacentral-01.azurewebsites.net/api/telemetry/latest";

const ALERTS_API =
  "https://func-edge-iot-mqtt-dsgvcgaucfdab9f8.canadacentral-01.azurewebsites.net/api/alerts/latest";

const COLORS = [
  "#38bdf8",
  "#22c55e",
  "#ef4444",
  "#f59e0b",
  "#a855f7",
  "#14b8a6"
];

const getColorMap = (ids) => {

  const map = {};

  ids.forEach((id, i) => {

    map[id] = COLORS[i % COLORS.length];
  });

  return map;
};

function App() {

  const [devices, setDevices] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [colorMap, setColorMap] = useState({});
  const [alertLevel, setAlertLevel] = useState("ok");

  const loadData = async () => {

    try {

      const telemetryRes =
        await axios.get(TELEMETRY_API);

      const alertsRes =
        await axios.get(ALERTS_API);

      const telemetryItems =
        telemetryRes.data.data || [];

      const alertItems =
        alertsRes.data.data || [];

      setAlerts(alertItems);

      const grouped = {};

      telemetryItems.forEach((item) => {

        if (!grouped[item.device_id]) {

          grouped[item.device_id] = [];
        }

        grouped[item.device_id].push(item);
      });

      Object.keys(grouped).forEach((k) => {

        grouped[k] = grouped[k].reverse();
      });

      const ids = Object.keys(grouped);

      setDevices(grouped);

      setColorMap(
        getColorMap(ids)
      );

      if (
        !selectedDevice ||
        !ids.includes(selectedDevice)
      ) {

        setSelectedDevice(ids[0]);
      }

      const latestDevices =
        Object.values(grouped).map(
          (d) => d[d.length - 1]
        );

      const hasIntrusion =
        latestDevices.some(
          (d) =>
            d?.event_type &&
            d.event_type !== "normal"
        );

      const hasAnomaly =
        latestDevices.some(
          (d) => d?.future_anomaly
        );

      if (hasIntrusion) {

        setAlertLevel("danger");
      }
      else if (hasAnomaly) {

        setAlertLevel("warning");
      }
      else {

        setAlertLevel("ok");
      }

    }
    catch (err) {

      console.error(err);
    }
  };

  useEffect(() => {

    loadData();

    const interval =
      setInterval(loadData, 4000);

    return () => clearInterval(interval);

  }, [selectedDevice]);

  if (
    !selectedDevice ||
    !devices[selectedDevice]
  ) {

    return (

      <div className="loading">
        Loading Edge AI SOC Dashboard...
      </div>
    );
  }

  const data = devices[selectedDevice];

  const latest =
    data[data.length - 1];

  const confidence =
    latest.event_confidence != null
      ? latest.event_confidence * 100
      : null;

  return (

    <div className="container">

      {/* SOC BANNER */}

      <div className={`soc-banner ${alertLevel}`}>

        {alertLevel === "danger" &&
          "🚨 SECURITY ALERT DETECTED"}

        {alertLevel === "warning" &&
          "⚠️ AI ANOMALY DETECTED"}

        {alertLevel === "ok" &&
          "🟢 SYSTEM NORMAL"}

      </div>

      {/* HEADER */}

      <div className="header">

        <div>

          <h1>
            Edge AI SOC Dashboard
          </h1>

          <p>
            ESP32 + Azure IoT Hub + Cosmos DB + Telegram
          </p>

        </div>

        <div className="status-badge">
          LIVE SYSTEM
        </div>

      </div>

      {/* STATS */}

      <div className="stats-grid">

        <div className="glass-card">

          <span>Devices</span>

          <h2>
            {Object.keys(devices).length}
          </h2>

        </div>

        <div className="glass-card">

          <span>Alerts</span>

          <h2 className="danger">
            {alerts.length}
          </h2>

        </div>

      </div>

      {/* MAIN GRID */}

      <div className="main-grid">

        {/* SIDEBAR */}

        <div className="sidebar">

          <h3>Devices</h3>

          {Object.keys(devices).map((id) => {

            const last =
              devices[id][
                devices[id].length - 1
              ];

            return (

              <div
                key={id}
                className={`device-item ${
                  selectedDevice === id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedDevice(id)
                }
              >

                <div>

                  <strong>{id}</strong>

                  <p>
                    {last.temperature}°C
                  </p>

                </div>

                <div
                  className="device-indicator"
                  style={{
                    background:
                      colorMap[id]
                  }}
                />

              </div>
            );
          })}

        </div>

        {/* DETAIL */}

        <div className="detail-panel">

          <div className="detail-header">

            <div>

              <h2>
                {selectedDevice}
              </h2>

              <p>
                {new Date(
                  latest.timestamp
                ).toLocaleString()}
              </p>

            </div>

            <div
              className={`status ${
                latest.event_type !== "normal"
                  ? "danger-bg"
                  : latest.future_anomaly
                  ? "warning-bg"
                  : "success-bg"
              }`}
            >

              {latest.event_type || "normal"}

            </div>

          </div>

          {/* METRICS */}

          <div className="telemetry-grid">

            <div className="metric-card">

              <span>Temperature</span>

              <h1>
                {latest.temperature}°C
              </h1>

            </div>

            <div className="metric-card">

              <span>Humidity</span>

              <h1>
                {latest.humidity}%
              </h1>

            </div>

            <div className="metric-card">

              <span>Vision</span>

              <h1
                className={
                  latest.vision_person
                    ? "danger"
                    : "success"
                }
              >

                {latest.vision_person
                  ? "PERSON"
                  : "CLEAR"}

              </h1>

            </div>

            <div className="metric-card">

              <span>Future Anomaly</span>

              <h1
                className={
                  latest.future_anomaly
                    ? "danger"
                    : "success"
                }
              >

                {latest.future_anomaly
                  ? "YES"
                  : "NO"}

              </h1>

            </div>

            {confidence != null && (

              <div className="metric-card">

                <span>AI Confidence</span>

                <h1
                  className={
                    confidence > 80
                      ? "success"
                      : confidence > 50
                      ? "warning"
                      : "danger"
                  }
                >

                  {confidence.toFixed(1)}%

                </h1>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* CHARTS */}

      <div className="charts-section">

        <div className="chart-card">

          <h3>Temperature Streams</h3>

          <ResponsiveContainer
            width="100%"
            height={260}
          >

            <LineChart data={data}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis hide />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={false}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        <div className="chart-card">

          <h3>Humidity Streams</h3>

          <ResponsiveContainer
            width="100%"
            height={260}
          >

            <LineChart data={data}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis hide />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* SENSOR TABLE */}

      <div className="table-section">

        <div className="table-card">

          <div className="table-header">

            <h3>Sensor Telemetry</h3>

          </div>

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>Device</th>
                  <th>Temperature</th>
                  <th>Humidity</th>
                  <th>Timestamp</th>

                </tr>

              </thead>

              <tbody>

                {data
                  .slice()
                  .reverse()
                  .map((item, index) => (

                    <tr key={index}>

                      <td>
                        {item.device_id}
                      </td>

                      <td>
                        {item.temperature}°C
                      </td>

                      <td>
                        {item.humidity}%
                      </td>

                      <td>

                        {new Date(
                          item.timestamp
                        ).toLocaleString()}

                      </td>

                    </tr>

                  ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* AI TABLE */}

      <div className="table-section">

        <div className="table-card">

          <div className="table-header">

            <h3>Edge AI Predictions</h3>

          </div>

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>Vision</th>
                  <th>Anomaly</th>
                  <th>Event</th>
                  <th>Confidence</th>
                  <th>Timestamp</th>

                </tr>

              </thead>

              <tbody>

                {data
                  .slice()
                  .reverse()
                  .map((item, index) => (

                    <tr key={index}>

                      <td>

                        <span
                          className={`table-badge ${
                            item.vision_person
                              ? "danger-bg"
                              : "success-bg"
                          }`}
                        >

                          {item.vision_person
                            ? "PERSON"
                            : "CLEAR"}

                        </span>

                      </td>

                      <td>

                        <span
                          className={`table-badge ${
                            item.future_anomaly
                              ? "warning-bg"
                              : "success-bg"
                          }`}
                        >

                          {item.future_anomaly
                            ? "YES"
                            : "NO"}

                        </span>

                      </td>

                      <td>

                        <span
                          className={`table-badge ${
                            item.event_type !== "normal"
                              ? "danger-bg"
                              : "success-bg"
                          }`}
                        >

                          {item.event_type}

                        </span>

                      </td>

                      <td>

                        {item.event_confidence
                          ? `${(
                              item.event_confidence * 100
                            ).toFixed(1)}%`
                          : "-"}

                      </td>

                      <td>

                        {new Date(
                          item.timestamp
                        ).toLocaleString()}

                      </td>

                    </tr>

                  ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* ALERTS TABLE */}

      <div className="table-section">

        <div className="table-card">

          <div className="table-header">

            <h3>Security Alerts</h3>

          </div>

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>Alert</th>
                  <th>Device</th>
                  <th>Temperature</th>
                  <th>Humidity</th>
                  <th>Timestamp</th>

                </tr>

              </thead>

              <tbody>

                {alerts.map((alert, index) => (

                  <tr key={index}>

                    <td>

                      <span
                        className={`table-badge ${
                          alert.alert_type ===
                          "future_anomaly"
                            ? "warning-bg"
                            : "danger-bg"
                        }`}
                      >

                        {alert.alert_type}

                      </span>

                    </td>

                    <td>
                      {alert.device_id}
                    </td>

                    <td>
                      {alert.temperature}°C
                    </td>

                    <td>
                      {alert.humidity}%
                    </td>

                    <td>

                      {new Date(
                        alert.timestamp
                      ).toLocaleString()}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;