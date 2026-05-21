import { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";
import { Empty, PageHeader, formatMoney, getName } from "../components/Common";

export default function Procurements() {
  const [rows, setRows] = useState([]),
    [customers, setCustomers] = useState([]),
    [suppliers, setSuppliers] = useState([]),
    [show, setShow] = useState(false);
  const [form, setForm] = useState({
    customerId: "",
    supplierId: "",
    currency: "BTN",
    itemName: "",
    quantity: 1,
    unitPrice: 0,
    note: "",
  });
  const load = () =>
    Promise.all([
      api.get("/procurements"),
      api.get("/customers"),
      api.get("/suppliers"),
    ]).then(([a, b, c]) => {
      setRows(a.data.data);
      setCustomers(b.data.data);
      setSuppliers(c.data.data);
    });
  useEffect(() => {
    load();
  }, []);
  const save = async (e) => {
    e.preventDefault();
    await api.post("/procurements", {
      customerId: form.customerId,
      supplierId: form.supplierId || undefined,
      currency: form.currency,
      note: form.note,
      items: [
        {
          itemName: form.itemName,
          quantity: +form.quantity,
          unitPrice: +form.unitPrice,
          total: 0,
        },
      ],
    });
    setShow(false);
    load();
  };
  const updateStatus = async (id, status) => {
    await api.put("/procurements/" + id, { status });
    load();
  };
  return (
    <>
      <PageHeader
        title="Procurement"
        subtitle="Create purchase requests and purchase orders."
      />
      <button className="btn primary" onClick={() => setShow(true)}>
        + New Procurement
      </button>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Request No</th>
              <th>Customer</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Total</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x._id}>
                <td>{x.requestNo}</td>
                <td>{getName(x, "customerId")}</td>
                <td>{getName(x, "supplierId")}</td>
                <td>
                  <span className="badge">{x.status}</span>
                </td>
                <td>{formatMoney(x.totalAmount, x.currency)}</td>
                <td>
                  <select
                    value={x.status}
                    onChange={(e) => updateStatus(x._id, e.target.value)}
                  >
                    {[
                      "Requested",
                      "Approved",
                      "Purchased",
                      "Shipped",
                      "Completed",
                      "Cancelled",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <Empty />}
      </div>
      {show && (
        <Modal title="New Procurement" onClose={() => setShow(false)}>
          <form className="grid-form" onSubmit={save}>
            <select
              required
              value={form.customerId}
              onChange={(e) => setForm({ ...form, customerId: e.target.value })}
            >
              <option value="">Select customer</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.customerName}
                </option>
              ))}
            </select>
            <select
              value={form.supplierId}
              onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
            >
              <option value="">Select supplier</option>
              {suppliers.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.supplierName}
                </option>
              ))}
            </select>
            <input
              placeholder="Item name"
              required
              value={form.itemName}
              onChange={(e) => setForm({ ...form, itemName: e.target.value })}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
            <input
              type="number"
              placeholder="Unit price"
              value={form.unitPrice}
              onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
            />
            <select
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            >
              {["BTN", "INR", "USD", "CNY"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
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
