import { useEffect, useState } from "react";
import api from "../services/api";
import { PageHeader, formatMoney } from "../components/Common";

export default function Dashboard() {
  const [s, setS] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    api
      .get("/dashboard/summary")
      .then((r) => setS(r.data.data))
      .catch((e) =>
        setErr(e.response?.data?.message || "Unable to load dashboard"),
      );
  }, []);
  const cards = [
    ["Customers", s?.customers],
    ["Suppliers", s?.suppliers],
    ["Active Shipments", s?.activeShipments],
    ["Delivered", s?.deliveredShipments],
    ["Pending Invoices", s?.pendingInvoices],
    ["Revenue", formatMoney(s?.revenue || 0)],
  ];
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Business overview for cargo, procurement and invoice operations."
      />
      {err && <div className="alert error">{err}</div>}
      <div className="cards">
        {cards.map(([a, b]) => (
          <div className="card" key={a}>
            <span>{a}</span>
            <strong>{b ?? 0}</strong>
          </div>
        ))}
      </div>
    </>
  );
}
