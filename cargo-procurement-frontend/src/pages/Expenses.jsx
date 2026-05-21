import { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";
import { Empty, PageHeader, formatMoney, getName } from "../components/Common";

export default function Expenses() {
  const [rows, setRows] = useState([]),
    [shipments, setShipments] = useState([]),
    [procurements, setProcurements] = useState([]),
    [show, setShow] = useState(false);
  const [form, setForm] = useState({
    shipmentId: "",
    procurementId: "",
    type: "Fuel",
    amount: 0,
    currency: "BTN",
    note: "",
    date: "",
  });
  const load = () =>
    Promise.all([
      api.get("/expenses"),
      api.get("/shipments"),
      api.get("/procurements"),
    ]).then(([a, b, c]) => {
      setRows(a.data.data);
      setShipments(b.data.data);
      setProcurements(c.data.data);
    });
  useEffect(() => {
    load();
  }, []);
  const save = async (e) => {
    e.preventDefault();
    await api.post("/expenses", {
      ...form,
      shipmentId: form.shipmentId || undefined,
      procurementId: form.procurementId || undefined,
      amount: +form.amount,
      date: form.date || undefined,
    });
    setShow(false);
    load();
  };
  return (
    <>
      <PageHeader
        title="Expenses"
        subtitle="Track customs, fuel, warehouse, driver and other costs."
      />
      <button className="btn primary" onClick={() => setShow(true)}>
        + Add Expense
      </button>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Shipment</th>
              <th>Procurement</th>
              <th>Date</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x._id}>
                <td>{x.type}</td>
                <td>{formatMoney(x.amount, x.currency)}</td>
                <td>{getName(x, "shipmentId")}</td>
                <td>{getName(x, "procurementId")}</td>
                <td>{new Date(x.date).toLocaleDateString()}</td>
                <td>{x.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <Empty />}
      </div>
      {show && (
        <Modal title="Add Expense" onClose={() => setShow(false)}>
          <form className="grid-form" onSubmit={save}>
            <select
              value={form.shipmentId}
              onChange={(e) => setForm({ ...form, shipmentId: e.target.value })}
            >
              <option value="">Select shipment</option>
              {shipments.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.trackingNo}
                </option>
              ))}
            </select>
            <select
              value={form.procurementId}
              onChange={(e) =>
                setForm({ ...form, procurementId: e.target.value })
              }
            >
              <option value="">Select procurement</option>
              {procurements.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.requestNo}
                </option>
              ))}
            </select>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {[
                "Fuel",
                "Customs",
                "Warehouse",
                "Driver",
                "Packaging",
                "Other",
              ].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <input
              type="number"
              required
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <select
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            >
              {["BTN", "INR", "USD", "CNY"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <textarea
              placeholder="Note"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
            <button className="btn primary">Save</button>
          </form>
        </Modal>
      )}
    </>
  );
}
