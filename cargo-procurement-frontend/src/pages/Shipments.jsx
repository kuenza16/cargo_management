import { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";
import { Empty, PageHeader, getName } from "../components/Common";

export default function Shipments() {
  const [rows, setRows] = useState([]),
    [customers, setCustomers] = useState([]),
    [procurements, setProcurements] = useState([]),
    [show, setShow] = useState(false),
    [uploadId, setUploadId] = useState("");
  const [form, setForm] = useState({
    customerId: "",
    procurementId: "",
    originCountry: "India",
    originAddress: "",
    destination: "Thimphu, Bhutan",
    weight: 0,
    packageCount: 1,
    shippingMode: "Road",
    estimatedDeliveryDate: "",
  });
  const load = () =>
    Promise.all([
      api.get("/shipments"),
      api.get("/customers"),
      api.get("/procurements"),
    ]).then(([a, b, c]) => {
      setRows(a.data.data);
      setCustomers(b.data.data);
      setProcurements(c.data.data);
    });
  useEffect(() => {
    load();
  }, []);
  const save = async (e) => {
    e.preventDefault();
    await api.post("/shipments", {
      ...form,
      procurementId: form.procurementId || undefined,
      weight: +form.weight,
      packageCount: +form.packageCount,
    });
    setShow(false);
    load();
  };
  const status = async (id, s) => {
    await api.put("/shipments/" + id + "/status", {
      status: s,
      location: "",
      note: "Updated from frontend",
    });
    load();
  };
  const upload = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await api.post("/shipments/" + uploadId + "/documents", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setUploadId("");
    load();
  };
  return (
    <>
      <PageHeader
        title="Shipments"
        subtitle="Create shipments, update status and upload shipping documents."
      />
      <button className="btn primary" onClick={() => setShow(true)}>
        + New Shipment
      </button>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tracking No</th>
              <th>Customer</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Mode</th>
              <th>Status</th>
              <th>Docs</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x._id}>
                <td>
                  <b>{x.trackingNo}</b>
                </td>
                <td>{getName(x, "customerId")}</td>
                <td>{x.originCountry}</td>
                <td>{x.destination}</td>
                <td>{x.shippingMode}</td>
                <td>
                  <span className="badge">{x.status}</span>
                </td>
                <td>
                  <button
                    className="btn ghost"
                    onClick={() => setUploadId(x._id)}
                  >
                    Upload
                  </button>{" "}
                  {x.documents?.length || 0}
                </td>
                <td>
                  <select
                    value={x.status}
                    onChange={(e) => status(x._id, e.target.value)}
                  >
                    {[
                      "Pending",
                      "Received",
                      "In Transit",
                      "At Border",
                      "Customs Clearance",
                      "In Warehouse",
                      "Out for Delivery",
                      "Delivered",
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
        <Modal title="New Shipment" onClose={() => setShow(false)}>
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
            {[
              "originCountry",
              "originAddress",
              "destination",
              "weight",
              "packageCount",
              "estimatedDeliveryDate",
            ].map((k) => (
              <input
                key={k}
                type={
                  k.includes("Date")
                    ? "date"
                    : ["weight", "packageCount"].includes(k)
                      ? "number"
                      : "text"
                }
                placeholder={k}
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            ))}
            <select
              value={form.shippingMode}
              onChange={(e) =>
                setForm({ ...form, shippingMode: e.target.value })
              }
            >
              {["Road", "Air", "Sea", "Sea + Road"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button className="btn primary">Save</button>
          </form>
        </Modal>
      )}
      {uploadId && (
        <Modal title="Upload Documents" onClose={() => setUploadId("")}>
          <form onSubmit={upload} className="grid-form">
            <input name="documents" type="file" multiple />
            <button className="btn primary">Upload</button>
          </form>
        </Modal>
      )}
    </>
  );
}
