import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function ShipmentTrack() {
  const [trackingNo, setTrackingNo] = useState(""),
    [item, setItem] = useState(null),
    [err, setErr] = useState("");
  const search = async (e) => {
    e.preventDefault();
    setErr("");
    setItem(null);
    try {
      const r = await api.get("/shipments/track/" + trackingNo);
      setItem(r.data.data);
    } catch (e) {
      setErr(e.response?.data?.message || "Tracking not found");
    }
  };
  return (
    <div className="auth-page">
      <div className="track-card">
        <h1>Track Shipment</h1>
        <form onSubmit={search} className="track-form">
          <input
            placeholder="Enter tracking number"
            value={trackingNo}
            onChange={(e) => setTrackingNo(e.target.value)}
          />
          <button className="btn primary">Track</button>
        </form>
        {err && <div className="alert error">{err}</div>}
        {item && (
          <div className="result">
            <h2>{item.trackingNo}</h2>
            <p>
              <b>Status:</b> {item.status}
            </p>
            <p>
              <b>Origin:</b> {item.originCountry}
            </p>
            <p>
              <b>Destination:</b> {item.destination}
            </p>
            <h3>Status History</h3>
            {item.statusHistory?.map((h, i) => (
              <div className="timeline" key={i}>
                <b>{h.status}</b>
                <span>{h.location}</span>
                <small>{new Date(h.date).toLocaleString()}</small>
                <p>{h.note}</p>
              </div>
            ))}
          </div>
        )}
        <Link to="/login">Back to login</Link>
      </div>
    </div>
  );
}
